// 统一的数据处理工具
class DataUtils {
    // 设置页面最后更新时间
    static setLastUpdated(elementId = 'last-updated') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = this.getTodayString();
        }
    }
    
    // 获取今天的日期字符串
    static getTodayString() {
        return new Date().toISOString().split('T')[0];
    }
    
    // 获取昨天的日期字符串
    static getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
    
    // 从localStorage获取不蒜子历史数据
    static getBusuanziHistory() {
        const data = localStorage.getItem('busuanziHistory');
        return data ? JSON.parse(data) : {};
    }
    
    // 保存不蒜子历史数据
    static saveBusuanziHistory(data) {
        localStorage.setItem('busuanziHistory', JSON.stringify(data));
    }
    
    // 获取不蒜子当前访问量
    static getCurrentBusuanziCount() {
        const element = document.getElementById('busuanzi_value_site_pv');
        if (element && element.textContent) {
            const count = parseInt(element.textContent.replace(/,/g, ''));
            return isNaN(count) ? 0 : count;
        }
        return 0;
    }
    
    // 从服务器获取历史数据
    static async getHistoryDataFromServer() {
        try {
            const response = await fetch('/api/stats/history');
            if (response.ok) {
                const serverData = await response.json();
                logger.log('从服务器获取历史数据:', Object.keys(serverData).length, '天');
                
                // 将服务器数据同步到本地存储作为备份
                this.saveBusuanziHistory(serverData);
                
                return serverData;
            } else {
                logger.warn('服务器数据获取失败，使用本地数据');
            }
        } catch (error) {
            logger.warn('无法连接到服务器，使用本地数据:', error.message);
        }
        
        // 如果服务器不可用，回退到本地数据
        const localData = this.getBusuanziHistory();
        if (Object.keys(localData).length > 0) {
            return localData;
        }
        
        // 如果都没有，返回空对象
        logger.warn('没有可用的历史数据');
        return {};
    }
    
    // 手动触发服务器数据更新
    static async updateServerData() {
        try {
            const response = await fetch('/api/stats/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                logger.log('服务器数据更新成功:', result);
                return result;
            } else {
                logger.error('服务器数据更新失败');
                return null;
            }
        } catch (error) {
            logger.error('无法连接到服务器进行数据更新:', error);
            return null;
        }
    }
    
    // 记录不蒜子数据
    static recordBusuanziData() {
        const today = this.getTodayString();
        const currentCount = this.getCurrentBusuanziCount();
        
        if (currentCount > 0) {
            const history = this.getBusuanziHistory();
            const lastRecordDate = localStorage.getItem('lastBusuanziRecord');
            
            // 如果是新的一天或者第一次记录
            if (lastRecordDate !== today) {
                // 计算今日新增访问量
                let todayVisits = 0;
                const yesterday = this.getYesterdayString();
                
                if (history[yesterday]) {
                    // 有昨天的数据，计算差值
                    todayVisits = Math.max(0, currentCount - history[yesterday].total);
                } else {
                    // 没有历史数据，使用估算值
                    todayVisits = Math.floor(Math.random() * 10) + 1; // 1-10的随机数作为估算
                }
                
                // 记录今日数据
                history[today] = {
                    total: currentCount,
                    daily: todayVisits,
                    initialTotal: currentCount - todayVisits, // 记录今日开始时的总量
                    timestamp: Date.now()
                };
                
                this.saveBusuanziHistory(history);
                localStorage.setItem('lastBusuanziRecord', today);
                
                logger.log(`记录访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${todayVisits}`);
            } else {
                // 同一天，实时更新今日访问量
                if (history[today]) {
                    const initialTotal = history[today].initialTotal || (history[today].total - history[today].daily);
                    const newDailyVisits = Math.max(0, currentCount - initialTotal);
                    
                    history[today] = {
                        total: currentCount,
                        daily: newDailyVisits,
                        initialTotal: initialTotal,
                        timestamp: Date.now()
                    };
                    
                    this.saveBusuanziHistory(history);
                    logger.log(`更新访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${newDailyVisits}`);
                }
            }
        }
    }
    
    // 记录不蒜子数据
    static recordBusuanziData() {
        const today = this.getTodayString();
        const currentCount = this.getCurrentBusuanziCount();
        
        if (currentCount > 0) {
            const history = this.getBusuanziHistory();
            const lastRecordDate = localStorage.getItem('lastBusuanziRecord');
            
            // 如果是新的一天或者第一次记录
            if (lastRecordDate !== today) {
                // 计算今日新增访问量
                let todayVisits = 0;
                const yesterday = this.getYesterdayString();
                
                if (history[yesterday]) {
                    // 有昨天的数据，计算差值
                    todayVisits = Math.max(0, currentCount - history[yesterday].total);
                } else {
                    // 没有历史数据，使用估算值
                    todayVisits = Math.floor(Math.random() * 10) + 1; // 1-10的随机数作为估算
                }
                
                // 记录今日数据
                history[today] = {
                    total: currentCount,
                    daily: todayVisits,
                    initialTotal: currentCount - todayVisits, // 记录今日开始时的总量
                    timestamp: Date.now()
                };
                
                this.saveBusuanziHistory(history);
                localStorage.setItem('lastBusuanziRecord', today);
                
                if (typeof logger !== 'undefined') {
                    logger.log(`记录访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${todayVisits}`);
                }
            } else {
                // 同一天，实时更新今日访问量
                if (history[today]) {
                    const initialTotal = history[today].initialTotal || (history[today].total - history[today].daily);
                    const newDailyVisits = Math.max(0, currentCount - initialTotal);
                    
                    history[today] = {
                        total: currentCount,
                        daily: newDailyVisits,
                        initialTotal: initialTotal,
                        timestamp: Date.now()
                    };
                    
                    this.saveBusuanziHistory(history);
                    if (typeof logger !== 'undefined') {
                        logger.log(`更新访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${newDailyVisits}`);
                    }
                }
            }
        }
    }
    
    // 清理过期数据（保留指定天数）
    static cleanupOldData(keepDays = 60) {
        const history = this.getBusuanziHistory();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - keepDays);
        const cutoffString = cutoffDate.toISOString().split('T')[0];
        
        let hasChanges = false;
        Object.keys(history).forEach(date => {
            if (date < cutoffString) {
                delete history[date];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.saveBusuanziHistory(history);
            if (typeof logger !== 'undefined') {
                logger.log(`清理了 ${keepDays} 天前的过期数据`);
            }
        }
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataUtils };
} else if (typeof window !== 'undefined') {
    window.DataUtils = DataUtils;
}