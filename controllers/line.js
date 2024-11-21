const axios = require('axios');
const { saveText } = require('../service/saveText'); // 保存文字消息的逻辑
const { uploadToImgur } = require('../service/uploadImgur'); // 上传到 Imgur 的逻辑

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const handleLineWebhook = async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message') {
      const messageType = event.message.type;

      try {
        // 處理文字消息
        if (messageType === 'text') {
          const userId = event.source.userId;
          const text = event.message.text;
          await saveText(userId, text); // 保存到 MongoDB
          console.log('文字消息已保存:', text);
          await replyToUser(event.replyToken, `文字訊息已保存: ${text}`);

        } else if (messageType === 'image') {
          const messageId = event.message.id;
          console.log(`獲取多媒體內容, messageId: ${messageId}`);

          // 獲取圖片內容作為 Buffer
          const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            responseType: 'arraybuffer', // 返回二進制數據
          });

          console.log('成功獲取圖片內容，大小:', response.headers['content-length']);

          // 將內容轉換為 Base64
          const base64Content = Buffer.from(response.data).toString('base64');

          // 上傳到 Imgur
          const imgurLink = await uploadToImgur(base64Content);
          console.log('圖片已上傳到 Imgur:', imgurLink);

          // 回覆用戶
          await replyToUser(event.replyToken, `圖片已成功上傳到 Imgur: ${imgurLink}`);
        }

      } catch (error) {
        console.error('消息處理失敗:', error.message);
        await replyToUser(event.replyToken, '處理消息時發生錯誤，請稍後再試！');
      }
    }
  }

  res.status(200).send('OK');
};

// 回复用户的方法
const replyToUser = async (replyToken, message) => {
  try {
    const response = await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [{ type: 'text', text: message }],
    }, {
      headers: {
        Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('回覆用戶成功:', response.status);
  } catch (error) {
    console.error('回覆用戶失敗', error.response?.data || error.message);
  }
};

module.exports = { handleLineWebhook };
