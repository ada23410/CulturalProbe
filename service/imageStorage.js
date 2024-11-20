const path = require('path');
const { downloadContent } = require('./mediaDownload');
const { uploadToFirebase } = require('./imageStorage');

const processMedia = async (message, options = { saveToLocal: false, uploadToFirebase: false }) => {
  try {
    // Channel Access Token
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    // 本地保存邏輯
    if (options.saveToLocal) {
      const localDir = path.resolve(__dirname, '../../downloads'); // 保存的目錄
      const extension =
        message.type === 'image'
          ? '.jpg'
          : message.type === 'video'
          ? '.mp4'
          : message.type === 'audio'
          ? '.m4a'
          : '';
      const localPath = path.join(localDir, `${message.id}${extension}`);

      // 調用下載方法
      const downloadedPath = await downloadContent(message.id, accessToken, localPath);
      console.log(`文件已保存到本地: ${downloadedPath}`);
      return { type: 'local', path: downloadedPath };
    }

    // Firebase 上傳邏輯
    if (options.uploadToFirebase) {
      const fileName = `uploads/${Date.now()}-${message.id}`;
      const contentType =
        message.type === 'image'
          ? 'image/jpeg'
          : message.type === 'video'
          ? 'video/mp4'
          : 'audio/m4a';

      // 調用下載方法以獲取流
      const tempPath = path.join(__dirname, '../../temp', `${message.id}`);
      await downloadContent(message.id, accessToken, tempPath);

      // 讀取文件流並上傳到 Firebase
      const fileStream = fs.createReadStream(tempPath);
      const publicUrl = await uploadToFirebase(fileStream, fileName, contentType);

      // 刪除臨時文件
      fs.unlinkSync(tempPath);

      console.log(`文件已上傳到 Firebase: ${publicUrl}`);
      return { type: 'firebase', url: publicUrl };
    }

    throw new Error('No valid processing option provided.');
  } catch (error) {
    console.error('多媒體處理失敗:', error.message);
    throw new Error(`多媒體處理失敗: ${error.message}`);
  }
};

module.exports = { processMedia };
