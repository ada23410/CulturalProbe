const path = require('path');
const fs = require('fs');
const multer = require('./images'); // Multer 配置模块
const { uploadToFirebase } = require('./firebase');

// 处理上传的多媒体文件
const processUploadedFile = async (filePath, options = { uploadToFirebase: false }) => {
  try {
    console.log('Processing uploaded file:', filePath);

    const contentType = path.extname(filePath).toLowerCase();
    const fileName = `uploads/${Date.now()}-${path.basename(filePath)}`;

    if (options.uploadToFirebase) {
      // 上传文件到 Firebase
      const publicUrl = await uploadToFirebase(filePath, fileName, contentType);
      console.log('文件已上传到 Firebase:', publicUrl);

      // 删除本地文件
      fs.unlinkSync(filePath);
      return publicUrl;
    }

    return filePath; // 如果不需要上传到 Firebase，返回本地路径
  } catch (error) {
    console.error('文件处理失败:', error.message);
    throw new Error(`文件处理失败: ${error.message}`);
  }
};

// 使用 Multer 上传文件的逻辑
const handleFileUpload = (req, res, next) => {
  multer(req, res, async (err) => {
    if (err) {
      console.error('文件上传失败:', err.message);
      return res.status(400).send({ error: err.message });
    }

    // 如果上传成功，处理文件
    try {
      const uploadedFiles = req.files.map((file) => path.resolve(file.path));
      console.log('Uploaded files:', uploadedFiles);

      // 可进一步调用 `processUploadedFile` 处理文件
      req.processedFiles = await Promise.all(
        uploadedFiles.map((filePath) =>
          processUploadedFile(filePath, { uploadToFirebase: true })
        )
      );

      next();
    } catch (error) {
      console.error('文件处理过程中出错:', error.message);
      res.status(500).send({ error: '文件处理失败' });
    }
  });
};

module.exports = {
  handleFileUpload,
  processUploadedFile,
};
