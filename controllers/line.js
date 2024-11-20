const { processMedia } = require('../service/imageStorage');
const { saveText } = require('../models/textModel');

const handleLineWebhook = async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message') {
      const message = event.message;

      if (message.type === 'text') {
        // 保存文字到 MongoDB
        try {
          await saveText(event.source.userId, message.text);
          console.log('文字消息保存成功');
        } catch (error) {
          console.error('保存文字消息失败:', error);
        }
      } else if (['image', 'video', 'audio'].includes(message.type)) {
        // 处理多媒体消息
        try {
          const result = await processMedia(message, { saveToLocal: false, uploadToFirebase: true });
          console.log('多媒体处理结果:', result);
        } catch (error) {
          console.error('处理多媒体消息失败:', error);
        }
      }
    }
  }

  res.status(200).end();
};

module.exports = { handleLineWebhook };
