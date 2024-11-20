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

const processMedia = async (messageId, messageType) => {
  try {
    const stream = await client.getMessageContent(messageId);
    const fileName = `uploads/${Date.now()}-${messageId}`;
    const contentType =
      messageType === 'image'
        ? 'image/jpeg'
        : messageType === 'video'
        ? 'video/mp4'
        : 'audio/m4a';

    const publicUrl = await uploadToFirebase(stream, fileName, contentType);
    console.log(`文件已上傳到 Firebase: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('處理多媒體失敗:', error);
    throw new Error('多媒體處理失敗');
  }
};

module.exports = { processMedia };
