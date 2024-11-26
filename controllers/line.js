const dotenv= require('dotenv');
dotenv.config({ path: './config.env' });
const path = require('path');
const axios = require('axios');
const { saveText } = require('../service/saveText'); // 保存文字消息
const { uploadToImgur } = require('../service/uploadImgur'); // 上傳到 Imgur
const { fetchContent } = require('../service/getContent'); // 獲取多媒體內容
const { uploadAudioToFirebase } = require('../service/uploadFirebase');
const { handleTasks } = require('../service/handleTasks');
const MediaModel = require('../models/mediaModel'); // media Model

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const taskDetails = {
  "每日活動紀錄": "每日活動紀錄是一個用於追蹤您日常活動的工具，幫助您更好地瞭解自己的生活模式。",
  "情境紀錄卡": "情境紀錄卡用於記錄特定情境下的詳細信息，幫助您分析和改進應對方式。",
  "社交情境日記": "社交情境日記是一個日記工具，用於反思和記錄您在社交場合中的行為與感受。",
  "感受連連看": "感受連連看是一個有趣的活動，幫助您聯繫日常感受與情境之間的關係。",
};

const handleLineWebhook = async (req, res) => { 
  const events = req.body.events; 

  for (const event of events) {// 遍歷Line所收到的訊息
    console.log('接收到的事件:', JSON.stringify(event, null, 2));
    if (!event || !event.type || !event.message) {
      console.error('Invalid event structure:', event);
      continue; // 跳過不完整的事件
    }
    if (event.type === 'message') { // 是否為文字訊息
      const messageType = event.message.type;
      const userId = event.source.userId;

      try {
        // 處理文字消息
        if (messageType === 'text') {
          const text = event.message.text;
          try {
            if (text.startsWith("查看任務")) {
                await handleTasks(replyToken);
            } else if (text.startsWith("詳細說明-")) {
                // 提取任務名稱
                const taskName = text.replace("詳細說明-", "");
                if (taskDetails[taskName]) {
                    await replyToUser(replyToken, {
                        type: "text",
                        text: taskDetails[taskName],
                    });
                } else {
                    await replyToUser(replyToken, {
                        type: "text",
                        text: "抱歉，無法找到對應的任務詳細說明。",
                    });
                }
            } else {
                await replyToUser(replyToken, {
                    type: "text",
                    text: "未識別的指令，請輸入正確的指令。",
                });
            }
          } catch (error) {
              console.error("處理消息失敗:", error.message);
              await replyToUser(replyToken, "處理消息時發生錯誤，請稍後再試！");
          }
        } else if (messageType === 'image') {
          const messageId = event.message.id;
          console.log(`處理圖片訊息, messageId: ${messageId}`);

          // 從 LINE 獲取圖片內容
          const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
            },
            responseType: 'arraybuffer',
          });

          console.log('成功獲取圖片內容，大小:', response.headers['content-length']);
          const base64Content = Buffer.from(response.data).toString('base64');

          // 上傳到 Imgur
          const imgurLink = await uploadToImgur(base64Content);
          console.log('圖片已上傳到 Imgur:', imgurLink);

          // 回覆用戶
          await replyToUser(event.replyToken, `圖片已成功上傳到 Imgur: ${imgurLink}`);

          // 儲存圖片連結到資料庫
          const imageMessage = new MediaModel({
            userId,
            messageType: 'image',
            imgurLink,
          });

          await imageMessage.save();
          console.log('圖片訊息已保存到資料庫:', imgurLink);

        } else if (messageType === 'audio') {
          const messageId = event.message.id;
          console.log(`處理音訊訊息, messageId: ${messageId}`);

          // 獲取音訊內容
          const { buffer, contentType } = await fetchContent(messageId, LINE_ACCESS_TOKEN);
          console.log('成功獲取音訊內容，大小:', buffer.length);

          // 上傳音訊到 Firebase
          const fileName = `audio/${messageId.replace(/[^a-zA-Z0-9]/g, '_')}.${contentType.split('/')[1]}`;
          const firebaseUrl = await uploadAudioToFirebase(buffer, fileName, contentType);
          console.log('音訊已成功上傳到 Firebase:', firebaseUrl);

          // 回覆用戶
          await replyToUser(event.replyToken, `音訊已成功上傳到 Firebase: ${firebaseUrl}`);

          // 儲存音訊到資料庫
          await MediaModel.create({
            userId,
            messageType: 'audio',
            mediaUrl: firebaseUrl,
          });
          console.log('音訊訊息已保存到資料庫:', firebaseUrl);
        }
      } catch (error) {
        console.error('消息處理失敗:', error.message);
        await replyToUser(event.replyToken, '處理消息時發生錯誤，請稍後再試！');
      }
    }
  }

  res.status(200).send('OK');
};

// 回覆用户的方法
const replyToUser = async (replyToken, messages) => {
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/reply',
      {
        replyToken,
        messages: Array.isArray(messages) ? messages : [messages], // 確保傳入的是陣列
      },
      {
        headers: {
          Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('回覆用戶成功:', response.status);
  } catch (error) {
    console.error('回覆用戶失敗:', error.response?.data || error.message);
  }
};

module.exports = { handleLineWebhook };
