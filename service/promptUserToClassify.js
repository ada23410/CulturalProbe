const line = require('@line/bot-sdk');
const replyToUser = require('./replyContent');

const promptUserToClassify = async (userId, replyToken) => {
    try {
        const tempContents = await TempStorageModel.find({ userId });

        if (tempContents.length === 0) {
            await replyToUser(replyToken, {
                type: "text",
                text: "目前沒有未分類的任務內容需要處理。",
            });
            return;
        }

        // 返回 Quick Reply，讓用戶選擇分類
        const quickReplyOptions = tempContents.map((temp, index) => ({
            type: "action",
            action: {
                type: "message",
                label: `音訊 ${index + 1}`,
                text: `分類音訊 ${temp._id}`,
            },
        }));

        await replyToUser(replyToken, {
            type: "text",
            text: "以下是未分類的音訊內容，請選擇一個進行分類：",
            quickReply: {
                items: quickReplyOptions,
            },
        });

    } catch (error) {
        console.error("請求分類失敗:", error.message);
        await replyToUser(replyToken, {
            type: "text",
            text: "請求分類時發生錯誤，請稍後再試！",
        });
    }
};

module.exports = promptUserToClassify;
