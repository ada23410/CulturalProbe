const path = require('path');
const fs = require('fs');
const { downloadContent } = require('./mediaDownload');
const bucket = require('./firebase'); // Firebase Storage 初始化

const uploadToFirebase = async (filePath, fileName, contentType) => {
  try {
    const file = bucket.file(fileName);
    const metadata = { contentType };

    // 上传文件
    await file.save(fs.readFileSync(filePath), { metadata });

    // 设置文件为公开
    await file.makePublic();

    // 返回文件的公开 URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error('上传到 Firebase 失败:', error.message);
    throw new Error('Firebase 上传失败');
  }
};

const processMedia = async (message, options = { saveToLocal: false, uploadToFirebase: false }) => {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    // 保存到本地
    let localPath;
    if (options.saveToLocal) {
      const localDir = path.resolve(__dirname, '../../downloads');
      const extension =
        message.type === 'image' ? '.jpg' :
        message.type === 'video' ? '.mp4' :
        message.type === 'audio' ? '.m4a' : '';
      localPath = path.join(localDir, `${message.id}${extension}`);

      await downloadContent(message.id, accessToken, localPath);
      console.log(`文件已保存到本地: ${localPath}`);
    }

    // 上传到 Firebase
    if (options.uploadToFirebase && localPath) {
      const fileName = `uploads/${Date.now()}-${message.id}`;
      const contentType =
        message.type === 'image' ? 'image/jpeg' :
        message.type === 'video' ? 'video/mp4' :
        message.type === 'audio' ? 'audio/m4a' : '';

      const publicUrl = await uploadToFirebase(localPath, fileName, contentType);

      console.log(`文件已上传到 Firebase: ${publicUrl}`);

      // 如果不需要本地文件，删除它
      if (!options.saveToLocal) {
        fs.unlinkSync(localPath);
      }

      return { type: 'firebase', url: publicUrl };
    }

    return { type: 'local', path: localPath };
  } catch (error) {
    console.error('多媒体处理失败:', error.message);
    throw new Error(`多媒体处理失败: ${error.message}`);
  }
};

module.exports = { processMedia };
