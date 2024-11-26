const line = require('@line/bot-sdk');
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

console.log(client);

// 處理任務相關邏輯
const handleTasks = async (replyToken) => {
    try {
        const flexMessage = {
            type: 'flex',
            altText: '任務清單',
            contents: {
                type: 'carousel',
                contents: [
                {
                    type: 'bubble',
                    body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: '任務一', weight: 'bold', size: 'xl' },
                        { type: 'text', text: '這是任務一的描述', wrap: true, size: 'sm' },
                    ],
                    },
                    footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                        type: 'button',
                        action: { type: 'message', label: '查看任務一', text: '查看任務一' },
                        style: 'primary',
                        },
                    ],
                    },
                },
                {
                    type: 'bubble',
                    body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: '任務二', weight: 'bold', size: 'xl' },
                        { type: 'text', text: '這是任務二的描述', wrap: true, size: 'sm' },
                    ],
                    },
                    footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                        type: 'button',
                        action: { type: 'message', label: '查看任務二', text: '查看任務二' },
                        style: 'primary',
                        },
                    ],
                    },
                },
                ],
            },
            };
        
            await client.replyMessage(replyToken, flexMessage);
            console.log('成功回覆 Flex Message');
    } catch (error) {
        console.error('處理任務失敗:', error.message);
        throw new Error('任務處理失敗');
    }
};

module.exports = { handleTasks };
