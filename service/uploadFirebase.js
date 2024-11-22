const { bucket } = require('./firebase'); // firebase admin

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    try {
      console.log('Bucket 名稱:', bucket.name);
      if (!bucket.name) {
        throw new Error('Firebase Storage Bucket 未正確初始化');
      }
      const file = bucket.file(fileName);
      console.log('準備將文件上傳到 Firebase:', fileName);
      if (!fileName) {
        throw new Error('fileName 為空，無法創建文件對象');
      }

      // 創建寫入流，將文件數據寫入 Storage
      const stream = file.createWriteStream({
        metadata: {
          contentType: contentType,
        },
      });

      return new Promise((resolve, reject) => {
        stream.on('finish', async () => {
          try {
            // 獲取下載 URL
            const [url] = await file.getSignedUrl({
              action: 'read',
              expires: '12-31-2500',
            });
            console.log('文件已成功上傳到 Firebase，公開 URL:', url);
            resolve(url);
          } catch (error) {
            console.error('獲取公開 URL 失敗:', error.message);
            reject(new Error('獲取公開 URL 失敗'));
          }
        });

        stream.on('error', (error) => {
          console.error('文件上傳過程中失敗:', error.message);
          reject(new Error('文件上傳到 Firebase 失敗'));
        });

        // 將 Buffer 寫入流
        stream.end(buffer);
      });
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
