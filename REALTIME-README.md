# Real-time Scheduling App

A simple real-time scheduling application built with Node.js, Express, and Socket.IO. Features real-time updates across multiple devices using Socket.IO rooms.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install express socket.io
```

### 2. Start the Server
```bash
node realtime-server.js
```

### 3. Access the App
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000 (see mobile setup below)

## 📱 Mobile Device Setup (Laptop Hotspot)

### Step 1: Create Laptop Hotspot

**Windows:**
1. Open Settings → Network & Internet → Mobile hotspot
2. Turn on "Share my Internet connection with other devices"
3. Set a network name and password
4. Note the network name (e.g., "MyLaptop-Hotspot")

**Mac:**
1. System Preferences → Sharing → Internet Sharing
2. Share your connection from: Wi-Fi
3. To computers using: Wi-Fi
4. Click "Wi-Fi Options" to set network name and password

### Step 2: Find Your Laptop's IP Address

**Windows:**
```cmd
ipconfig
```
Look for "Wireless LAN adapter Wi-Fi" and note the IPv4 Address (e.g., 192.168.137.1)

**Mac:**
```bash
ifconfig en0
```
Look for "inet" address (e.g., 192.168.2.1)

**Linux:**
```bash
ip addr show
```
Look for your wireless interface IP

### Step 3: Connect Mobile Device
1. On your mobile device, connect to the laptop hotspot
2. Open browser and go to: `http://[your-laptop-ip]:3000`
3. Example: `http://192.168.137.1:3000`

## 🌐 Internet Access (Optional)

For access from anywhere on the internet:

### Using ngrok:
```bash
# Install ngrok globally
npm install -g ngrok

# Start your server
node realtime-server.js

# In another terminal, expose port 3000
npx ngrok http 3000
```

ngrok will provide a public URL like: `https://abc123.ngrok.io`

## 🏗️ Architecture

### Server Components
- **Express.js**: REST API endpoints
- **Socket.IO**: Real-time WebSocket communication
- **In-memory Store**: Development data storage (easily replaceable with database)

### API Endpoints
- `GET /api/schedules/:roomId` - Get schedules for a room
- `POST /api/schedules/:roomId` - Create a new schedule
- `PUT /api/schedules/:roomId/:scheduleId` - Update a schedule
- `DELETE /api/schedules/:roomId/:scheduleId` - Delete a schedule

### Socket.IO Events
- `join` - Join a room by roomId
- `schedules:init` - Initialize with current schedules
- `schedule:create` - Create a new schedule
- `schedule:update` - Update an existing schedule
- `schedule:created` - Real-time notification of new schedule
- `schedule:updated` - Real-time notification of updated schedule
- `schedule:deleted` - Real-time notification of deleted schedule

## 🗄️ Database Integration

The app uses an in-memory store for development. To integrate with a database:

### Replace in-memory store in `realtime-server.js`:

```javascript
// Replace these functions:
const getRoomSchedules = async (roomId) => {
  // Database query: SELECT * FROM schedules WHERE room_id = ?
  return await db.query('SELECT * FROM schedules WHERE room_id = ?', [roomId]);
};

const addScheduleToRoom = async (roomId, schedule) => {
  // Database insert: INSERT INTO schedules (room_id, title, datetime, ...)
  return await db.query('INSERT INTO schedules (room_id, title, datetime, created_at) VALUES (?, ?, ?, ?)', 
    [roomId, schedule.title, schedule.datetime, schedule.createdAt]);
};
```

### Example Database Schema:
```sql
CREATE TABLE schedules (
  id VARCHAR(255) PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  datetime DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Manual Testing Steps:

1. **Start the server:**
   ```bash
   node realtime-server.js
   ```

2. **Open multiple browser tabs/windows:**
   - Tab 1: http://localhost:3000
   - Tab 2: http://localhost:3000

3. **Test real-time functionality:**
   - Join the same room in both tabs
   - Create a schedule in Tab 1
   - Verify it appears instantly in Tab 2
   - Update/delete schedules and verify real-time updates

4. **Test mobile access:**
   - Connect mobile to laptop hotspot
   - Access http://[laptop-ip]:3000
   - Join the same room as desktop
   - Create schedules and verify real-time sync

### API Testing with curl:

```bash
# Get schedules for a room
curl http://localhost:3000/api/schedules/room123

# Create a schedule
curl -X POST http://localhost:3000/api/schedules/room123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting","datetime":"2024-01-15T14:00:00"}'

# Update a schedule
curl -X PUT http://localhost:3000/api/schedules/room123/schedule123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Meeting","datetime":"2024-01-15T15:00:00"}'

# Delete a schedule
curl -X DELETE http://localhost:3000/api/schedules/room123/schedule123
```

## 🔧 Configuration

### Environment Variables:
```bash
PORT=3000                    # Server port
HOST=0.0.0.0                # Server host (0.0.0.0 for network access)
```

### Socket.IO Configuration:
The server is configured to accept connections from any origin for development. For production, update the CORS settings:

```javascript
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://yourdomain.com"],
    methods: ["GET", "POST"]
  }
});
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Unable to connect to server"**
   - Check if server is running: `netstat -an | findstr :3000`
   - Verify firewall settings
   - Try accessing http://localhost:3000 directly

2. **Mobile device can't connect**
   - Ensure mobile is connected to laptop hotspot
   - Verify laptop IP address is correct
   - Check that server is running on 0.0.0.0:3000

3. **Real-time updates not working**
   - Check browser console for WebSocket errors
   - Verify Socket.IO connection in Network tab
   - Ensure both devices are in the same room

4. **ngrok not working**
   - Check if ngrok is properly installed
   - Verify the tunnel URL is accessible
   - Check ngrok dashboard for connection status

### Debug Commands:

```bash
# Check if port 3000 is in use
netstat -an | findstr :3000

# Test API endpoint
curl http://localhost:3000/api/schedules/test

# Check server logs for connection issues
node realtime-server.js
```

## 📁 File Structure

```
realtime-scheduling-app/
├── realtime-server.js      # Main server file
├── client.html             # Web client interface
├── realtime-package.json   # Package dependencies
└── REALTIME-README.md      # This file
```

## 🎯 Features

- ✅ Real-time schedule updates using Socket.IO
- ✅ Room-based user isolation
- ✅ Mobile-friendly responsive design
- ✅ REST API for CRUD operations
- ✅ WebSocket events for real-time sync
- ✅ Cross-device compatibility
- ✅ Easy database integration points
- ✅ Network access via laptop hotspot
- ✅ Optional internet access via ngrok

## 🔮 Future Enhancements

- Database persistence (PostgreSQL, MongoDB)
- User authentication and authorization
- Schedule categories and tags
- Email/SMS notifications
- Calendar integration
- Recurring schedules
- File attachments
- Push notifications for mobile
