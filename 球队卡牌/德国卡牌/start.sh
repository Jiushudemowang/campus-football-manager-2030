#!/bin/bash
echo "🇩🇪 德国球星卡牌展示"
cd "$(dirname "$0")"
PORT=9040
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/germany-cards.html"
wait
