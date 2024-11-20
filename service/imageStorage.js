const admin = require('./firebase'); // 初始化 Firebase
const bucket = admin.storage().bucket();

// 上傳檔案到 Firebase 的核心邏輯
const uploadToFirebase = async (contentStream, fileName, contentType) => {
  try {
    const file = bucket.file(fileName);

    const metadata = {
      contentType,
    };

    // 上傳檔案到 Firebase
    await new Promise((resolve, reject) => {
      const writeStream = file.createWriteStream({ metadata });
      contentStream
        .pipe(writeStream)
        .on('finish', resolve) // 上傳完成
        .on('error', reject); // 發生錯誤
    });

    // 設定檔案為公開
    await file.makePublic();

    // 返回檔案的公開 URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error('上傳到 Firebase 失敗:', error);
    throw new Error('Firebase 上傳失敗');
  }
};

// 使用 Line Messaging API 處理多媒體消息
const processMedia = async (client, message) => {
  try {
    const contentStream = await client.getMessageContent(message.id); // 獲取文件內容流
    const fileName = `uploads/${Date.now()}-${message.id}`;
    const contentType =
      message.type === 'image'
        ? 'image/jpeg'
        : message.type === 'video'
        ? 'video/mp4'
        : 'audio/m4a';

    // 調用上傳函數，將文件上傳到 Firebase
    const publicUrl = await uploadToFirebase(contentStream, fileName, contentType);
    console.log(`多媒體上傳成功，公開 URL: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error('多媒體處理失敗:', error);
    throw new Error('多媒體檔案處理失敗');
  }
};

module.exports = { processMedia };
