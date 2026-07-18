#!/bin/bash
echo "🇪🇸 西班牙球星卡牌展示"
cd "$(dirname "$0")"
PORT=9050
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/spain-cards.html"
wait
