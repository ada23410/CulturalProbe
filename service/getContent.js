const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 从 LINE 获取多媒体内容
const fetchContent = async (messageId, accessToken, fileType) => {
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

    // 儲存到本地端
    const extension = fileType === 'audio' ? '.m4a' : '.jpg'; // 根據文件類型選擇擴展名
    const localPath = path.join('./uploads', `${messageId}${extension}`);
    fs.writeFileSync(localPath, response.data); // 保存文件
    console.log(`文件已成功保存到: ${localPath}`);

    return localPath; // 返回本地文件路徑
  } catch (error) {
    console.error('获取内容失败:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchContent };
