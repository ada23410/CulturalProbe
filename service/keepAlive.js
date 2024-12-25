const axios = require('axios');

// Keep-Alive URL 和間隔時間
const WEB_SERVICE_URL = "https://culturalprobe.onrender.com";
const INTERVAL_TIME = 3600000; // 1 小時

const keepAlive = async () => {
    try {
        const response = await axios.get(WEB_SERVICE_URL);
        console.log("Keep-Alive 請求成功:", response.status);
    } catch (error) {
        console.error("Keep-Alive 請求失敗:", error.message);
    }
};

// 定時器設置
const startKeepAlive = () => {
    console.log("Keep-Alive 機制已啟動，每小時向服務器發送一次請求。");
    setInterval(keepAlive, INTERVAL_TIME);
};

module.exports = { startKeepAlive };
