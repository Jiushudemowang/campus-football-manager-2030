#!/bin/bash
echo "🏫 校园足球经理"
cd "$(dirname "$0")"
PORT=9300
python3 -m http.server $PORT > /dev/null 2>&1 &
sleep 2
echo "✅ http://localhost:$PORT/校园足球经理·华中科技大学新闻学院.html"
wait
