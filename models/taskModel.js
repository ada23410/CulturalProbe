const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    taskName: { type: String, required: true }, // 任務名稱
    content: { type: String, required: true },
    contentType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;