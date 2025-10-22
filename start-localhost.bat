@echo off
title Smart Aircon - Localhost Server
color 0A

echo.
echo ========================================
echo   Smart Aircon - Localhost Server
echo ========================================
echo.

echo 🔧 Starting server for localhost only...
echo    Server will be accessible at: http://localhost:3001
echo    No network access required
echo.

start "Smart Aircon Server" cmd /k "node server.js"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo 🧪 Testing localhost connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/schedules' -Method GET; Write-Host '✅ Server is working on localhost!' -ForegroundColor Green } catch { Write-Host '❌ Server not responding' -ForegroundColor Red }"

echo.
echo 📱 Access the app at: http://localhost:3001
echo.

echo 🚀 Opening app...
start http://localhost:3001

echo.
echo Press any key to exit...
pause >nul
