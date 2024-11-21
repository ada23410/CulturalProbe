const axios = require('axios');
const { uploadAudioToFirebase } = require('../service/uploadFirebase');

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// 從 LINE 獲取多媒體內容
const fetchContent = async (event) => {
  const messageId = event.message.id;
  console.log(`開始處理音訊訊息, messageId: ${messageId}`);

  try {
    // 調用 LINE API 獲取音訊
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      },
      responseType: 'arraybuffer', // 接收二進制數據
    });

    console.log('成功接收音訊內容');
    console.log('Content-Length:', response.headers['content-length']);
    console.log('Content-Type:', response.headers['content-type']);

    const buffer = response.data;
    const contentType = response.headers['content-type'];
    const fileExtension = contentType.split('/')[1]; // 提取檔案副檔名

    // 檢查檔案類型
    if (!['m4a', 'mp3', 'wav'].includes(fileExtension)) {
      throw new Error(`不支援的音訊格式: ${fileExtension}`);
    }

    const fileName = `audio/${messageId}.${fileExtension}`;

    // 將音訊上傳到 Firebase
    console.log(`準備將音訊上傳到 Firebase: ${fileName}`);
    const firebaseUrl = await uploadAudioToFirebase(buffer, fileName, contentType);
    console.log('音訊已成功上傳到 Firebase，公開 URL:', firebaseUrl);

    return firebaseUrl;

  } catch (error) {
    console.error('處理音訊訊息失敗:', error.message);
    throw new Error(`音訊處理失敗: ${error.message}`);
  }
};

module.exports = { fetchContent };
