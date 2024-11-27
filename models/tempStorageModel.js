const mongoose = require('mongoose');

const TempStorageSchema = new mongoose.Schema(
    {
        userId: { 
            type: String, 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        }, // 可以存放內容的 URL 或文字
        contentType: { 
            type: String, 
            required: true 
        }, // 'text', 'image', 'audio'
        timestamp: { 
            type: Date, 
            default: Date.now 
        }, // 上傳時間
    },
    {
        versionKey: false // 去除資料庫欄位的__v
    }
);

const TempStorageModel = mongoose.model('TempStorage', TempStorageSchema);

module.exports = TempStorageModel;