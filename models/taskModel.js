const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        taskName: {
            type: String, // 例如 "每日活動紀錄", "情境紀錄卡"
            required: true,
        },
        content: {
            type: String, // 存儲音訊或圖片的 URL
            required: true,
        },
        contentType: {
            type: String, // 可選 "audio", "image", 或 "text"
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    },
    {
        versionKey: false // 去除資料庫欄位的__v
    }
);

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;