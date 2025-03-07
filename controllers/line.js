const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const axios = require('axios');
const { uploadToImgur } = require('../service/uploadImgur');
const { fetchContent } = require('../service/getContent');
const { uploadAudioToFirebase } = require('../service/uploadFirebase');
const { handleTasks } = require('../service/handleTasks');
const { classifyContent } = require('../service/classifyContent');
const promptUserToClassify  = require('../service/promptUserToClassify');
const taskDetails = require('../service/taskDetails');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const TempStorageModel = require('../models/tempStorageModel');
const replyToUser = require('../service/replyContent');
const retryRequest = require('../service/retryRequest');

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const handleLineWebhook = async (req, res, next) => {
    const events = req.body.events;

    for (const event of events) {
        if (!event || !event.type || !event.message) {
            return next(appError(400, 'Invalid event structure', next));
        }

        if (event.type === 'message') {
            const { type: messageType, text, id: messageId } = event.message;
            const userId = event.source.userId;
            const replyToken = event.replyToken;

            switch (messageType) {
                case 'text':
                    await retryRequest(async () => {
                        await handleTextMessage(text, userId, replyToken, next);
                    }, 3, 2000);
                    break;
                case 'image':
                    await retryRequest(async () => {
                        await handleImageMessage(messageId, userId, replyToken, next);
                    }, 3, 2000);
                    break;
                case 'audio':
                    await retryRequest(async () => {
                        await handleAudioMessage(messageId, userId, replyToken, next);
                    }, 3, 2000);
                    break;
                default:
                    await replyToUser(replyToken, { type: "text", text: "不支持的消息類型。" });
            }
        }
    }
    appSuccess(res, 200, 'Webhook event processed successfully');
};

// 處理文字消息
const handleTextMessage = async (text, userId, replyToken, next) => {
    if (!text) return next(appError(400, 'Text message content is empty', next));

    if (text === '查看任務') {
        await handleTasks(replyToken);
    } else if (text === '操作步驟') {
        const imageMessage = {
            type: "image",
            originalContentUrl: "https://i.imgur.com/DrhOeRx.jpeg",
            previewImageUrl: "https://i.imgur.com/DrhOeRx.jpeg",
        };
        await replyToUser(replyToken, imageMessage);
    } else if (text === '聯繫客服') {
        await replyToUser(replyToken, {
            type: 'text',
            text: '如果您需要幫助，請聯繫我們的客服。\nEmail: ada10050616@gmail.com\n電話: 0930510214',
        });
    } else if(text === '分類內容') {
        const unclassifiedContent = await TempStorageModel.find({ userId, classified: false });

        if (!unclassifiedContent || unclassifiedContent.length === 0) {
            await replyToUser(replyToken, { type: 'text', text: '目前沒有尚未分類的內容。' });
            return;
        }

        const quickReplyOptions = unclassifiedContent.map(content => ({
            type: 'action',
            action: {
                type: 'message',
                label: content.content.substring(0, 20), // 顯示內容摘要
                text: `分類內容 ${content._id}`,
            },
        }));

        await replyToUser(replyToken, {
            type: 'text',
            text: '以下是尚未分類的內容，請選擇一項進行分類：',
            quickReply: { items: quickReplyOptions },
        });
    } else if (text.startsWith('詳細說明-')) {
        const taskName = text.replace('詳細說明-', '');
        const taskDetail = taskDetails.find(task => task.taskName === taskName);
        if (taskDetail) {
            const detailedMessage = formatTaskDetails(taskDetail);
            await replyToUser(replyToken, { type: 'text', text: detailedMessage });
        } else {
            await replyToUser(replyToken, { type: 'text', text: '找不到對應的任務詳細說明。' });
        }
    } else if (text.startsWith('分類內容')) {
        const [, contentId] = text.split(' ');

        if (!contentId) {
            await replyToUser(replyToken, { type: 'text', text: '無法識別要分類的內容。' });
            return;
        }

        const contentToClassify = await TempStorageModel.findOne({ _id: contentId, classified: false });
        if (!contentToClassify) {
            await replyToUser(replyToken, { type: 'text', text: '找不到對應的未分類內容，請重新嘗試。' });
            return;
        }

        const quickReplyOptions = taskDetails.map(task => ({
            type: 'action',
            action: {
                type: 'message',
                label: task.taskName,
                text: `分類任務 ${contentId} ${task.taskName}`,
            },
        }));

        await replyToUser(replyToken, {
            type: 'text',
            text: `請為以下內容選擇一個任務進行分類：\n${contentToClassify.content}`,
            quickReply: { items: quickReplyOptions },
        });
    } else if (text.startsWith('分類任務')) {
        const [, contentId, taskName] = text.split(' ');
        if (contentId && taskName) {
            await classifyContent(userId, taskName, replyToken, contentId);
        } else {
            await replyToUser(replyToken, { type: 'text', text: '分類操作失敗，請重新嘗試。' });
        }
    } else {
        await TempStorageModel.create({
            userId,
            content: text,
            contentType: 'text',
            timestamp: new Date(),
        });
        await promptUserToClassify(userId, replyToken);
    }
};

// 處理圖片消息
const handleImageMessage = async (messageId, userId, replyToken, next) => {
    try {
        const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${LINE_ACCESS_TOKEN}` },
            responseType: 'arraybuffer',
        });

        const base64Content = Buffer.from(response.data).toString('base64');
        const imgurLink = await uploadToImgur(base64Content);

        // 保存圖片消息到資料庫，標記為未分類
        await TempStorageModel.create({
            userId,
            content: imgurLink,
            contentType: 'image',
            classified: false, // 確保設置為未分類
            timestamp: new Date(),
        });

        // 提示用戶進行分類
        await promptUserToClassify(userId, replyToken);
    } catch (error) {
        console.error("處理圖片消息失敗:", error.message);
        await replyToUser(replyToken, {
            type: "text",
            text: "處理圖片消息時發生錯誤，請稍後再試。",
        });
    }
};

// 處理音訊消息
const handleAudioMessage = async (messageId, userId, replyToken, next) => {
    try {
        const { buffer, contentType } = await fetchContent(messageId, LINE_ACCESS_TOKEN);
        const fileName = `audio/${messageId.replace(/[^a-zA-Z0-9]/g, '_')}.${contentType.split('/')[1]}`;
        const firebaseUrl = await uploadAudioToFirebase(buffer, fileName, contentType);

        // 保存語音消息到資料庫，標記為未分類
        await TempStorageModel.create({
            userId,
            content: firebaseUrl,
            contentType: 'audio',
            classified: false, // 確保設置為未分類
            timestamp: new Date(),
        });

        // 提示用戶進行分類
        await promptUserToClassify(userId, replyToken);
    } catch (error) {
        console.error("處理音訊消息失敗:", error.message);
        await replyToUser(replyToken, {
            type: "text",
            text: "處理音訊消息時發生錯誤，請稍後再試。",
        });
    }
};


// 格式化任務詳細說明
const formatTaskDetails = (taskDetail) => {
    let detailedMessage = `${taskDetail.description.instructions}\n\n`;
    taskDetail.description.sections.forEach((section, index) => {
        detailedMessage += `${index + 1}. ${section.title}\n`;
        detailedMessage += `- 詳細說明: ${section.details}\n\n`;
    });
    detailedMessage += `最後步驟: ${taskDetail.description.finalStep}`;
    return detailedMessage;
};

module.exports = { handleLineWebhook };