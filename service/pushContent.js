const axios = require('axios');

const pushToUser = async (userId, messages) => {
    const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
    };

    try {
        const response = await axios.post(
            "https://api.line.me/v2/bot/message/push",
            {
                to: userId,
                messages: Array.isArray(messages) ? messages : [messages], // 確保是陣列
            },
            { headers }
        );

        console.log("成功推播消息:", response.status);
    } catch (error) {
        console.error("推播用戶失敗:", error.response?.data || error.message);
        throw new Error("推播用戶時發生錯誤");
    }
};

module.exports = pushToUser;
