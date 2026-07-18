#!/bin/bash
echo "🇵🇹 葡萄牙球星卡牌展示"
cd "$(dirname "$0")"
PORT=9030
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/portugal-cards.html"
wait
