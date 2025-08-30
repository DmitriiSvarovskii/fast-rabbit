#!/bin/bash

echo "=== Fast Rabbit VPN Debug Script ==="
echo "Date: $(date)"
echo ""

echo "1. Checking if Node.js process is running..."
if pgrep -f "node.*app.js" > /dev/null; then
    echo "✅ Node.js process is running"
    ps aux | grep "node.*app.js" | grep -v grep
else
    echo "❌ Node.js process is NOT running"
fi
echo ""

echo "2. Checking port 3000..."
if netstat -tlnp | grep :3000 > /dev/null; then
    echo "✅ Port 3000 is in use"
    netstat -tlnp | grep :3000
else
    echo "❌ Port 3000 is NOT in use"
fi
echo ""

echo "3. Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    echo "PM2 is installed"
    pm2 list
    echo ""
    echo "PM2 logs (last 20 lines):"
    pm2 logs --lines 20
else
    echo "PM2 is not installed"
fi
echo ""

echo "4. Checking nginx status..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
    systemctl status nginx --no-pager -l
else
    echo "❌ Nginx is NOT running"
fi
echo ""

echo "5. Checking nginx error logs (last 10 lines):"
if [ -f /var/log/nginx/error.log ]; then
    tail -10 /var/log/nginx/error.log
else
    echo "Nginx error log not found"
fi
echo ""

echo "6. Checking nginx access logs (last 10 lines):"
if [ -f /var/log/nginx/access.log ]; then
    tail -10 /var/log/nginx/access.log
else
    echo "Nginx access log not found"
fi
echo ""

echo "7. Testing local connection to app..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Local connection to app works"
else
    echo "❌ Local connection to app FAILED"
fi
echo ""

echo "8. Testing API connection..."
if curl -s https://api.fast-rabbit-vpn.swrsky.ru > /dev/null; then
    echo "✅ API connection works"
else
    echo "❌ API connection FAILED"
fi
echo ""

echo "9. Checking environment variables..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "API_BASE_URL: $API_BASE_URL"
echo ""

echo "10. Checking disk space..."
df -h
echo ""

echo "11. Checking memory usage..."
free -h
echo ""

echo "=== Debug script completed ==="
