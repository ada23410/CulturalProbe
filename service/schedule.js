require('dotenv').config();
const line = require('@line/bot-sdk');
const schedule = require('node-schedule');

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient(config);

// 定時任務：每天上午 9:00 發送訊息
const job = schedule.scheduleJob('40 10 * * *', async () => {
    try {
        const message = {
            type: 'text',
            text: '早安！記得完成每日活動哦！'
        };

        // 推送訊息到特定用戶
        await client.pushMessage(process.env.LINE_USER_ID, message);
        console.log('訊息已發送');
    } catch (error) {
        console.error('發送訊息失敗:', error.message);
    }
});
