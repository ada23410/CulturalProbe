const storage = require('./firebase');
const fs = require('fs');

const uploadToFirebase = async (filePath, destination) => {
    try {
        console.log('上傳音訊到 Firebase:', localPath);
    
        const file = bucket.file(remoteFileName);
        await bucket.upload(localPath, {
          destination: file,
          public: true,
          metadata: {
            contentType: 'audio/m4a', // 根據實際音訊格式設置 MIME 類型
          },
        });
    
        // 獲取公開下載連結
        const [publicUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // 長期有效的下載連結
        });
    
        console.log('音訊已成功上傳到 Firebase，公開 URL:', publicUrl);
        return publicUrl;
    } catch (error) {
    console.error('上傳音訊到 Firebase 失敗:', error.message);
    throw new Error('上傳音訊到 Firebase 失敗');
    }
};

module.exports = { uploadToFirebase };
