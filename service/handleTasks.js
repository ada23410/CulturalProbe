const line = require('@line/bot-sdk');
const replyToUser = require('./replyContent');
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

// 處理任務相關邏輯
const handleTasks = async (replyToken) => {
    try {
        const flexMessage = {
            type: "flex",
            altText: "任務列表",
            contents: {
                type: "carousel",
                contents: [
                    {
                        type: "bubble",
                        hero: {
                            type: "image",
                            size: "full",
                            aspectRatio: "20:13",
                            aspectMode: "cover",
                            url: "https://i.imgur.com/KUNRp70.jpeg"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "每日活動紀錄",
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
                                        text: "詳細說明-每日活動紀錄"
                                    },
                                    style: "primary"
                                }
                            ]
                        }
                    },
                    {
                        type: "bubble",
                        hero: {
                            type: "image",
                            size: "full",
                            aspectRatio: "20:13",
                            aspectMode: "cover",
                            url: "https://i.imgur.com/KUNRp70.jpeg"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "情境紀錄卡",
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
                                        text: "詳細說明-情境紀錄卡"
                                    },
                                    style: "primary"
                                }
                            ]
                        }
                    },
                    {
                        type: "bubble",
                        hero: {
                            type: "image",
                            size: "full",
                            aspectRatio: "20:13",
                            aspectMode: "cover",
                            url: "https://i.imgur.com/KUNRp70.jpeg"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "社交情境日記",
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
                                        text: "詳細說明-社交情境日記"
                                    },
                                    style: "primary"
                                }
                            ]
                        }
                    },
                    {
                        type: "bubble",
                        hero: {
                            type: "image",
                            size: "full",
                            aspectRatio: "20:13",
                            aspectMode: "cover",
                            url: "https://i.imgur.com/KUNRp70.jpeg"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "感受連連看",
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
                                        text: "詳細說明-感受連連看"
                                    },
                                    style: "primary"
                                }
                            ]
                        }
                    }
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

module.exports = { handleTasks };
