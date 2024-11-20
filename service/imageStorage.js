const admin = require('./firebase');
const bucket = admin.storage().bucket();

const uploadToFirebase = async (contentStream, fileName, contentType) => {
  try {
    const file = bucket.file(fileName);

    const metadata = { contentType };

    // 將內容上傳至 Firebase
    await new Promise((resolve, reject) => {
      const writeStream = file.createWriteStream({ metadata });
      contentStream.pipe(writeStream).on('finish', resolve).on('error', reject);
    });

    // 設定文件為公開
    await file.makePublic();

    // 返回公開 URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error('上傳到 Firebase 失敗:', error);
    throw new Error('Firebase 上傳失敗');
  }
};

const processMedia = async (client, message) => {
  console.log(message);
  try {
    const contentStream = await client.getMessageContent(message.id); // 確保 client 正確初始化
    const fileName = `uploads/${Date.now()}-${message.id}`;
    const contentType =
      message.type === 'image'
        ? 'image/jpeg'
        : message.type === 'video'
        ? 'video/mp4'
        : 'audio/m4a';

    // 上傳檔案至 Firebase
    const publicUrl = await uploadToFirebase(contentStream, fileName, contentType);
    console.log(`文件已上傳至 Firebase: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('多媒體處理失敗:', error);
    throw new Error('多媒體檔案處理失敗');
  }
};

module.exports = { processMedia };
