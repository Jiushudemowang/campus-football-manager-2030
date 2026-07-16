#!/bin/bash
echo "🇧🇷 巴西球星卡牌展示"
echo "===================="
cd "$(dirname "$0")"
PORT=9080
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ 服务器已启动！"
echo "📱 http://localhost:$PORT/brazil-cards.html"
echo "❌ Ctrl+C 停止服务器"
wait
