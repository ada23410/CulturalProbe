const axios = require('axios');

// 获取多媒体内容
const processContent = async (messageId, accessToken) => {
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // 接收二进制数据
    });

    console.log('成功接收内容:');
    console.log('Headers:', response.headers);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);
    return response.data;
  } catch (error) {
    console.error('獲取多媒體內容失敗:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { processContent };
