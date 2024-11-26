const axios = require('axios');

const replyToUser = async (replyToken, messages) => {
    const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
    };

    try {
        // 發送 POST 請求
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/reply',
            {
                replyToken,
                messages: Array.isArray(messages) ? messages : [messages], // 確保傳入的 messages 是陣列
            },
            { headers }
        );

        console.log("成功回覆用戶:", response.status);
        return response; // 返回回應物件以便後續處理
    } catch (error) {
        console.error("回覆用戶失敗:", error.response?.data || error.message);
        throw new Error("回覆用戶時發生錯誤");
    }
};

module.exports = replyToUser;