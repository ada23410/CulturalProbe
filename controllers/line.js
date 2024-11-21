const { handleFileUpload, processUploadedFile } = require('../service/imageStorage');

const handleLineWebhook = async (req, res) => {
  try {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'message' && ['image', 'video', 'audio'].includes(event.message.type)) {
        const messageId = event.message.id;
        const localPath = path.join('./uploads', `${messageId}.jpg`);

        // 下载文件
        await downloadContent(messageId, LINE_CHANNEL_ACCESS_TOKEN, localPath);

        // 上传到 Firebase
        const publicUrl = await processUploadedFile(localPath, { uploadToFirebase: true });
        console.log('文件已上传到 Firebase:', publicUrl);

        // 回复用户
        await replyToUser(event.replyToken, `文件已成功上传: ${publicUrl}`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook 处理失败:', error.message);
    res.status(500).send({ error: 'Webhook 处理失败' });
  }
};

module.exports = { handleLineWebhook };
