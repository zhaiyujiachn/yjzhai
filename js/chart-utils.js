/**
 * 图表工具类 - 统一管理图表创建和配置
 */
class ChartUtils {
    /**
     * 创建基础的访问量趋势图表
     * @param {string} canvasId - 画布元素ID
     * @param {Array} dates - 日期数组
     * @param {Array} visits - 访问量数组
     * @param {Array} totalCounts - 总访问量数组（可选）
     * @param {Object} options - 额外配置选项
     */
    static createVisitChart(canvasId, dates, visits, totalCounts = null, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            logger.error(`找不到图表画布元素: ${canvasId}`);
            return null;
        }

        const ctx = canvas.getContext('2d');
        
        // 销毁现有图表实例
        const instanceName = options.instanceName || 'chartInstance';
        if (window[instanceName] && typeof window[instanceName].destroy === 'function') {
            window[instanceName].destroy();
        }

        // 根据数据量调整显示参数
        const dataCount = dates.length;
        const pointRadius = dataCount > 100 ? 1 : dataCount > 50 ? 2 : options.pointRadius || 3;
        const maxTicksLimit = Math.min(10, Math.max(5, Math.floor(dataCount / 10)));

        // 准备标签
        const labels = dates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        });

        // 创建图表配置
        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '每日新增访问量',
                    data: visits,
                    borderColor: options.borderColor || '#667eea',
                    backgroundColor: options.backgroundColor || 'rgba(102, 126, 234, 0.1)',
                    borderWidth: options.borderWidth || 2,
                    fill: options.fill !== false,
                    tension: options.tension || 0.4,
                    pointBackgroundColor: options.pointBackgroundColor || '#667eea',
                    pointBorderColor: options.pointBorderColor || '#fff',
                    pointBorderWidth: options.pointBorderWidth || 2,
                    pointRadius: pointRadius,
                    pointHoverRadius: pointRadius + 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: options.showTitle !== false,
                        text: options.title || `访问量趋势 (${dataCount} 天数据)`
                    },
                    legend: {
                        display: options.showLegend === true
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: options.borderColor || '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return dates[context[0].dataIndex];
                            },
                            label: function(context) {
                                const result = [`新增访问: ${context.parsed.y} 次`];
                                
                                // 如果有总访问量数据，也显示
                                if (totalCounts && totalCounts[context.dataIndex]) {
                                    result.push(`累计访问: ${totalCounts[context.dataIndex].toLocaleString()} 次`);
                                }
                                
                                return result;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: options.showAxisTitles !== false,
                            text: '日期'
                        },
                        ticks: {
                            maxTicksLimit: maxTicksLimit,
                            maxRotation: 45,
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: options.showAxisTitles !== false,
                            text: '访问量'
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: '#666'
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
        };

        try {
            // 创建图表
            const chart = new Chart(ctx, chartConfig);
            
            // 保存实例引用
            window[instanceName] = chart;
            
            logger.log(`图表创建完成: ${canvasId}`, {
                dataPoints: dataCount,
                pointRadius: pointRadius,
                maxTicksLimit: maxTicksLimit
            });
            
            return chart;
        } catch (error) {
            logger.error(`创建图表失败: ${canvasId}`, error);
            
            // 显示错误信息
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '16px Arial';
            ctx.fillStyle = '#ff6b6b';
            ctx.textAlign = 'center';
            ctx.fillText('图表加载失败，请刷新页面重试', canvas.width / 2, canvas.height / 2);
            
            return null;
        }
    }

    /**
     * 显示无数据提示
     * @param {string} canvasId - 画布元素ID
     * @param {string} message - 提示信息
     */
    static showNoDataMessage(canvasId, message = '暂无访问数据，请稍后再试') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    /**
     * 销毁图表实例
     * @param {string} instanceName - 实例名称
     */
    static destroyChart(instanceName) {
        if (window[instanceName] && typeof window[instanceName].destroy === 'function') {
            window[instanceName].destroy();
            window[instanceName] = null;
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChartUtils };
} else {
    window.ChartUtils = ChartUtils;
}