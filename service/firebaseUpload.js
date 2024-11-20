const admin = require('./firebase'); // 初始化 Firebase Admin
const bucket = admin.storage().bucket();

const uploadToFirebase = async (fileStream, fileName, contentType) => {
  try {
    const file = bucket.file(fileName);
    const metadata = { contentType };

    await new Promise((resolve, reject) => {
      const writeStream = file.createWriteStream({ metadata });
      fileStream.pipe(writeStream).on('finish', resolve).on('error', reject);
    });

    await file.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error('上传到 Firebase 失败:', error.message);
    throw new Error('Firebase 上传失败');
  }
};

module.exports = { uploadToFirebase };
