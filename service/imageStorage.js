const path = require('path');
const fs = require('fs');
const { downloadContent } = require('./mediaDownload');
const bucket = require('./firebase'); // Firebase Storage 初始化

const uploadToFirebase = async (filePath, fileName, contentType) => {
  try {
    console.log('Uploading to Firebase:');
    console.log(`File path: ${filePath}`);
    console.log(`File name: ${fileName}`);
    console.log(`Content type: ${contentType}`);

    const file = bucket.file(fileName);
    const metadata = { contentType };

    // 上傳文件
    await file.save(fs.readFileSync(filePath), { metadata });

    // 設置文件為公開
    await file.makePublic();

    // 返回文件的公开 URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log(`Uploaded to Firebase successfully: ${publicUrl}`);
  } catch (error) {
    console.error('上傳到firebase失敗:', error.message);
    throw new Error('Firebase 上傳失敗');
  }
};

const processMedia = async (message, options = { saveToLocal: false, uploadToFirebase: false }) => {
  try {
    console.log('Processing media message:', message);
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    console.log('Access token loaded:', !!accessToken);


    // 保存到本地
    let localPath;
    if (options.saveToLocal) {
      const localDir = path.resolve(__dirname, '../../downloads');
      console.log('Local directory resolved:', localDir);
      const extension =
            message.type === 'image'
            ? '.jpg'
            : message.type === 'video'
            ? '.mp4'
            : message.type === 'audio'
            ? '.m4a'
            : null;

      if (!extension) {
        console.error(`Unsupported media type: ${message.type}`);
        throw new Error(`Unsupported media type: ${message.type}`);
      }
      localPath = path.join(localDir, `${message.id}${extension}`);
      console.log('Generated localPath:', localPath);
      await downloadContent(message.id, accessToken, localPath);
      console.log(`文件已保存到本地: ${localPath}`);
    }

    // 上传到 Firebase
    if (options.uploadToFirebase && localPath) {
      console.log('Uploading file to Firebase...');
      const fileName = `uploads/${Date.now()}-${message.id}`;
      const contentType =
        message.type === 'image' ? 'image/jpeg' :
        message.type === 'video' ? 'video/mp4' :
        message.type === 'audio' ? 'audio/m4a' : '';

      const publicUrl = await uploadToFirebase(localPath, fileName, contentType);

      console.log(`文件已上傳到 Firebase: ${publicUrl}`);

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
