#!/bin/bash

echo "🚀 启动简单的访问统计服务器..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查端口是否被占用
if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 8001 已被占用，正在尝试关闭..."
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# 启动服务器
echo "📡 启动服务器在端口 8001..."
node simple-server.js &
SERVER_PID=$!

echo "✅ 服务器已启动！"
echo "📱 访问地址: http://localhost:8001"
echo "📊 统计页面: http://localhost:8001/stats.html"
echo "🔧 进程 ID: $SERVER_PID"
echo ""
echo "💡 提示:"
echo "   - 数据会自动保存到 visit-data.json 文件"
echo "   - 服务器每小时自动更新一次数据"
echo "   - 按 Ctrl+C 停止服务器"
echo ""

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务器...'; kill $SERVER_PID 2>/dev/null; echo '✅ 服务器已停止'; exit 0" INT

# 保持脚本运行
wait $SERVER_PID