@echo off
echo Starting Smart Aircon Server for Multi-Device Access...
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto :found
)
:found

echo Server will be accessible at:
echo   - Local: http://localhost:3001
echo   - Network: http://%LOCAL_IP%:3001
echo.
echo To access from other devices:
echo   1. Make sure all devices are on the same network
echo   2. Use the Network URL above on other devices
echo   3. If firewall blocks, allow port 3001
echo.

REM Start the server
node server.js

pause
