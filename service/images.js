const multer = require('multer');
const path = require('path');

const upload = multer({
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.mp4', '.mp3', '.mov', '.m4a'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedTypes.includes(ext)) {
            return cb(new Error('檔案格式錯誤，僅限上傳圖片與影音檔案（jpg, jpeg, png, mp4, mp3, mov, m4a）'));
        }
        cb(null, true);
    },
}).any();

module.exports = upload;