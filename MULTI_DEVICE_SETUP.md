# Multi-Device Setup Guide

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Windows Command Prompt
start-multi-device.bat

# Windows PowerShell
.\start-multi-device.ps1
```

### Option 2: Manual Setup
```bash
# Terminal 1: Start Backend
npm run dev:backend

# Terminal 2: Start Frontend
npm run dev
```

## Testing Multi-Device Functionality

### Step 1: Start the System
- Run the automated setup script
- Wait for both servers to start
- Backend: http://localhost:3001/api
- Frontend: http://localhost:5173

### Step 2: Test on Multiple Devices
1. **Open Multiple Browser Windows/Tabs**
   - Open http://localhost:5173 in different browser windows
   - Each window will have a unique user ID

2. **Create Schedules**
   - Set different user names in each window
   - Create schedules with different times
   - Watch schedules appear in all windows

3. **Real-Time Updates**
   - Create a schedule in one window
   - It should appear in other windows within 5 seconds
   - Delete a schedule and see it disappear from all windows

## Troubleshooting

### "Failed to fetch" Error
- **Cause**: Backend server not running
- **Solution**: Run `npm run dev:backend` in a separate terminal

### Schedules Not Syncing
- **Check**: Backend is running on port 3001
- **Check**: No firewall blocking the connection
- **Check**: Browser console for errors

### Port Already in Use
- **Backend (3001)**: Kill process using port 3001
- **Frontend (5173)**: Kill process using port 5173
- **Solution**: Use `netstat -ano | findstr :3001` to find and kill process

## Network Access (Same WiFi)

### For Other Devices on Same Network
1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
2. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
3. Example: `http://192.168.1.100:5173`

### Firewall Settings
- Allow Node.js through Windows Firewall
- Allow port 3001 and 5173 for network access

## Production Deployment

### For Real Multi-Device Access
1. **Deploy Backend**: Use services like Heroku, Railway, or DigitalOcean
2. **Deploy Frontend**: Use Vercel, Netlify, or GitHub Pages
3. **Update API URL**: Change `API_BASE_URL` in `src/services/api.js`

### Environment Variables
```bash
# Backend
export PORT=3001
export NODE_ENV=production

# Frontend
export REACT_APP_API_URL=https://your-backend-url.com/api
```

## Features

✅ **Multi-User Support**: Each device gets unique user ID
✅ **Real-Time Sync**: Schedules update across all devices
✅ **User Identification**: See who created each schedule
✅ **Cross-Device Compatibility**: Works on any device with browser
✅ **Offline Fallback**: Graceful handling when backend is unavailable

## API Endpoints

- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

## Support

If you encounter issues:
1. Check that both servers are running
2. Verify no firewall blocking
3. Check browser console for errors
4. Ensure all dependencies are installed
