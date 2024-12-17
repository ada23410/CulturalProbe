const shouldRetry = (error) => {
    if (!error.response) return true; // 無法獲取回應，可能是網絡問題，允許重試
    const status = error.response.status;
    return status >= 500 || status === 429; // 僅對 5xx 或 429 (Too Many Requests) 重試
};

const retryRequest = async (operation, retries = 3, baseDelay = 1000, maxDelay = 10000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (!shouldRetry(error)) throw error; // 不符合重試條件，直接拋出錯誤

            const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
            console.warn(`重試次數 ${attempt}: ${error.message}`);
            if (attempt < retries) {
                console.log(`等待 ${delay} 毫秒後重試...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(`操作失敗，已達最大重試次數: ${error.message}`);
            }
        }
    }
};

module.exports = retryRequest