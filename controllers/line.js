const { processUploadedFile, processTextMessage } = require('../service/imageStorage');
const { downloadContent } = require('../service/mediaDownload');

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
          await processTextMessage(userId, text); // 保存到 MongoDB
          console.log('文字消息已处理:', text);

        // 处理多媒体消息
        } else if (['image', 'video', 'audio'].includes(messageType)) {
          const messageId = event.message.id;
          const localPath = path.join('./uploads', `${messageId}.jpg`);

          // 下载多媒体文件
          await downloadContent(messageId, LINE_ACCESS_TOKEN, localPath);

          // 上传到 Firebase
          const publicUrl = await processUploadedFile(localPath, { uploadToFirebase: true });
          console.log('多媒体消息已上传:', publicUrl);
        }

      } catch (error) {
        console.error('消息处理失败:', error.message);
      }
    }
  }

  res.status(200).send('OK');
};

module.exports = { handleLineWebhook };
