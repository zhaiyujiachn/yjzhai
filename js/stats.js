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
    
    // 检测不蒜子统计是否加载成功
    function checkBusuanziLoaded() {
        setTimeout(function() {
            const sitePv = document.getElementById('busuanzi_value_site_pv');
            const siteUv = document.getElementById('busuanzi_value_site_uv');
            const pagePv = document.getElementById('busuanzi_value_page_pv');
            
            // 检查元素是否存在
            if (!sitePv || !siteUv || !pagePv) {
                console.log('访问统计元素未找到');
                return;
            }
            
            // 如果3秒后仍然显示"--"，说明不蒜子没有加载成功
            if (sitePv.textContent === '--' || siteUv.textContent === '--' || pagePv.textContent === '--') {
                console.log('不蒜子统计服务加载失败，可能的原因：');
                console.log('1. 网络连接问题');
                console.log('2. 不蒜子服务器暂时不可用');
                console.log('3. 在本地环境测试（localhost）');
                console.log('4. 浏览器阻止了第三方脚本');
                
                // 在本地环境或加载失败时显示提示信息
                if (window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:') {
                    
                    sitePv.textContent = '本地测试';
                    siteUv.textContent = '本地测试';
                    pagePv.textContent = '本地测试';
                    
                    const statsInfo = document.querySelector('.stats-info');
                    if (statsInfo) {
                        statsInfo.style.color = '#999';
                        statsInfo.title = '访问统计在本地环境无法正常显示，部署到服务器后将正常工作';
                    }
                } else {
                    // 在线环境但加载失败，显示加载失败提示
                    sitePv.textContent = '加载失败';
                    siteUv.textContent = '加载失败';
                    pagePv.textContent = '加载失败';
                    
                    const statsInfo = document.querySelector('.stats-info');
                    if (statsInfo) {
                        statsInfo.style.color = '#999';
                        statsInfo.title = '访问统计服务暂时不可用，请稍后刷新页面';
                    }
                }
            } else {
                console.log('不蒜子统计加载成功');
            }
        }, 3000);
    }
    
    // 页面加载完成后执行
    function initStats() {
        updateLastModified();
        checkBusuanziLoaded();
    }
    
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStats);
    } else {
        initStats();
    }
    
    // 页面完全加载后再次检查
    window.addEventListener('load', checkBusuanziLoaded);
    
})();