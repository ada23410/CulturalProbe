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
        },
        contentType: { 
            type: String, 
            required: true 
        },
        timestamp: { 
            type: Date, 
            default: Date.now 
        }, 
    },
    {
        versionKey: false // 去除資料庫欄位的__v
    }
);

const TempStorageModel = mongoose.model('TempStorage', TempStorageSchema);

module.exports = TempStorageModel;