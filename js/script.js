document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动功能
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 减去导航栏的高度
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 研究成果筛选功能
    const filterButtons = document.querySelectorAll('.publication-filters .filter');
    const publicationItems = document.querySelectorAll('.publication-item');
    
    // 确保过滤功能正常工作
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 为当前按钮添加active类
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            console.log('选择的过滤器:', filter); // 调试信息
            
            // 显示或隐藏论文项
            publicationItems.forEach(item => {
                const category = item.getAttribute('data-category');
                console.log('项目类别:', category, '是否匹配:', (filter === 'all' || category === filter)); // 详细调试信息
                
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    // 添加淡入效果
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transition = 'opacity 0.3s ease-in-out';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // 初始化显示所有研究成果
    const allFilterButton = document.querySelector('.filter[data-filter="all"]');
    if (allFilterButton) {
        // 确保DOM完全加载后再触发点击
        setTimeout(() => {
            allFilterButton.click();
        }, 100);
    }
    
    // 导航栏滚动效果
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动时隐藏导航栏，向上滚动时显示导航栏
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 添加导航栏过渡效果
    nav.style.transition = 'transform 0.3s ease-in-out';
    
    // 当前部分高亮显示
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // 添加导航链接的active样式
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            nav ul li a.active {
                color: #fff;
                font-weight: bold;
            }
            nav ul li a.active:after {
                width: 100%;
            }
        </style>
    `);
    
    // 响应式导航菜单
    const createMobileMenu = () => {
        // 检查是否已经创建了移动菜单
        if (document.querySelector('.mobile-menu-toggle')) return;
        
        const nav = document.querySelector('nav');
        const navContainer = nav.querySelector('.container');
        const navUl = nav.querySelector('ul');
        
        // 创建菜单切换按钮
        const menuToggle = document.createElement('div');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        navContainer.insertBefore(menuToggle, navUl);
        
        // 添加移动菜单样式
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @media (max-width: 768px) {
                    nav .container {
                        position: relative;
                    }
                    
                    nav ul {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background-color: #0066cc;
                        padding: 20px;
                        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                    }
                    
                    nav ul.show {
                        display: flex;
                    }
                    
                    .mobile-menu-toggle {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: 30px;
                        height: 20px;
                        cursor: pointer;
                    }
                    
                    .mobile-menu-toggle span {
                        height: 3px;
                        width: 100%;
                        background-color: #fff;
                        border-radius: 3px;
                        transition: all 0.3s;
                    }
                    
                    .mobile-menu-toggle.active span:nth-child(1) {
                        transform: translateY(8.5px) rotate(45deg);
                    }
                    
                    .mobile-menu-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .mobile-menu-toggle.active span:nth-child(3) {
                        transform: translateY(-8.5px) rotate(-45deg);
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-menu-toggle {
                        display: none;
                    }
                    
                    nav ul {
                        display: flex !important;
                    }
                }
            </style>
        `);
        
        // 添加菜单切换事件
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navUl.classList.toggle('show');
        });
        
        // 点击菜单项后关闭菜单
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navUl.classList.remove('show');
            });
        });
    };
    
    // 检查窗口大小并创建移动菜单
    const checkWindowSize = () => {
        if (window.innerWidth <= 768) {
            createMobileMenu();
        }
    };
    
    // 初始检查
    checkWindowSize();
    
    // 窗口大小改变时检查
    window.addEventListener('resize', checkWindowSize);
    
    // 访问量统计功能
    initVisitStats();
});

