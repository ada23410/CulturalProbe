const line = require('@line/bot-sdk');
const replyToUser = require('./replyContent');

// 處理任務相關邏輯
const handleTaskSelection = async (userId, replyToken) => {
    try {
        const quickReplyOptions = [
            {
                type: "action",
                action: {
                    type: "message",
                    label: "每日活動紀錄",
                    text: "選擇任務 每日活動紀錄",
                },
            },
            {
                type: "action",
                action: {
                    type: "message",
                    label: "情境紀錄卡",
                    text: "選擇任務 情境紀錄卡",
                },
            },
            {
                type: "action",
                action: {
                    type: "message",
                    label: "社交情境日記",
                    text: "選擇任務 社交情境日記",
                },
            },
            {
                type: "action",
                action: {
                    type: "message",
                    label: "感受連連看",
                    text: "選擇任務 感受連連看",
                },
            },
        ];

        const quickReplyMessage = {
            type: "text",
            text: "請選擇任務將內容歸屬：",
            quickReply: {
                items: quickReplyOptions,
            },
        };

        await replyToUser(replyToken, quickReplyMessage);
        console.log("已推送 Quick Reply 任務選項給用戶。");
    } catch (error) {
        console.error("推送任務選擇失敗:", error.message);
        throw new Error("推送任務選擇時發生錯誤");
    }
};

module.exports = handleTaskSelection;
