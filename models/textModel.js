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

const saveText = async (userId, text) => {
    const newText = new TextModel({ userId, text });
    await newText.save();
};

module.exports = { saveText };