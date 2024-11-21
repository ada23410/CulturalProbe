const axios = require('axios');

// 從 LINE 獲取多媒體內容
const fetchContent = async (messageId, accessToken) => {
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // 接收二進制數據
    });

    console.log('成功接收內容:');
    console.log('Headers:', response.headers);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);

    return {
      buffer: response.data, // 二進制數據
      contentType: response.headers['content-type'], // 文件類型
    };
  } catch (error) {
    console.error('獲取內容失敗:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchContent };
