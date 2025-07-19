// 访问统计相关功能
(function() {
    'use strict';
    
    // 更新最后更新时间
    function updateLastModified() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = new Date().toISOString().split('T')[0];
        }
    }
    
    // 初始化访问统计显示
    function initStatsDisplay() {
        const statsInfo = document.querySelector('.stats-info');
        if (statsInfo) {
            // 初始隐藏统计信息，显示加载提示
            statsInfo.style.opacity = '0.6';
            statsInfo.innerHTML = '正在加载访问统计...';
        }
    }
    
    // 检测不蒜子统计是否加载成功
    function checkBusuanziLoaded() {
        const sitePv = document.getElementById('busuanzi_value_site_pv');
        const siteUv = document.getElementById('busuanzi_value_site_uv');
        const pagePv = document.getElementById('busuanzi_value_page_pv');
        const statsInfo = document.querySelector('.stats-info');
        
        // 检查元素是否存在
        if (!sitePv || !siteUv || !pagePv || !statsInfo) {
            console.log('访问统计元素未找到');
            return;
        }
        
        // 检查不蒜子是否已经加载数据
        if (sitePv.textContent && sitePv.textContent !== '' && 
            siteUv.textContent && siteUv.textContent !== '' && 
            pagePv.textContent && pagePv.textContent !== '') {
            
            // 数据加载成功，显示统计信息
            statsInfo.innerHTML = `
                本站总访问量 <span id="busuanzi_value_site_pv">${sitePv.textContent}</span> 次 | 
                本站访客数 <span id="busuanzi_value_site_uv">${siteUv.textContent}</span> 人次 | 
                本文总阅读量 <span id="busuanzi_value_page_pv">${pagePv.textContent}</span> 次
            `;
            statsInfo.style.opacity = '1';
            statsInfo.title = '';
            console.log('不蒜子统计加载成功');
            return true;
        }
        
        return false;
    }
    
    // 处理加载失败的情况
    function handleLoadFailure() {
        const statsInfo = document.querySelector('.stats-info');
        if (!statsInfo) return;
        
        console.log('不蒜子统计服务加载失败，可能的原因：');
        console.log('1. 网络连接问题');
        console.log('2. 不蒜子服务器暂时不可用');
        console.log('3. 在本地环境测试（localhost）');
        console.log('4. 浏览器阻止了第三方脚本');
        
        // 在本地环境或加载失败时显示提示信息
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' || 
            window.location.protocol === 'file:') {
            
            statsInfo.innerHTML = `
                本站总访问量 <span>本地测试</span> 次 | 
                本站访客数 <span>本地测试</span> 人次 | 
                本文总阅读量 <span>本地测试</span> 次
            `;
            statsInfo.style.opacity = '0.7';
            statsInfo.style.color = '#999';
            statsInfo.title = '访问统计在本地环境无法正常显示，部署到服务器后将正常工作';
        } else {
            // 在线环境但加载失败
            statsInfo.innerHTML = `
                本站总访问量 <span>--</span> 次 | 
                本站访客数 <span>--</span> 人次 | 
                本文总阅读量 <span>--</span> 次
            `;
            statsInfo.style.opacity = '0.7';
            statsInfo.style.color = '#999';
            statsInfo.title = '访问统计服务暂时不可用，请稍后刷新页面';
        }
    }
    
    // 定期检查不蒜子是否加载完成
    function startStatsMonitoring() {
        let checkCount = 0;
        const maxChecks = 30; // 最多检查30次（15秒）
        
        const checkInterval = setInterval(function() {
            checkCount++;
            
            if (checkBusuanziLoaded()) {
                // 加载成功，停止检查
                clearInterval(checkInterval);
            } else if (checkCount >= maxChecks) {
                // 超时，显示失败信息
                clearInterval(checkInterval);
                handleLoadFailure();
            }
        }, 500); // 每500ms检查一次
    }
    
    // 页面加载完成后执行
    function initStats() {
        updateLastModified();
        initStatsDisplay();
        
        // 等待一小段时间后开始监控（给不蒜子脚本加载时间）
        setTimeout(startStatsMonitoring, 1000);
    }
    
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStats);
    } else {
        initStats();
    }
    
})();