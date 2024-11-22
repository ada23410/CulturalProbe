const { bucket } = require('./firebase');

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    try {
      console.log('準備將文件上傳到 Firebase:', fileName);

      const file = bucket.file(fileName); // 取得檔案目標
      if (!file) throw new Error('無法初始化 Firebase File');
  
      const stream = file.createWriteStream({
        metadata: { contentType }, // 設定文件類型
      });
  
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
        stream.end(buffer); // 將 buffer 寫入流
      });
  
      console.log('文件已成功上傳到 Firebase:', fileName);
  
      // 設置文件為公開訪問
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      console.log('文件的公開 URL:', publicUrl);
  
      return publicUrl;
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
