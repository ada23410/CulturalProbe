const line = require('@line/bot-sdk');
const replyToUser = require('./replyContent');

// 處理任務相關邏輯
const handleTasks = async (replyToken) => {
    try {
        const flexMessage = {
            type: "flex",
            altText: "任務列表",
            contents: {
                type: "carousel",
                contents: [
                    // 階段一：每日活動紀錄
                    createTaskBubble("階段一：每日活動紀錄", "詳細說明-每日活動紀錄"),
                    // 階段二：情境紀錄卡
                    createTaskBubble("階段二：情境紀錄卡", "詳細說明-情境紀錄卡"),
                    // 階段三：社交情境日記
                    createTaskBubble("階段三：社交情境日記", "詳細說明-社交情境日記"),
                    // 階段四：感受連連看
                    createTaskBubble("階段四：感受連連看", "詳細說明-感受連連看")
                ]
            }
        };

        await replyToUser(replyToken, flexMessage);
        console.log('成功回覆 Flex Message');
    } catch (error) {
        console.error('處理任務失敗:', error.message);
        throw new Error('任務處理失敗');
    }
};

// 創建任務的 Bubble 結構
const createTaskBubble = (taskTitle, detailText) => {
    return {
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: taskTitle,
                    weight: "bold",
                    size: "md"
                }
            ]
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "詳細說明",
                        text: detailText
                    },
                    style: "primary"
                }
            ]
        }
    };
};

module.exports = { handleTasks };
