const { ImgurClient } = require('imgur');

// 配置 Imgur 客户端
const uploadToImgur = async (base64Image) => {
  try {
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN, // 可选
    });

    // 上传到 Imgur
    const response = await client.upload({
      image: base64Image,
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID, // 可选
    });

    console.log('圖片已上傳到 Imgur:', response.data);
    const link = response.data.link; // 嘗試提取圖片 URL
    console.log('圖片連結:', link);

    return link; // 返回圖片 URL
  } catch (error) {
    console.error('上傳到 Imgur 失敗:', error.message);
    throw new Error('上傳到 Imgur 失敗');
  }
};

module.exports = { uploadToImgur };

