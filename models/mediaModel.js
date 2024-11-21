const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    }, // 發送者的 LINE ID
    messageType: { 
        type: String, 
        enum: ['image', 'audio', 'video'], 
        required: true 
    }, // 消息類型
    imgurLink: { 
        type: String 
    }, // 如果是圖片，儲存 Imgur 的圖片連結
    localPath: { 
        type: String 
    }, // 如果是音訊或影片，儲存本地檔案路徑
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // 儲存時間
  });
  
module.exports = mongoose.model('Media', MediaSchema);
  