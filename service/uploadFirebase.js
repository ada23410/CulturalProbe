const admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// 使用環境變數配置 Firebase
const config = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_X509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

// 初始化 Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(config),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app` // 修正 Storage Bucket 格式
});

// 獲取 Storage Bucket 實例
const bucket = admin.storage().bucket();
console.log('Firebase Storage 初始化成功:', bucket.name);

// 上傳音訊至 Firebase
const uploadAudioToFirebase = async (buffer, fileName, contentType) => {
    console.log('開始上傳音訊到 Firebase Storage');
    console.log('上傳的文件名:', fileName);
    console.log('Buffer 大小:', buffer?.length || 'Buffer 不存在');
    console.log('Content-Type:', contentType);

    try {
      // 驗證 bucket 初始化狀態
      if (!bucket || typeof bucket.file !== 'function') {
        throw new Error('Firebase Storage Bucket 未正確初始化或方法不存在');
      }

      // 驗證文件名是否存在
      if (!fileName) {
        throw new Error('fileName 為空，無法創建文件對象');
      }

      // 創建文件對象
      const file = bucket.file(fileName);
      console.log('創建的文件 blob:', file.name);

      // 創建寫入流
      const stream = file.createWriteStream({
        metadata: {
          contentType,
        },
      });
      
      // 返回 Promise，處理寫入邏輯
      return new Promise((resolve, reject) => {
        // 寫入完成
        stream.on('finish', async () => {
            try {
              console.log('文件上傳完成，開始生成公開 URL...');
              const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '12-31-2500', // 設置 URL 有效期
              });
              console.log('文件已成功上傳到 Firebase，公開 URL:', url);
              resolve(url);
            } catch (error) {
              console.error('生成公開 URL 失敗:', error.message);
              reject(new Error('生成公開 URL 失敗'));
            }
          });

          // 寫入失敗
          stream.on('error', (error) => {
            console.error('文件上傳過程中失敗:', error.message);
            reject(new Error('文件上傳到 Firebase 失敗'));
          });

          // 寫入 Buffer
          console.log('開始寫入 Buffer 到 Firebase Storage...');
          stream.end(buffer);
        });
    } catch (error) {
        console.error('文件上傳到 Firebase 失敗:', error.message);
        throw new Error('文件上傳到 Firebase 失敗');
    }
};

module.exports = { uploadAudioToFirebase };
