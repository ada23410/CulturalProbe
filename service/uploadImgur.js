const { ImgurClient } = require('imgur');

// 配置 Imgur 客户端
const uploadToImgur = async (base64Image) => {
  try {
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN, // 可选
    });

    // 上傳圖片到 Imgur
    const response = await client.upload({
      image: base64Image,
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID, // 可选
    });

    // 檢查上傳結果是否成功
    if (!response || !response.data || !response.data.link) {
      console.error('Imgur 上傳失敗: 沒有返回有效的圖片連結', response);
      throw new Error('Imgur 上傳失敗: 無效的返回數據');
    }

    console.log('圖片已上傳到 Imgur:', response.data.link);
    return response.data.link; // 返回圖片 URL

  } catch (error) {
    // 顯示更詳細的錯誤信息
    console.error('上傳到 Imgur 失敗:', error.response?.data || error.message);
    throw new Error('上傳到 Imgur 失敗');
  }
};

module.exports = { uploadToImgur };
