const line = require('@line/bot-sdk');
const schedule = require('node-schedule');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

const initScheduleTasks = () => {
    console.log("啟動定時任務...");

    // 定時任務：每天上午 9:00 發送訊息
    schedule.scheduleJob('50 10 * * *', async () => {
        try {
            const message = {
                type: 'text',
                text: '早安！記得完成每日活動哦！'
            };

            await client.pushMessage(process.env.LINE_USER_ID, message);
            console.log('定時訊息已發送');
        } catch (error) {
            console.error('發送定時訊息失敗:', error.message);
        }
    });
};

module.exports = initScheduleTasks;
