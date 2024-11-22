const { bucket } = require('./firebase'); // firebase admin

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    try {
      console.log('上傳文件至 Firebase:', fileName, '內容類型:', contentType);
      const blob = bucket.file(fileName); // 建議上傳對象
      if (!blob) {
        console.error('無法創建 blob 實例');
        throw new Error('無法創建 Firebase Storage 文件實例');
      }
      console.log('準備將文件上傳到 Firebase:', fileName);

      const blobStream = blob.createWriteStream({
        metadata: { contentType },
      });

      return new Promise((resolve, reject) => {
        blobStream.on('finish', async () => {
          try {
            const [url] = await blob.getSignedUrl({
              action: 'read',
              expires: '12-31-2500', // 設定有效期限
            });
            console.log('音訊已成功上傳到 Firebase，公開 URL:', url);
            resolve(url);
          } catch (error) {
            console.error('取得公開 URL 失敗:', error.message);
            reject(new Error('取得公開 URL 失敗'));
          }
        });

        blobStream.on('error', (error) => {
          console.error('文件上傳過程中失敗:', error.message);
          reject(new Error('文件上傳到 Firebase 失敗'));
        });

        // 寫入 Buffer
        blobStream.end(buffer);
      });
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
