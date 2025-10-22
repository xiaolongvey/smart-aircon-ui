@echo off
title Smart Aircon - Fix Connection
color 0A

echo.
echo ========================================
echo   Smart Aircon - Connection Fix
echo ========================================
echo.

echo 🔧 Step 1: Stopping any existing servers...
taskkill /F /IM node.exe 2>nul

echo.
echo 🔧 Step 2: Starting server with network access...
echo    Server will be accessible at:
echo    - Main Device: http://localhost:3001
echo    - Other Devices: http://192.168.1.4:3001
echo.

start "Smart Aircon Server" cmd /k "node server.js"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo 🧪 Testing connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/schedules' -Method GET; Write-Host '✅ Server is working!' -ForegroundColor Green } catch { Write-Host '❌ Server not responding' -ForegroundColor Red }"

echo.
echo 📱 Next Steps:
echo    1. Open browser and go to: http://localhost:3001
echo    2. For other devices, use: http://192.168.1.4:3001
echo    3. If still getting errors, check Windows Firewall
echo.

echo 🚀 Opening network access page...
start http://192.168.1.4:3001/index-network.html

echo.
echo Press any key to exit...
pause >nul
