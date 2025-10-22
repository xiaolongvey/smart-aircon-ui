@echo off
title Real-time Scheduling App
color 0A

echo.
echo ========================================
echo   Real-time Scheduling App
echo ========================================
echo.

echo 🔧 Installing dependencies...
npm install express socket.io

echo.
echo 🚀 Starting server...
echo    Server will be accessible at:
echo    - Local: http://localhost:3000
echo    - Network: http://[your-ip]:3000
echo.

start "Real-time Server" cmd /k "node realtime-server.js"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo 🧪 Testing connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/schedules/test' -Method GET; Write-Host '✅ Server is working!' -ForegroundColor Green } catch { Write-Host '❌ Server not responding' -ForegroundColor Red }"

echo.
echo 📱 Access the app at: http://localhost:3000
echo.

echo 🚀 Opening app...
start http://localhost:3000

echo.
echo Press any key to exit...
pause >nul
