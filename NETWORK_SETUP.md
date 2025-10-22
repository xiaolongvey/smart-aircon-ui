# Multi-Device Network Setup Guide

## Quick Fix for "Unable to connect to server" Error

### Step 1: Start the Server for Network Access

**Windows:**
```bash
# Option 1: Use the batch file
start-server.bat

# Option 2: Use npm script
npm run server:network
```

**Mac/Linux:**
```bash
# Option 1: Use the shell script
chmod +x start-server.sh
./start-server.sh

# Option 2: Use npm script
npm run server:network
```

### Step 2: Find Your Network IP Address

The server will display your network IP address when it starts. Look for:
```
Server running on 0.0.0.0:3001
Access from other devices: http://[YOUR_IP]:3001
```

### Step 3: Access from Different Devices

1. **Same Network**: All devices must be on the same WiFi network
2. **Use Network URL**: Instead of `localhost`, use your network IP
   - Example: `http://192.168.1.100:3001`
3. **Firewall**: Allow port 3001 through your firewall

### Step 4: Troubleshooting

**If still getting connection errors:**

1. **Check Firewall Settings**
   - Windows: Allow Node.js through Windows Firewall
   - Mac: Allow incoming connections on port 3001

2. **Check Network**
   - Ensure all devices are on the same network
   - Try accessing from the same device first

3. **Manual Configuration**
   - Set environment variables:
   ```bash
   # Windows
   set REACT_APP_API_URL=http://YOUR_IP:3001/api
   set REACT_APP_WS_URL=http://YOUR_IP:3001
   
   # Mac/Linux
   export REACT_APP_API_URL=http://YOUR_IP:3001/api
   export REACT_APP_WS_URL=http://YOUR_IP:3001
   ```

### Step 5: Production Deployment

For permanent multi-device access, consider:
- Deploy to a cloud service (Heroku, Vercel, etc.)
- Use a static IP address
- Set up a domain name

## Network Configuration Changes Made

✅ **Server now listens on all network interfaces (0.0.0.0)**
✅ **CORS configured for multi-device access**
✅ **Auto-detection of server URLs**
✅ **Better error handling and timeouts**
✅ **Network startup scripts created**

## Testing Multi-Device Access

1. Start server on main device
2. Note the network IP address shown
3. Open browser on another device
4. Navigate to `http://[NETWORK_IP]:3001`
5. Create schedules and verify real-time updates work
