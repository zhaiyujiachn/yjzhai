const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 配置
const PORT = 8001;
const DATA_FILE = path.join(__dirname, 'visit-data.json');
const STATIC_DIR = __dirname;

// 初始化数据文件
function initDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            lastUpdate: new Date().toISOString(),
            history: {},
            settings: {
                autoUpdate: true,
                updateInterval: 3600000 // 1小时
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('📁 创建数据文件:', DATA_FILE);
    }
}

// 读取数据
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ 读取数据文件失败:', error);
        return { history: {}, lastUpdate: new Date().toISOString() };
    }
}

// 保存数据
function saveData(data) {
    try {
        data.lastUpdate = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('💾 数据已保存');
        return true;
    } catch (error) {
        console.error('❌ 保存数据失败:', error);
        return false;
    }
}

// 引入数据工具
const { DataUtils } = require('./js/data-utils.js');

// 获取今天的日期字符串（使用统一工具）
function getTodayString() {
    return DataUtils.getTodayString();
}

// 模拟获取不蒜子数据（实际应用中需要真实获取）
function getBusuanziData() {
    // 这里应该是真实的不蒜子数据获取逻辑
    // 为了演示，我们返回模拟数据
    const baseTotal = 1000;
    const randomDaily = Math.floor(Math.random() * 50) + 10;
    return {
        total: baseTotal + Math.floor(Math.random() * 500),
        daily: randomDaily
    };
}

// 更新访问数据
function updateVisitData() {
    console.log('🔄 开始更新访问数据...');
    
    const data = readData();
    const today = getTodayString();
    const busuanziData = getBusuanziData();
    
    // 如果今天还没有记录，创建新记录
    if (!data.history[today]) {
        data.history[today] = {
            total: busuanziData.total,
            daily: busuanziData.daily,
            initialTotal: busuanziData.total - busuanziData.daily,
            timestamp: Date.now()
        };
        console.log(`📊 创建新的日期记录: ${today}`);
    } else {
        // 更新现有记录
        data.history[today].total = busuanziData.total;
        data.history[today].daily = busuanziData.daily;
        data.history[today].timestamp = Date.now();
        console.log(`📊 更新日期记录: ${today}`);
    }
    
    // 保存数据
    if (saveData(data)) {
        console.log('✅ 访问数据更新完成');
    }
    
    return data.history[today];
}

// 处理静态文件
function serveStaticFile(req, res, filePath) {
    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    }[extname] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('文件未找到');
            } else {
                res.writeHead(500);
                res.end('服务器错误');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// 创建服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // API 路由
    if (pathname === '/api/stats/history') {
        // 获取历史数据
        const data = readData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.history));
        
    } else if (pathname === '/api/stats/update' && req.method === 'POST') {
        // 手动更新数据
        const updatedData = updateVisitData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: updatedData }));
        
    } else if (pathname === '/api/stats/today') {
        // 获取今天的数据
        const data = readData();
        const today = getTodayString();
        const todayData = data.history[today] || null;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todayData));
        
    } else {
        // 静态文件服务
        let filePath = path.join(STATIC_DIR, pathname === '/' ? 'index.html' : pathname);
        
        // 安全检查
        if (!filePath.startsWith(STATIC_DIR)) {
            res.writeHead(403);
            res.end('禁止访问');
            return;
        }
        
        serveStaticFile(req, res, filePath);
    }
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`🚀 服务器启动成功！`);
    console.log(`📱 访问地址: http://localhost:${PORT}`);
    console.log(`📊 统计页面: http://localhost:${PORT}/stats.html`);
    console.log(`📁 数据文件: ${DATA_FILE}`);
    
    // 初始化数据文件
    initDataFile();
    
    // 立即更新一次数据
    updateVisitData();
    
    // 设置定时更新（每小时）
    setInterval(() => {
        updateVisitData();
    }, 60 * 60 * 1000); // 1小时
    
    console.log('⏰ 已设置自动更新，每小时更新一次');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});