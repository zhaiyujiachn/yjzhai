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
});