#!/bin/bash
echo "🇯🇵 日本球星卡牌展示"
cd "$(dirname "$0")"
PORT=9020
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/japan-cards.html"
wait
