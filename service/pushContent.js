const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // 用於生成唯一 ID 作為重試鍵

const pushToUser = async (userId, messages) => {
    const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!LINE_ACCESS_TOKEN) {
        throw new Error("LINE_ACCESS_TOKEN 未設定，請檢查環境變數");
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
    };

    try {
        console.log(`推播目標用戶 ID: ${userId}`);
        console.log(`推播消息內容: ${JSON.stringify(messages, null, 2)}`);

        // 發送 POST 請求
        const response = await axios.post(
            "https://api.line.me/v2/bot/message/push",
            {
                to: userId,
                messages: Array.isArray(messages) ? messages : [messages], // 確保傳入的是陣列
                retryKey: uuidv4(), // 唯一重試鍵
            },
            { headers }
        );

        console.log("成功推播消息:", response.status);
        return response; // 返回回應結果
    } catch (error) {
        // 改進錯誤處理
        const errorDetails = error.response?.data || error.message;
        console.error("推播用戶失敗:", errorDetails);
        throw new Error(`推播用戶時發生錯誤: ${errorDetails}`);
    }
};

module.exports = pushToUser;
