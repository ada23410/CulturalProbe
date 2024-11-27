const TempStorageModel = require('../models/tempStorageMpdel');
const TaskModel = require('../models/taskModel');
const replyToUser = require('../service/replyContent');

const classifyContent = async (userId, taskName, replyToken, currentMessage = null, currentMessageType = null) => {
  try {
    // 如果有當前消息，直接分類到指定任務
    if (currentMessage && currentMessageType) {
      await TaskModel.create({
        userId,
        taskName,
        content: currentMessage,
        contentType: currentMessageType,
        timestamp: new Date(),
      });

      await replyToUser(replyToken, {
        type: "text",
        text: `已成功將當前內容分類至任務: ${taskName}`,
      });

      return; // 結束處理
    }

    // 查找暫存的未分類內容
    const tempContents = await TempStorageModel.find({ userId });

    if (tempContents.length === 0) {
      // 沒有未分類內容
      await replyToUser(replyToken, {
        type: "text",
        text: "未發現任何內容需要分類。",
      });
      return; // 結束處理
    }

    // 將未分類的內容歸屬於指定任務
    for (const temp of tempContents) {
      await TaskModel.create({
        userId,
        taskName,
        content: temp.content,
        contentType: temp.contentType,
        timestamp: temp.timestamp,
      });

      // 刪除已分類的暫存數據
      await TempStorageModel.deleteOne({ _id: temp._id });
    }

    await replyToUser(replyToken, {
      type: "text",
      text: `已成功將暫存內容分類至任務: ${taskName}`,
    });
  } catch (error) {
    console.error("處理和分類內容失敗:", error.message);
    await replyToUser(replyToken, {
      type: "text",
      text: "分類內容時發生錯誤，請稍後再試！",
    });
  }
};

module.exports = { classifyContent };