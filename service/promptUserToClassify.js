const line = require('@line/bot-sdk');
const replyToUser = require('./replyContent');
const TempStorageModel = require('../models/tempStorageModel');

const promptUserToClassify = async (userId, replyToken) => {
    try {
        const tempContents = await TempStorageModel.find({ userId });

        if (tempContents.length === 0) {
            await replyToUser(replyToken, {
                type: "text",
                text: "目前沒有未分類的內容需要處理。",
            });
            return;
        }

        // 生成 Quick Reply 選項
        const quickReplyOptions = tempContents.map((temp, index) => {
            let label = "";
            if (temp.contentType === "audio") label = `音訊 ${index + 1}`;
            else if (temp.contentType === "text") label = `文字 ${index + 1}`;
            else if (temp.contentType === "image") label = `圖片 ${index + 1}`;

            return {
                type: "action",
                action: {
                    type: "message",
                    label: label,
                    text: `分類內容 ${temp._id}`,
                },
            };
        });

        await replyToUser(replyToken, {
            type: "text",
            text: "以下是未分類的內容，請選擇一個進行分類：",
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
