const { bucket } = require('./firebase');

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    try {
        console.log('準備將文件上傳到 Firebase:', fileName);
    
        const file = bucket.file(fileName);
        const metadata = {
          contentType: contentType,
        };
        
        const stream = file.createWriteStream({ metadata });
        stream.end(buffer);
    
        return new Promise((resolve, reject) => {
          stream.on('finish', async () => {
            await file.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            console.log('文件已成功上傳到 Firebase:', publicUrl);
            resolve(publicUrl);
          });
    
          stream.on('error', (error) => {
            console.error('文件上傳到 Firebase 失敗:', error.message);
            reject(error);
          });
        });
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
