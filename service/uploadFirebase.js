const { bucket } = require('./firebase');

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    try {
      const fileName = `audio/${messageId}.${contentType.split('/')[1]}`; // 使用 messageId 作為文件名
      const blob = bucket.file(fileName); // 創建文件對象

      console.log('準備將文件上傳到 Firebase:', fileName);

      const blobStream = blob.createWriteStream({
        metadata: { contentType }, // 設置文件類型
      });

      return new Promise((resolve, reject) => {
        blobStream.on('finish', async () => {
          try {
            console.log('文件已成功上傳到 Firebase:', fileName);

            // 取得檔案的公開 URL
            const [fileUrl] = await blob.getSignedUrl({
              action: 'read',
              expires: '12-31-2500', // 設定公開 URL 的有效期限
            });
            console.log('檔案的公開 URL:', fileUrl);
            resolve(fileUrl);
          } catch (error) {
            console.error('取得檔案公開 URL 失敗:', error.message);
            reject(new Error('取得檔案公開 URL 失敗'));
          }
        });

        blobStream.on('error', (error) => {
          console.error('上傳過程中發生錯誤:', error.message);
          reject(new Error('文件上傳到 Firebase 失敗'));
        });

        // 將 buffer 寫入流
        blobStream.end(buffer);
      });
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
