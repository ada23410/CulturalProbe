const retryRequest = async (callback, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await callback(); // 嘗試執行回調函數
        } catch (error) {
            console.warn(`重試第 ${i + 1} 次失敗: ${error.message}`);
            if (i < retries - 1) await new Promise(res => setTimeout(res, delay)); // 等待後重試
        }
    }
    throw new Error("所有重試均失敗"); // 重試次數用盡，拋出錯誤
};

module.exports = retryRequest