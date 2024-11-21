const axios = require('axios');
const fs = require('fs');

const downloadContent = async (messageId, accessToken, downloadPath) => {
  const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    responseType: 'stream',
  });
  const writer = fs.createWriteStream(downloadPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(downloadPath));
    writer.on('error', reject);
  });
};

module.exports = { downloadContent };
