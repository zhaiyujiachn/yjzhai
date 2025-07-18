// 数据验证和类型检查工具
class DataValidator {
    static isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
    }
    
    static isValidVisitData(data) {
        return data && 
               typeof data === 'object' &&
               typeof data.total === 'number' &&
               typeof data.daily === 'number' &&
               data.total >= 0 &&
               data.daily >= 0;
    }
    
    static sanitizeVisitData(data) {
        if (!this.isValidVisitData(data)) {
            logger.warn('无效的访问数据，使用默认值', data);
            return { total: 0, daily: 0, timestamp: Date.now() };
        }
        
        return {
            total: Math.max(0, Math.floor(data.total)),
            daily: Math.max(0, Math.floor(data.daily)),
            timestamp: data.timestamp || Date.now(),
            initialTotal: data.initialTotal || 0
        };
    }
    
    static validateHistoryData(history) {
        if (!history || typeof history !== 'object') {
            logger.warn('历史数据格式无效');
            return {};
        }
        
        const validatedHistory = {};
        
        for (const [date, data] of Object.entries(history)) {
            if (this.isValidDate(date) && this.isValidVisitData(data)) {
                validatedHistory[date] = this.sanitizeVisitData(data);
            } else {
                logger.warn(`跳过无效的历史数据项: ${date}`, data);
            }
        }
        
        return validatedHistory;
    }
}

// 数据类型定义（JSDoc 风格）
/**
 * @typedef {Object} VisitData
 * @property {number} total - 总访问量
 * @property {number} daily - 当日访问量
 * @property {number} timestamp - 时间戳
 * @property {number} [initialTotal] - 当日开始时的总访问量
 */

/**
 * @typedef {Object.<string, VisitData>} HistoryData
 */

/**
 * @typedef {Object} ChartData
 * @property {string[]} dates - 日期数组
 * @property {number[]} visits - 访问量数组
 * @property {number[]} [totalCounts] - 总访问量数组
 */

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataValidator };
} else if (typeof window !== 'undefined') {
    window.DataValidator = DataValidator;
}