const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const axios = require('axios');
const { uploadToImgur } = require('../service/uploadImgur');
const { fetchContent } = require('../service/getContent');
const { uploadAudioToFirebase } = require('../service/uploadFirebase');
const { handleTasks } = require('../service/handleTasks');
const handleTaskSelection = require('../service/handleTaskSelection');
const { classifyContent } = require('../service/classifyContent');
const promptUserToClassify  = require('../service/promptUserToClassify');
const taskDetails = require('../service/taskDetails');
const TempStorageModel = require('../models/tempStorageModel');
const replyToUser = require('../service/replyContent');

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const handleLineWebhook = async (req, res) => {
    const events = req.body.events;

    for (const event of events) {
        console.log('接收到的事件:', JSON.stringify(event, null, 2));

        // 驗證事件
        if (!event || !event.type || !event.message) {
            console.error('Invalid event structure:', event);
            continue;
        }

        if (event.type === 'message') {
            const { type: messageType, text, id: messageId } = event.message;
            const userId = event.source.userId;
            const replyToken = event.replyToken;

            try {
                // 根據消息類型處理
                switch (messageType) {
                    case 'text':
                        await handleTextMessage(text, userId, replyToken);
                        break;
                    case 'image':
                        await handleImageMessage(messageId, userId, replyToken);
                        break;
                    case 'audio':
                        await handleAudioMessage(messageId, userId, replyToken);
                        break;
                    default:
                        console.warn(`未知的消息類型: ${messageType}`);
                        await replyToUser(replyToken, { type: "text", text: "不支持的消息類型。" });
                }
            } catch (error) {
                console.error('消息處理失敗:', error.message);
                await replyToUser(replyToken, {
                    type: "text",
                    text: "處理消息時發生錯誤，請稍後再試！",
                });
            }
        }
    }

    res.status(200).send('OK');
};

// 處理文字消息
// 處理文字消息
const handleTextMessage = async (text, userId, replyToken) => {
    try {
        switch (text) {
            case "查看任務":
                await handleTasks(replyToken); // 顯示任務列表
                break;

            case "操作指南":
                await replyToUser(replyToken, {
                    type: "text",
                    text: "歡迎使用！請按照以下步驟完成操作：\n1. 發送消息進行記錄。\n2. 根據提示完成分類。\n3. 您可以隨時輸入「查看任務」查看當前任務。",
                });
                break;

            case "聯繫客服":
                await replyToUser(replyToken, {
                    type: "text",
                    text: "如果您需要幫助，請聯繫我們的客服。\nEmail: ada10050616@gmail.com\n電話: 0930510214",
                });
                break;

            default:
                if (text.startsWith("詳細說明-")) {
                    const taskName = text.replace("詳細說明-", "");
                    const taskDetail = taskDetails.find(task => task.taskName === taskName);
                    if (taskDetail) {
                        const detailedMessage = formatTaskDetails(taskDetail);
                        await replyToUser(replyToken, { type: "text", text: detailedMessage });
                    } else {
                        await replyToUser(replyToken, { type: "text", text: "找不到對應的任務詳細說明。" });
                    }
                } else if (text.startsWith("分類內容")) {
                    const [, contentId] = text.split(" ");
                    if (contentId) {
                        // 提示用戶選擇分類任務名稱
                        const quickReplyOptions = taskDetails.map(task => ({
                            type: "action",
                            action: {
                                type: "message",
                                label: task.taskName,
                                text: `分類任務 ${contentId} ${task.taskName}`,
                            },
                        }));

                        await replyToUser(replyToken, {
                            type: "text",
                            text: "請選擇任務名稱進行分類：",
                            quickReply: {
                                items: quickReplyOptions,
                            },
                        });
                    } else {
                        await replyToUser(replyToken, { type: "text", text: "無法識別要分類的內容。" });
                    }
                } else if (text.startsWith("分類任務")) {
                    const [, contentId, taskName] = text.split(" ");
                    if (contentId && taskName) {
                        await classifyContent(userId, taskName, replyToken, contentId);
                    } else {
                        await replyToUser(replyToken, { type: "text", text: "分類操作失敗，請重新嘗試。" });
                    }
                } else {
                    // 存儲文字並提示分類
                    await TempStorageModel.create({
                        userId,
                        content: text,
                        contentType: "text",
                        timestamp: new Date(),
                    });
                    await promptUserToClassify(userId, replyToken);
                }
                break;
        }
    } catch (error) {
        console.error("處理文字消息失敗:", error.message);
        await replyToUser(replyToken, {
            type: "text",
            text: "處理文字消息時發生錯誤，請稍後再試！",
        });
    }
};

// 處理圖片消息
const handleImageMessage = async (messageId, userId, replyToken) => {
    try {
        const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${LINE_ACCESS_TOKEN}` },
            responseType: 'arraybuffer',
        });

        const base64Content = Buffer.from(response.data).toString('base64');
        const imgurLink = await uploadToImgur(base64Content);

        console.log('圖片已上傳到 Imgur:', imgurLink);

        // 暫存圖片到 TempStorageModel
        await TempStorageModel.create({
            userId,
            content: imgurLink,
            contentType: "image",
            timestamp: new Date(),
        });

        // 提示用戶分類
        await promptUserToClassify(userId, replyToken);
    } catch (error) {
        console.error("圖片處理失敗:", error.message);
        await replyToUser(replyToken, { type: "text", text: "處理圖片時發生錯誤，請稍後再試！" });
    }
};

// 處理音訊消息
const handleAudioMessage = async (messageId, userId, replyToken) => {
    try {
        const { buffer, contentType } = await fetchContent(messageId, LINE_ACCESS_TOKEN);
        const fileName = `audio/${messageId.replace(/[^a-zA-Z0-9]/g, '_')}.${contentType.split('/')[1]}`;
        const firebaseUrl = await uploadAudioToFirebase(buffer, fileName, contentType);

        console.log('音訊已成功上傳到 Firebase:', firebaseUrl);

        // 暫存音訊到 TempStorageModel
        await TempStorageModel.create({
            userId,
            content: firebaseUrl,
            contentType: "audio",
            timestamp: new Date(),
        });

        // 提示用戶分類
        await promptUserToClassify(userId, replyToken);
    } catch (error) {
        console.error("音訊處理失敗:", error.message);
        await replyToUser(replyToken, { type: "text", text: "處理音訊時發生錯誤，請稍後再試！" });
    }
};

// 格式化任務詳細說明
const formatTaskDetails = (taskDetail) => {
    let detailedMessage = `${taskDetail.description.instructions}\n\n`;
    taskDetail.description.sections.forEach((section, index) => {
        detailedMessage += `${index + 1}. ${section.title}\n`;
        detailedMessage += `- 詳細說明: ${section.details}\n`;
        detailedMessage += `- 範例: ${section.example}\n\n`;
    });
    detailedMessage += `最後步驟: ${taskDetail.description.finalStep}`;
    return detailedMessage;
};

module.exports = { handleLineWebhook };