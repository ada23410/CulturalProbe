const path = require('path');
const { saveText } = require('../service/imageStorage');
const { processContent } = require('../service/mediaDownload');

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const handleLineWebhook = async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message') {
      const messageType = event.message.type;

      try {
        // 处理文字消息
        if (messageType === 'text') {
          const userId = event.source.userId;
          const text = event.message.text;
          await saveText(userId, text); // 保存文字消息到 MongoDB
          console.log('文字消息已处理:', text);

        // 处理多媒体消息
        } else if (['image', 'video', 'audio'].includes(messageType)) {
          const messageId = event.message.id;

          // 下载多媒体文件内容并打印响应信息
          console.log(`获取多媒体消息内容, messageId: ${messageId}`);
          await processContent(messageId, LINE_ACCESS_TOKEN);
        } else {
          console.warn(`收到不支持的消息类型: ${messageType}`);
        }

      } catch (error) {
        console.error('消息处理失败:', error.message);
      }
    }
  }

  res.status(200).send('OK');
};

module.exports = { handleLineWebhook };
