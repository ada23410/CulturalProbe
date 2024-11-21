const TextModel = require('../models/textModel');

// 保存文字消息到 MongoDB
const saveText = async (userId, text) => {
  try {
    console.log('正在保存文字消息:', { userId, text });
    const newText = new TextModel({ userId, text });
    await newText.save();
    console.log('文字消息保存成功');
  } catch (error) {
    console.error('保存文字消息失敗:', error.message);
    throw new Error(`文字消息保存失敗: ${error.message}`);
  }
};

module.exports = {
  saveText
};