// 访问量统计功能 - 基于不蒜子数据
function initVisitStats() {
    // 获取今天的日期字符串
    function getTodayString() {
        return new Date().toISOString().split('T')[0];
    }
    
    // 获取昨天的日期字符串
    function getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
    
    // 从localStorage获取不蒜子历史数据
    function getBusuanziHistory() {
        const data = localStorage.getItem('busuanziHistory');
        return data ? JSON.parse(data) : {};
    }
    
    // 保存不蒜子历史数据
    function saveBusuanziHistory(data) {
        localStorage.setItem('busuanziHistory', JSON.stringify(data));
    }
    
    // 获取不蒜子当前访问量
    function getCurrentBusuanziCount() {
        const element = document.getElementById('busuanzi_value_site_pv');
        if (element && element.textContent) {
            const count = parseInt(element.textContent.replace(/,/g, ''));
            return isNaN(count) ? 0 : count;
        }
        return 0;
    }
    
    // 记录不蒜子数据
    function recordBusuanziData() {
        const today = getTodayString();
        const currentCount = getCurrentBusuanziCount();
        
        if (currentCount > 0) {
            const history = getBusuanziHistory();
            const lastRecordDate = localStorage.getItem('lastBusuanziRecord');
            
            // 如果是新的一天或者第一次记录
            if (lastRecordDate !== today) {
                // 计算今日新增访问量
                let todayVisits = 0;
                const yesterday = getYesterdayString();
                
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
                    timestamp: Date.now()
                };
                
                saveBusuanziHistory(history);
                localStorage.setItem('lastBusuanziRecord', today);
                
                console.log(`记录访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${todayVisits}`);
            } else {
                // 同一天，更新总量但保持日增量不变
                if (history[today]) {
                    history[today].total = currentCount;
                    history[today].timestamp = Date.now();
                    saveBusuanziHistory(history);
                }
            }
        }
    }
    
    // 获取近30天的趋势数据
    function getLast30DaysData() {
        const history = getBusuanziHistory();
        const dates = [];
        const visits = [];
        const totalCounts = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
            
            if (history[dateString]) {
                visits.push(history[dateString].daily || 0);
                totalCounts.push(history[dateString].total || 0);
            } else {
                // 没有数据的日期，使用0或估算值
                visits.push(0);
                totalCounts.push(0);
            }
        }
        
        return { dates, visits, totalCounts };
    }
    
    // 更新统计显示
    function updateStatsDisplay() {
        const today = getTodayString();
        const yesterday = getYesterdayString();
        const history = getBusuanziHistory();
        const currentTotal = getCurrentBusuanziCount();
        
        // 显示今日访问量
        const todayData = history[today];
        document.getElementById('today-visits').textContent = todayData ? todayData.daily : 0;
        
        // 显示昨日访问量
        const yesterdayData = history[yesterday];
        document.getElementById('yesterday-visits').textContent = yesterdayData ? yesterdayData.daily : 0;
        
        // 显示总访问量（优先使用不蒜子实时数据）
        document.getElementById('total-visits').textContent = currentTotal || (todayData ? todayData.total : 0);
    }
    
    // 创建趋势图
    function createVisitChart() {
        const chartElement = document.getElementById('visitChart');
        if (!chartElement) return;
        
        const { dates, visits } = getLast30DaysData();
        
        // 如果已经存在图表，先销毁
        if (window.visitChartInstance) {
            window.visitChartInstance.destroy();
        }
        
        const ctx = chartElement.getContext('2d');
        window.visitChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '每日新增访问量',
                    data: visits,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `新增访问: ${context.parsed.y} 次`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#666',
                            maxTicksLimit: 10
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    // 等待不蒜子加载并记录数据
    function waitForBusuanziAndRecord() {
        const checkBusuanzi = () => {
            const currentCount = getCurrentBusuanziCount();
            if (currentCount > 0) {
                recordBusuanziData();
                updateStatsDisplay();
                
                // 延迟创建图表，确保数据已记录
                setTimeout(() => {
                    createVisitChart();
                }, 200);
                
                return true;
            }
            return false;
        };
        
        // 立即检查一次
        if (!checkBusuanzi()) {
            // 如果不蒜子还没加载，设置观察器
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        if (checkBusuanzi()) {
                            observer.disconnect();
                        }
                    }
                });
            });
            
            const busuanziContainer = document.getElementById('busuanzi_container_site_pv');
            if (busuanziContainer) {
                observer.observe(busuanziContainer, { childList: true, subtree: true });
            }
            
            // 设置超时检查，防止不蒜子加载失败
            setTimeout(() => {
                if (!checkBusuanzi()) {
                    // 不蒜子加载失败，使用本地数据
                    updateStatsDisplay();
                    createVisitChart();
                }
                observer.disconnect();
            }, 5000);
        }
    }
    
    // 每天自动更新功能
    function setupDailyUpdate() {
        function checkForDailyUpdate() {
            const today = getTodayString();
            const lastUpdateDate = localStorage.getItem('lastStatsUpdate');
            
            if (lastUpdateDate !== today) {
                recordBusuanziData();
                updateStatsDisplay();
                createVisitChart();
                localStorage.setItem('lastStatsUpdate', today);
            }
        }
        
        // 立即检查
        checkForDailyUpdate();
        
        // 每小时检查一次
        setInterval(checkForDailyUpdate, 60 * 60 * 1000);
    }
    
    // 清理过期数据（保留60天）
    function cleanupOldData() {
        const history = getBusuanziHistory();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 60);
        const cutoffString = cutoffDate.toISOString().split('T')[0];
        
        let hasChanges = false;
        Object.keys(history).forEach(date => {
            if (date < cutoffString) {
                delete history[date];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            saveBusuanziHistory(history);
        }
    }
    
    // 初始化
    function init() {
        // 清理过期数据
        cleanupOldData();
        
        // 等待不蒜子加载并记录数据
        waitForBusuanziAndRecord();
        
        // 设置自动更新
        setupDailyUpdate();
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}