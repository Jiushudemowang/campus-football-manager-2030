🇫🇷 法国球星卡牌展示
====================
cd "$(dirname "$0")"
PORT=9070
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/france-cards.html"
echo "❌ Ctrl+C 停止"
wait
