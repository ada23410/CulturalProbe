const { saveText } = require('../service/saveText'); // 保存文字消息的逻辑
const { uploadToImgur } = require('../service/uploadImgur'); // 上传到 Imgur 的逻辑
const { fetchContent } = require('../service/getContent'); // 获取图片内容的逻辑

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const handleLineWebhook = async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message') {
      const messageType = event.message.type;

      try {
        if (messageType === 'text') {
          // 处理文字消息
          const userId = event.source.userId;
          const text = event.message.text;
          await saveText(userId, text); // 保存文字消息到 MongoDB
          console.log('文字消息已保存:', text);

        } else if (messageType === 'image') {
          // 处理图片消息
          const messageId = event.message.id;

          // 从 LINE 获取图片内容
          console.log(`獲取多媒體內容, messageId: ${messageId}`);
          const content = await fetchContent(messageId, LINE_ACCESS_TOKEN);
          const base64Content = Buffer.from(content).toString('base64'); // 转换为 Base64

          // 上传图片到 Imgur
          const imgurLink = await uploadToImgur(base64Content);

          console.log('圖片已成功上傳到 Imgur:', imgurLink);

          // 回复用户上传成功的信息
          await replyToUser(event.replyToken, `图片已成功上传！連結：${imgurLink}`);
        } else {
          console.warn(`收到不支持的訊息類型: ${messageType}`);
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
