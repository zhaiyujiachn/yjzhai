// 性能优化工具
class PerformanceOptimizer {
    constructor() {
        this.cache = new Map();
        this.debounceTimers = new Map();
    }
    
    // 缓存机制
    memoize(key, fn, ttl = 60000) { // 默认缓存1分钟
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < ttl) {
            logger.log(`使用缓存数据: ${key}`);
            return cached.data;
        }
        
        const result = fn();
        this.cache.set(key, {
            data: result,
            timestamp: Date.now()
        });
        
        return result;
    }
    
    // 防抖函数
    debounce(key, fn, delay = 300) {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(() => {
            fn();
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timer);
    }
    
    // 节流函数
    throttle(key, fn, interval = 1000) {
        const lastCall = this.cache.get(`throttle_${key}`);
        const now = Date.now();
        
        if (!lastCall || now - lastCall >= interval) {
            this.cache.set(`throttle_${key}`, now);
            return fn();
        }
        
        return null;
    }
    
    // 清理缓存
    clearCache() {
        this.cache.clear();
        logger.log('缓存已清理');
    }
    
    // 获取缓存统计
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// 性能监控
class PerformanceMonitor {
    static measureTime(label, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        logger.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    static async measureAsyncTime(label, asyncFn) {
        const start = performance.now();
        const result = await asyncFn();
        const end = performance.now();
        
        logger.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    static getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }
}

// 创建全局实例
const optimizer = new PerformanceOptimizer();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceOptimizer, PerformanceMonitor, optimizer };
} else if (typeof window !== 'undefined') {
    window.PerformanceOptimizer = PerformanceOptimizer;
    window.PerformanceMonitor = PerformanceMonitor;
    window.optimizer = optimizer;
}