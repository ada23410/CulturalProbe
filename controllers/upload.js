const upload = require('../service/images'); // multer處理
const { uploadImage } = require('../service/imageStorage'); //Firebase

const handleImageUpload = async (req , res) => {
    try {
        upload(req, res, async(err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
    
            if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "沒有檔案上傳。" });
            }
    
            // 處理每個圖片並上傳到 Firebase
            const uploadResults = [];
            for (const file of req.files) {
                const publicUrl = await uploadImage(file);
                uploadResults.push(publicUrl);
            }
    
            res.status(200).json({
                message: "圖片上傳成功。",
                urls: uploadResults
            });
        })
    }catch(err){
        console.error("圖片上傳錯誤:", err.message);
        res.status(500).json({ error: "伺服器發生錯誤。" });
    }
}

module.exports = { handleImageUpload };