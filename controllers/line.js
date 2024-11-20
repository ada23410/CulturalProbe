const client = require('../service/lineClient');
const { saveText } = require('../models/textModel');
const { processMedia } = require('../service/images')

const handleLineWebhook = async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message') {
      const message = event.message;

      if (message.type === 'text') {
        // 處理文字消息，儲存到 MongoDB
        try {
          await saveText(event.source.userId, message.text);
          console.log('文字訊息儲存成功');
        } catch (error) {
          console.error('儲存文字訊息失敗:', error);
        }
      } else if (['image', 'video', 'audio'].includes(message.type)) {
        // 處理多媒體消息
        try {
          const publicUrl = await processMedia(client, message); // 調用多媒體處理函數
          console.log(`多媒體訊息儲存成功，公開 URL: ${publicUrl}`);
        } catch (error) {
          console.error('處理多媒體消息失敗:', error);
        }
      }
    }
  }

  res.status(200).end();
};


module.exports = { handleLineWebhook };