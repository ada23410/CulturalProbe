const fs = require('fs');
const path = require('path');
const { uploadToFirebase } = require('./imageStorage');
const client = require('./lineClient'); // Line 客戶端

// 處理多媒體消息
const processMedia = async (message, options = { saveToLocal: false, uploadToFirebase: false }) => {
  try {
    const contentStream = await client.getMessageContent(message.id);

    if (options.saveToLocal) {
      const localPath = path.join(__dirname, '../../downloads', `${message.id}.jpg`);
      const writable = fs.createWriteStream(localPath);
      contentStream.pipe(writable);

      return new Promise((resolve, reject) => {
        writable.on('finish', () => resolve(localPath));
        writable.on('error', reject);
      });
    }

    if (options.uploadToFirebase) {
      const fileName = `uploads/${Date.now()}-${message.id}`;
      const contentType =
        message.type === 'image'
          ? 'image/jpeg'
          : message.type === 'video'
          ? 'video/mp4'
          : 'audio/m4a';

      const publicUrl = await uploadToFirebase(contentStream, fileName, contentType);
      return publicUrl;
    }

    throw new Error('No valid processing option provided.');
  } catch (error) {
    console.error('多媒體處理失敗:', error);
    throw new Error('多媒體處理失敗');
  }
};

module.exports = { processMedia };
