// 网站访问统计系统配置文件
const STATS_CONFIG = {
    // 数据更新间隔（毫秒）
    UPDATE_INTERVAL: 30000,
    
    // 不蒜子加载超时时间（毫秒）
    BUSUANZI_TIMEOUT: 5000,
    
    // 本地存储键名
    STORAGE_KEY: 'busuanzi_history',
    
    // API 配置（未来服务器端实现）
    API: {
        BASE_URL: '/api/stats',
        ENDPOINTS: {
            DAILY: '/daily',
            HISTORY: '/history',
            SUMMARY: '/summary'
        }
    },
    
    // 图表配置
    CHART: {
        COLORS: {
            PRIMARY: '#60a5fa',
            BACKGROUND: 'rgba(96, 165, 250, 0.1)',
            TEXT: '#e5e7eb',
            GRID: 'rgba(255, 255, 255, 0.1)'
        },
        RESPONSIVE: {
            LARGE_DATASET_THRESHOLD: 60,
            MAX_X_LABELS: 15,
            POINT_RADIUS: {
                NORMAL: 4,
                SMALL: 2
            }
        }
    },
    
    // 调试模式
    DEBUG: false,
    
    // 功能开关
    FEATURES: {
        AUTO_UPDATE: true,
        CHART_ANIMATION: true,
        ERROR_REPORTING: true
    }
};

// 导出配置（兼容不同模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STATS_CONFIG;
} else if (typeof window !== 'undefined') {
    window.STATS_CONFIG = STATS_CONFIG;
}