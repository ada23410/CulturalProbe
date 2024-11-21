const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadContent = async (messageId, accessToken, downloadPath) => {
  try {
    console.log('Downloading content...');
    console.log(`Message ID: ${messageId}`);
    console.log(`Access Token: ${accessToken ? 'Loaded' : 'Not Loaded'}`);
    console.log(`Download Path: ${downloadPath}`);
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    console.log('Request URL:', url);

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'stream',
    });

    console.log('Received response from LINE API.');

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('File written successfully.');
        resolve(downloadPath);
      });
      writer.on('error', (err) => {
        console.error('Error writing file:', err.message);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Download failed:', error.message);
    return null; // 明确返回 null 表示失败
  }
};

module.exports = { downloadContent };
