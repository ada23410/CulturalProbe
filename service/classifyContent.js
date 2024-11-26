const TaskModel = require('../models/taskModel');
const { replyToUser } = require('../service/replyContent');

const classifyContent = async (userId, taskName, replyToken) => {
    try {
      // 查找未分類的內容
      const tempContents = await TempStorageModel.find({ userId });
  
      if (tempContents.length === 0) {
        await replyToUser(replyToken, {
          type: "text",
          text: "未發現任何內容需要分類。",
        });
        return;
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
        await TempStorageModel.deleteOne({ _id: temp._id }); // 刪除暫存數據
      }
  
      await replyToUser(replyToken, {
        type: "text",
        text: `已成功將內容分類至任務: ${taskName}`,
      });
    } catch (error) {
      console.error("分類內容失敗:", error.message);
      await replyToUser(replyToken, {
        type: "text",
        text: "分類內容時發生錯誤，請稍後再試！",
      });
    }
  };

module.exports = { classifyContent };