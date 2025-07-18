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
<<<<<<< HEAD
    
    // 访问量统计功能
    initVisitStats();
});

// 访问量统计功能
function initVisitStats() {
    // 记录不蒜子数据
    function recordBusuanziData() {
        const today = DateUtils.getTodayString();
        const currentCount = DataUtils.getCurrentBusuanziCount();
        
        if (currentCount > 0) {
            const history = DataUtils.getBusuanziHistory();
            const lastRecordDate = localStorage.getItem('lastBusuanziRecord');
            
            // 如果是新的一天或者第一次记录
            if (lastRecordDate !== today) {
                // 计算今日新增访问量
                let todayVisits = 0;
                const yesterday = DateUtils.getYesterdayString();
                
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
                
                DataUtils.saveBusuanziHistory(history);
                localStorage.setItem('lastBusuanziRecord', today);
                
                console.log(`记录访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${todayVisits}`);
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
                    
                    DataUtils.saveBusuanziHistory(history);
                    console.log(`更新访问数据 - 日期: ${today}, 总量: ${currentCount}, 今日: ${newDailyVisits}`);
                }
            }
        }
    }
    
    // 获取近30天的趋势数据
    function getLast30DaysData() {
        const history = DataUtils.getBusuanziHistory();
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
        const today = DateUtils.getTodayString();
        const yesterday = DateUtils.getYesterdayString();
        const history = DataUtils.getBusuanziHistory();
        const currentTotal = DataUtils.getCurrentBusuanziCount();
        
        // 显示今日访问量
        const todayData = history[today];
        const todayVisits = todayData ? todayData.daily : 0;
        
        // 显示昨日访问量
        const yesterdayData = history[yesterday];
        const yesterdayVisits = yesterdayData ? yesterdayData.daily : 0;
        
        // 更新页面显示
        const todayElement = document.getElementById('today-visits');
        const yesterdayElement = document.getElementById('yesterday-visits');
        const totalElement = document.getElementById('total-visits');
        
        if (todayElement) todayElement.textContent = todayVisits.toLocaleString();
        if (yesterdayElement) yesterdayElement.textContent = yesterdayVisits.toLocaleString();
        if (totalElement) totalElement.textContent = currentTotal.toLocaleString();
    }
    
    // 创建访问趋势图表
    function createVisitChart() {
        const chartElement = document.getElementById('visitChart');
        if (!chartElement) return;
        
        try {
            const data = getLast30DaysData();
            if (!data || data.dates.length === 0) {
                ChartUtils.showNoDataMessage('visitChart');
                return;
            }
            
            ChartUtils.createVisitChart(
                'visitChart',
                data.dates,
                data.visits,
                null,
                {
                    instanceName: 'visitChartInstance',
                    showTitle: false,
                    showLegend: false,
                    borderWidth: 3,
                    pointRadius: 5
                }
            );
        } catch (error) {
            logger.error('创建访问图表失败', error);
            ChartUtils.showNoDataMessage('visitChart', '图表加载失败，请刷新页面重试');
        }
    }
    
    // 等待不蒜子加载并记录数据
    function waitForBusuanziAndRecord() {
        const checkBusuanzi = () => {
            const currentCount = DataUtils.getCurrentBusuanziCount();
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
        
        // 设置实时更新机制，每30秒检查一次不蒜子数据变化
        setInterval(() => {
            const currentCount = DataUtils.getCurrentBusuanziCount();
            if (currentCount > 0) {
                const history = DataUtils.getBusuanziHistory();
                const today = DataUtils.getTodayString();
                const todayData = history[today];
                
                // 如果总访问量有变化，更新数据
                if (todayData && currentCount !== todayData.total) {
                    DataUtils.recordBusuanziData();
                    updateStatsDisplay();
                    logger.log(`实时更新 - 总量从 ${todayData.total} 更新到 ${currentCount}`);
                }
            }
        }, 30000); // 每30秒检查一次
    }
    
    // 每天自动更新功能
    function setupDailyUpdate() {
        function checkForDailyUpdate() {
            const today = DateUtils.getTodayString();
            const lastUpdateDate = localStorage.getItem('lastStatsUpdate');
            
            if (lastUpdateDate !== today) {
                // 新的一天，触发数据更新
                DataUtils.updateServerData().then(() => {
                    localStorage.setItem('lastStatsUpdate', today);
                    console.log('每日数据更新完成');
                });
            }
        }
        
        // 立即检查
        checkForDailyUpdate();
        
        // 每小时检查一次
        setInterval(checkForDailyUpdate, 60 * 60 * 1000);
    }
    
    // 清理过期数据（保留60天）
    function cleanupOldData() {
        const history = DataUtils.getBusuanziHistory();
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
            DataUtils.saveBusuanziHistory(history);
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
=======
});
>>>>>>> parent of 7132b9b (updated visted)
