#!/bin/bash
# 启动卡牌展示服务器
# Usage: bash start.sh

echo "🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰球星卡牌展示"
echo "==============================="
echo ""
echo "正在启动服务器..."
echo ""

cd "$(dirname "$0")"

# Try port 9090, fallback to 8080
PORT=9090
python3 -m http.server $PORT 2>/dev/null || PORT=8080 && python3 -m http.server $PORT 2>/dev/null || {
  echo "❌ 无法启动服务器"
  exit 1
} &

sleep 2

echo "✅ 服务器已启动！"
echo ""
echo "📱 打开浏览器访问:"
echo "   http://localhost:$PORT/england-cards.html"
echo ""
echo "🔄 悬停卡牌即可翻转查看背面数据"
echo ""
echo "❌ 按 Ctrl+C 停止服务器"
