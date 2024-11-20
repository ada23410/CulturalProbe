const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadContent = async (messageId, accessToken, downloadPath) => {
  try {
    // 構造請求 URL
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;

    // 發送 GET 請求，帶上 Authorization Header
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 提供 Channel Access Token
      },
      responseType: 'stream', // 獲取數據流
    });

    // 確保目錄存在
    const dir = path.dirname(downloadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 將數據流寫入文件
    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    // 返回 Promise，確保文件已保存完成
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(downloadPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('下載多媒體內容失敗:', error.message);
    throw error;
  }
};

module.exports = { downloadContent };
