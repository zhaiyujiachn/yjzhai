#!/bin/bash

# 代码质量检查脚本
echo "🔍 开始代码质量检查..."

# 检查 JavaScript 语法
echo "📝 检查 JavaScript 语法..."
find . -name "*.js" -not -path "./node_modules/*" | while read file; do
    if command -v node >/dev/null 2>&1; then
        node -c "$file" 2>/dev/null || echo "❌ 语法错误: $file"
    fi
done

# 检查 HTML 结构
echo "🌐 检查 HTML 结构..."
find . -name "*.html" | while read file; do
    # 检查基本的 HTML 标签匹配
    if ! grep -q "<!DOCTYPE" "$file"; then
        echo "⚠️  缺少 DOCTYPE: $file"
    fi
    if ! grep -q "<html" "$file"; then
        echo "⚠️  缺少 html 标签: $file"
    fi
    if ! grep -q "<head>" "$file"; then
        echo "⚠️  缺少 head 标签: $file"
    fi
    if ! grep -q "<body>" "$file"; then
        echo "⚠️  缺少 body 标签: $file"
    fi
done

# 检查文件大小
echo "📊 检查文件大小..."
find . -name "*.js" -o -name "*.html" -o -name "*.css" | while read file; do
    size=$(wc -c < "$file")
    if [ "$size" -gt 100000 ]; then
        echo "⚠️  文件过大 ($(($size/1024))KB): $file"
    fi
done

# 检查代码复杂度（简单版本）
echo "🧮 检查代码复杂度..."
find . -name "*.js" -not -path "./node_modules/*" | while read file; do
    # 统计函数数量
    func_count=$(grep -c "function\|=>" "$file" 2>/dev/null || echo 0)
    # 统计行数
    line_count=$(wc -l < "$file")
    
    if [ "$func_count" -gt 20 ]; then
        echo "⚠️  函数过多 ($func_count 个): $file"
    fi
    if [ "$line_count" -gt 500 ]; then
        echo "⚠️  文件过长 ($line_count 行): $file"
    fi
done

# 检查安全问题
echo "🔒 检查安全问题..."
find . -name "*.js" -o -name "*.html" | while read file; do
    if grep -q "eval(" "$file"; then
        echo "🚨 安全风险 - 使用了 eval(): $file"
    fi
    if grep -q "innerHTML.*+" "$file"; then
        echo "⚠️  潜在 XSS 风险 - innerHTML 拼接: $file"
    fi
    if grep -q "document.write" "$file"; then
        echo "⚠️  不推荐使用 document.write: $file"
    fi
done

# 检查性能问题
echo "⚡ 检查性能问题..."
find . -name "*.js" | while read file; do
    if grep -q "setInterval\|setTimeout" "$file"; then
        echo "⏰ 注意定时器使用: $file"
    fi
    if grep -c "addEventListener" "$file" | awk '$1 > 10 {print "⚠️  事件监听器过多: " FILENAME}' FILENAME="$file"; then
        :
    fi
done

echo "✅ 代码质量检查完成！"