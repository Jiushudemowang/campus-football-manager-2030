#!/bin/bash
echo "🇭🇷 克罗地亚球星卡牌展示"
cd "$(dirname "$0")"
PORT=9010
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/croatia-cards.html"
wait
