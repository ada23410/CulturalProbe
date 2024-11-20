const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadContent = async (messageId, accessToken, downloadPath) => {
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'stream',
    });

    const dir = path.dirname(downloadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(downloadPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('下载多媒体内容失败:', error.message);
    throw error;
  }
};

module.exports = { downloadContent };
