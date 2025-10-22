@echo off
title Smart Aircon - Network Server
color 0A

echo.
echo ========================================
echo   Smart Aircon - Network Server
echo ========================================
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto :found
)
:found

echo 🌐 Network Configuration:
echo    Local IP: %LOCAL_IP%
echo    Port: 3001
echo.
echo 📱 Access URLs:
echo    Main Device: http://localhost:3001
echo    Other Devices: http://%LOCAL_IP%:3001
echo.
echo 🔧 Network Test:
echo    Test Page: http://%LOCAL_IP%:3001/network-test.html
echo.

echo ⚠️  IMPORTANT FOR OTHER DEVICES:
echo    1. All devices must be on the same WiFi network
echo    2. Windows Firewall may block connections
echo    3. If blocked, allow Node.js through Windows Firewall
echo.

echo 🚀 Starting server...
echo.

REM Start the server
node server.js

echo.
echo Server stopped. Press any key to exit...
pause >nul
