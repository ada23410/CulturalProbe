const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
// 配置 Line Messaging API
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient(config);

module.exports = client;