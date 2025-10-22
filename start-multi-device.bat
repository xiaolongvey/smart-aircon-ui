@echo off
echo Starting Smart Aircon Multi-Device System...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev:backend"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Multi-Device System Started!
echo ========================================
echo.
echo Backend API: http://localhost:3001/api
echo Frontend App: http://localhost:5173
echo.
echo To test multi-device functionality:
echo 1. Open multiple browser windows/tabs
echo 2. Navigate to http://localhost:5173
echo 3. Create schedules on different devices
echo 4. Watch schedules sync across all devices
echo.
echo Press any key to close this window...
pause > nul
