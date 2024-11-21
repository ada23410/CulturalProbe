const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    }, // 'image', 'audio', etc.
    url: { 
        type: String 
    }, // Imgur URL 或本地路徑
    localPath: { 
        type: String 
    }, // 僅適用於本地端檔案
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
  });
  
module.exports = mongoose.model('Media', MediaSchema);
  