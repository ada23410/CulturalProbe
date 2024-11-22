const axios = require('axios');
const { uploadAudioToFirebase } = require('../service/uploadFirebase');

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// 從 LINE 獲取多媒體內容
const fetchContent = async (event) => {
  try {
    console.log(`開始從 LINE 獲取內容, messageId: ${messageId}`);

    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // 接收二進制數據
    });

    console.log('成功接收音訊內容:');
    console.log('Headers:', response.headers);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);

    return { buffer: response.data, contentType: response.headers['content-type'] };
  } catch (error) {
    console.error('處理音訊訊息失敗:', error.message);
    throw new Error(`音訊處理失敗: ${error.message}`);
  }
};

module.exports = { fetchContent };
