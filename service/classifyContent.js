const TempStorageModel = require('../models/tempStorageModel');
const TaskModel = require('../models/taskModel');
const replyToUser = require('../service/replyContent');

const classifyContent = async (userId, taskName, replyToken, contentId = null) => {
  try {
      if (!taskName) {
          throw new Error("分類任務時，缺少任務名稱");
      }

      if (contentId) {
          // 查找指定的內容
          const tempContent = await TempStorageModel.findById(contentId);
          if (!tempContent) {
              throw new Error("未找到指定的內容");
          }

          // 將內容分類到指定任務
          await TaskModel.create({
              userId,
              taskName,
              content: tempContent.content,
              contentType: tempContent.contentType,
              timestamp: tempContent.timestamp,
          });

          // 刪除暫存數據
          await TempStorageModel.deleteOne({ _id: contentId });

          await replyToUser(replyToken, {
              type: "text",
              text: `已成功將內容分類至任務: ${taskName}`,
          });
      } else {
          // 處理所有暫存內容的分類
          const tempContents = await TempStorageModel.find({ userId });

          if (tempContents.length === 0) {
              await replyToUser(replyToken, {
                  type: "text",
                  text: "未發現任何內容需要分類。",
              });
              return;
          }

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
      }
  } catch (error) {
      console.error("處理和分類內容失敗:", error.message);
      await replyToUser(replyToken, {
          type: "text",
          text: `分類內容時發生錯誤: ${error.message}`,
      });
  }
};

module.exports = { classifyContent };