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

module.exports = bucket;
