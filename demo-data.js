// 演示数据生成器 - 基于不蒜子数据格式
// 在浏览器控制台中运行此脚本来生成测试数据

function generateDemoData() {
    const busuanziHistory = {};
    const today = new Date();
    let totalCount = 1000; // 起始总访问量
    
    console.log('开始生成基于不蒜子格式的演示数据...');
    
    // 生成过去30天的数据
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // 生成每日新增访问量（5-50之间的随机数）
        const dailyVisits = Math.floor(Math.random() * 46) + 5;
        totalCount += dailyVisits;
        
        // 按照新的数据格式存储
        busuanziHistory[dateString] = {
            total: totalCount,
            daily: dailyVisits,
            timestamp: date.getTime()
        };
        
        console.log(`${dateString}: 新增 ${dailyVisits}, 总计 ${totalCount}`);
    }
    
    // 保存到localStorage
    localStorage.setItem('busuanziHistory', JSON.stringify(busuanziHistory));
    localStorage.setItem('lastBusuanziRecord', today.toISOString().split('T')[0]);
    localStorage.setItem('lastStatsUpdate', today.toISOString().split('T')[0]);
    
    // 模拟不蒜子当前值
    const busuanziElement = document.getElementById('busuanzi_value_site_pv');
    if (busuanziElement) {
        busuanziElement.textContent = totalCount.toString();
    }
    
    console.log('演示数据生成完成！');
    console.log(`总访问量: ${totalCount}`);
    console.log('数据已保存到localStorage，页面将在1秒后刷新...');
    
    // 自动刷新页面
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// 生成更真实的数据（模拟网站成长趋势）
function generateRealisticData() {
    const busuanziHistory = {};
    const today = new Date();
    let totalCount = 500; // 较小的起始值
    
    console.log('生成更真实的访问量数据...');
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // 模拟真实的访问量模式
        let dailyVisits;
        const dayOfWeek = date.getDay();
        
        // 周末访问量较低
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dailyVisits = Math.floor(Math.random() * 15) + 3; // 3-17
        } else {
            dailyVisits = Math.floor(Math.random() * 25) + 8; // 8-32
        }
        
        // 添加一些随机的高峰日
        if (Math.random() < 0.1) {
            dailyVisits += Math.floor(Math.random() * 30) + 20; // 偶尔的高访问量
        }
        
        // 模拟网站成长趋势（越近期访问量越高）
        const growthFactor = 1 + (29 - i) * 0.02;
        dailyVisits = Math.floor(dailyVisits * growthFactor);
        
        totalCount += dailyVisits;
        
        busuanziHistory[dateString] = {
            total: totalCount,
            daily: dailyVisits,
            timestamp: date.getTime()
        };
        
        console.log(`${dateString} (${['日','一','二','三','四','五','六'][dayOfWeek]}): +${dailyVisits} → ${totalCount}`);
    }
    
    // 保存数据
    localStorage.setItem('busuanziHistory', JSON.stringify(busuanziHistory));
    localStorage.setItem('lastBusuanziRecord', today.toISOString().split('T')[0]);
    localStorage.setItem('lastStatsUpdate', today.toISOString().split('T')[0]);
    
    // 更新不蒜子显示
    const busuanziElement = document.getElementById('busuanzi_value_site_pv');
    if (busuanziElement) {
        busuanziElement.textContent = totalCount.toLocaleString();
    }
    
    console.log(`真实数据生成完成！总访问量: ${totalCount.toLocaleString()}`);
    console.log('页面将在1秒后刷新...');
    
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// 清除数据的函数
function clearDemoData() {
    localStorage.removeItem('busuanziHistory');
    localStorage.removeItem('lastBusuanziRecord');
    localStorage.removeItem('lastStatsUpdate');
    
    console.log('演示数据已清除！页面将在1秒后刷新...');
    
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// 查看当前数据
function viewCurrentData() {
    const history = localStorage.getItem('busuanziHistory');
    if (history) {
        const data = JSON.parse(history);
        console.log('当前存储的访问量数据:');
        console.table(data);
        
        const totalDays = Object.keys(data).length;
        const totalDaily = Object.values(data).reduce((sum, item) => sum + (item.daily || 0), 0);
        const avgDaily = totalDaily / totalDays;
        
        console.log(`统计信息:`);
        console.log(`- 记录天数: ${totalDays}`);
        console.log(`- 平均每日访问: ${avgDaily.toFixed(1)}`);
        console.log(`- 最新总访问量: ${Math.max(...Object.values(data).map(item => item.total || 0)).toLocaleString()}`);
    } else {
        console.log('没有找到访问量数据');
    }
}

console.log('=== 不蒜子数据演示工具已加载 ===');
console.log('可用命令:');
console.log('• generateDemoData() - 生成随机演示数据');
console.log('• generateRealisticData() - 生成真实模拟数据');
console.log('• clearDemoData() - 清除所有数据');
console.log('• viewCurrentData() - 查看当前数据');
console.log('=====================================');