// 统一的日志和错误处理系统
class StatsLogger {
    constructor(config = {}) {
        this.debug = config.debug || false;
        this.prefix = config.prefix || '[Stats]';
        this.errorReporting = config.errorReporting || false;
    }
    
    log(message, data = null) {
        if (this.debug) {
            console.log(`${this.prefix} ${message}`, data || '');
        }
    }
    
    warn(message, data = null) {
        console.warn(`${this.prefix} ${message}`, data || '');
    }
    
    error(message, error = null) {
        console.error(`${this.prefix} ${message}`, error || '');
        
        if (this.errorReporting && error) {
            this.reportError(message, error);
        }
    }
    
    reportError(message, error) {
        // 未来可以集成错误报告服务
        const errorData = {
            message,
            error: error.toString(),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // 发送到错误报告服务
        // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
        
        // 临时保存到本地
        const errors = JSON.parse(localStorage.getItem('stats_errors') || '[]');
        errors.push(errorData);
        localStorage.setItem('stats_errors', JSON.stringify(errors.slice(-10))); // 只保留最近10个错误
    }
}

// 创建全局日志实例
const logger = new StatsLogger({
    debug: STATS_CONFIG?.DEBUG || false,
    errorReporting: STATS_CONFIG?.FEATURES?.ERROR_REPORTING || false
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsLogger, logger };
} else if (typeof window !== 'undefined') {
    window.StatsLogger = StatsLogger;
    window.logger = logger;
}