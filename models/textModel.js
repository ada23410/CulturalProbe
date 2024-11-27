const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema(
    {
        userId: String,
        text: String,
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    },
    {
        versionKey: false // 去除資料庫欄位的__v
    }
)

const TextModel = mongoose.model('Text', TextSchema);

module.exports = TextModel;