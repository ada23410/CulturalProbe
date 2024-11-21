const { bucket } = require('./firebase');

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    try {
        console.log('準備將文件上傳到 Firebase:', fileName);
    
        const file = bucket.file(fileName);
    
        const stream = file.createWriteStream({
          metadata: {
            contentType, // 確保這裡對應音訊的類型，例如 audio/m4a
          },
        });
    
        // 寫入 Buffer 並完成上傳
        await new Promise((resolve, reject) => {
          stream.on('finish', resolve);
          stream.on('error', reject);
          stream.end(buffer);
        });
    
        console.log('文件已成功上傳到 Firebase:', fileName);
    
        // 獲取公開下載連結（根據需要）
        const [publicUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // 長期有效
        });
    
        console.log('Firebase 文件公開 URL:', publicUrl);
        return publicUrl;
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
