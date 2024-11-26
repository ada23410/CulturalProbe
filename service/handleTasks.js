const { client } = require('../service/lineClient');

// 處理任務相關邏輯
const handleTasks = async (replyToken, taskCommand) => {
    try {
        let replyMessage = '';
        if (taskCommand === '查看任務一詳細說明') {
            replyMessage = '任務一內容：\n1. 記錄您過去三天的飲食。\n2. 請記錄每餐的時間、內容和份量。\n3. 回覆此帳號即可完成。';
        } else if (taskCommand === '查看任務二詳細說明') {
            replyMessage = '任務二內容：\n1. 記錄過去一週的運動習慣。\n2. 記錄每天運動時長和類型。\n3. 回覆此帳號即可完成。';
        } else if (taskCommand === '查看任務三詳細說明') {
            replyMessage = '任務三內容：\n1. 請記錄您的睡眠時間和睡眠質量。\n2. 回覆此帳號即可完成。';
        } else {
            replyMessage = '抱歉，未能識別您的任務指令。請嘗試點擊任務清單中的按鈕。';
        }

        await client.replyMessage(replyToken, {
            type: 'text',
            text: replyMessage,
        });
    } catch (error) {
        console.error('處理任務失敗:', error.message);
        throw new Error('任務處理失敗');
    }
};

module.exports = { handleTasks };