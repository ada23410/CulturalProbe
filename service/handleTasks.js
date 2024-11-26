const line = require('@line/bot-sdk');
const replyToUser = require('./replyContent');
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

console.log(client);

// 處理任務相關邏輯
const handleTasks = async (replyToken, userId, text ) => {
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
                            url: "https://developers-resource.landpress.line.me/fx/img/01_5_carousel.png"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "任務一",
                                    weight: "bold",
                                    size: "xl"
                                },
                                {
                                    type: "text",
                                    text: "這是任務一的描述",
                                    wrap: true,
                                    size: "sm"
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
                                        label: "詳細說明任務一",
                                        text: "詳細說明任務一"
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
                            url: "https://developers-resource.landpress.line.me/fx/img/01_5_carousel.png"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "任務二",
                                    weight: "bold",
                                    size: "xl"
                                },
                                {
                                    type: "text",
                                    text: "這是任務二的描述",
                                    wrap: true,
                                    size: "sm"
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
                                        label: "詳細說明任務二",
                                        text: "詳細說明任務二"
                                    },
                                    style: "primary"
                                }
                            ]
                        }
                    }
                ]
            }
        };     
        await client.replyToUser(replyToken, flexMessage);
        console.log('成功回覆 Flex Message');
    } catch (error) {
        console.error('處理任務失敗:', error.message);
        throw new Error('任務處理失敗');
    }
};

module.exports = { handleTasks };
