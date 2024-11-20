const path = require('path');
const fs = require('fs');
const { downloadContent } = require('./mediaDownload');
const { uploadToFirebase } = require('./firebaseUpload');

const processMedia = async (message, options = { saveToLocal: false, uploadToFirebase: false }) => {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    // 保存到本地
    if (options.saveToLocal) {
      const localDir = path.resolve(__dirname, '../../downloads');
      const extension =
        message.type === 'image' ? '.jpg' :
        message.type === 'video' ? '.mp4' :
        message.type === 'audio' ? '.m4a' : '';
      const localPath = path.join(localDir, `${message.id}${extension}`);

      const downloadedPath = await downloadContent(message.id, accessToken, localPath);
      console.log(`文件已保存到本地: ${downloadedPath}`);
      return { type: 'local', path: downloadedPath };
    }

    // 上传到 Firebase
    if (options.uploadToFirebase) {
      const fileName = `uploads/${Date.now()}-${message.id}`;
      const contentType =
        message.type === 'image' ? 'image/jpeg' :
        message.type === 'video' ? 'video/mp4' :
        message.type === 'audio' ? 'audio/m4a' : '';

      const tempPath = path.join(__dirname, '../../temp', `${message.id}`);
      await downloadContent(message.id, accessToken, tempPath);

      const fileStream = fs.createReadStream(tempPath);
      const publicUrl = await uploadToFirebase(fileStream, fileName, contentType);

      fs.unlinkSync(tempPath);

      console.log(`文件已上传到 Firebase: ${publicUrl}`);
      return { type: 'firebase', url: publicUrl };
    }

    throw new Error('No valid processing option provided.');
  } catch (error) {
    console.error('多媒体处理失败:', error.message);
    throw new Error(`多媒体处理失败: ${error.message}`);
  }
};

module.exports = { processMedia };
