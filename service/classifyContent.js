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
              classified: true,
          });

          // 更新暫存數據的 classified 狀態
          await TempStorageModel.updateOne({ _id: contentId }, { classified: true });

          await replyToUser(replyToken, {
              type: "text",
              text: `已成功將內容分類至任務: ${taskName}`,
          });
      } else {
          // 查找所有未分類的暫存內容
          const tempContents = await TempStorageModel.find({ userId, classified: false });

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
                  classified: true,
              });

              // 更新已分類的暫存數據狀態
              await TempStorageModel.updateOne({ _id: temp._id }, { classified: true });
          }

          await replyToUser(replyToken, {
              type: "text",
              text: `已成功將所有未分類內容分類至任務: ${taskName}`,
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