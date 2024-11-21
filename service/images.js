const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToFirebase } = require('./firebase');

// 配置 Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // 确保上传目录存在
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB 文件限制
  },
  fileFilter(req, file, cb) {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.mp4', '.mp3', '.mov', '.m4a'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      return cb(new Error('檔案格式錯誤，僅限上傳圖片與影音檔案（jpg, jpeg, png, mp4, mp3, mov, m4a）'));
    }
    cb(null, true);
  },
});

module.exports = upload;