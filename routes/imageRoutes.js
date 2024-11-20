const express = require("express");
const { handleImageUpload } = require("../controllers/upload");

const router = express.Router();

// 圖片上傳 API
router.post("/upload", handleImageUpload);

module.exports = router;