#!/bin/bash
echo "🇦🇷 阿根廷球星卡牌展示"
cd "$(dirname "$0")"
PORT=9060
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/argentina-cards.html"
wait
