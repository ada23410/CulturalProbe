const axios = require('axios');

// 从 LINE 获取多媒体内容
const fetchContent = async (messageId, accessToken) => {
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // 接收二进制数据
    });

    console.log('成功接收内容:');
    console.log('Headers:', response.headers); // 打印响应头
    console.log('Content-Type:', response.headers['content-type']); // 打印内容类型
    console.log('Content-Length:', response.headers['content-length']); // 打印内容大小

    return response.data; // 返回二进制数据
  } catch (error) {
    console.error('获取内容失败:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchContent };
