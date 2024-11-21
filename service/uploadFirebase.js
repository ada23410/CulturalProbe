const { bucket } = require('./firebase');

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
  try {
    console.log('正在將音訊上傳到 Firebase:', fileName);

    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType, // 例如 audio/m4a
      },
      public: true, // 使文件可公開訪問
    });

    // 使用 Buffer 上傳數據
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
      stream.end(buffer);
    });

    // 獲取公開下載連結
    const [publicUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // 長期有效
    });

    console.log('音訊已成功上傳到 Firebase，公開 URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('上傳音訊到 Firebase 失敗:', error.message);
    throw new Error('上傳音訊到 Firebase 失敗');
  }
};

module.exports = { uploadAudioToFirebase };
