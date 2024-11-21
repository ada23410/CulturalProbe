const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema(
    {
        userId: String,
        text: String,
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    }
)

const TextModel = mongoose.model('Text', TextSchema);

module.exports = TextModel;