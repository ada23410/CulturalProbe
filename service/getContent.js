const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 確保目錄存在
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`目錄已創建: ${dirPath}`);
  }
};

// 從 LINE 獲取多媒體內容
const fetchContent = async (messageId, accessToken, options = { saveToLocal: true }) => {
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // 接收二進制數據
    });

    console.log('成功接收內容:');
    console.log('Headers:', response.headers); // 打印響應頭
    console.log('Content-Type:', response.headers['content-type']); // 打印內容類型
    console.log('Content-Length:', response.headers['content-length']); // 打印內容大小

    // 如果選擇保存到本地
    if (options.saveToLocal) {
      const contentType = response.headers['content-type'];
      const extension = contentType.includes('audio') ? '.m4a' :
                        contentType.includes('image') ? '.jpg' : '';
      if (!extension) {
        throw new Error(`不支持的文件類型: ${contentType}`);
      }

      // 構建本地文件路徑
      const localDir = path.join(__dirname, '../uploads');
      ensureDirectoryExists(localDir);
      const localPath = path.join(localDir, `${messageId}${extension}`);

      // 寫入文件
      fs.writeFileSync(localPath, response.data);
      console.log(`文件已成功保存到: ${localPath}`);

      return localPath; // 返回本地文件路徑
    }

    // 如果不保存到本地，直接返回 Buffer
    return response.data;
  } catch (error) {
    console.error('獲取內容失敗:', error.response?.data || error.message);
    throw new Error(`獲取內容失敗: ${error.message}`);
  }
};

module.exports = { fetchContent };
