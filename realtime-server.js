import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory store (replace with database in production)
const schedules = new Map(); // roomId -> array of schedules
const rooms = new Set(); // track active rooms

// Helper function to get room schedules
const getRoomSchedules = (roomId) => {
  return schedules.get(roomId) || [];
};

// Helper function to add schedule to room
const addScheduleToRoom = (roomId, schedule) => {
  if (!schedules.has(roomId)) {
    schedules.set(roomId, []);
  }
  schedules.get(roomId).push(schedule);
};

// Helper function to update schedule in room
const updateScheduleInRoom = (roomId, scheduleId, updates) => {
  const roomSchedules = schedules.get(roomId);
  if (!roomSchedules) return false;
  
  const scheduleIndex = roomSchedules.findIndex(s => s.id === scheduleId);
  if (scheduleIndex === -1) return false;
  
  roomSchedules[scheduleIndex] = { ...roomSchedules[scheduleIndex], ...updates };
  return true;
};

// REST API Endpoints

// Get schedules for a room
app.get('/api/schedules/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomSchedules = getRoomSchedules(roomId);
  res.json({ success: true, data: roomSchedules });
});

// Create a new schedule
app.post('/api/schedules/:roomId', (req, res) => {
  const { roomId } = req.params;
  const { title, datetime } = req.body;
  
  if (!title || !datetime) {
    return res.status(400).json({ 
      success: false, 
      error: 'Title and datetime are required' 
    });
  }
  
  const schedule = {
    id: Date.now().toString(),
    title,
    datetime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  addScheduleToRoom(roomId, schedule);
  
  // Emit to all clients in the room
  io.to(roomId).emit('schedule:created', { schedule, roomId });
  
  res.json({ success: true, data: schedule });
});

// Update a schedule
app.put('/api/schedules/:roomId/:scheduleId', (req, res) => {
  const { roomId, scheduleId } = req.params;
  const updates = req.body;
  
  const success = updateScheduleInRoom(roomId, scheduleId, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
  
  if (!success) {
    return res.status(404).json({ 
      success: false, 
      error: 'Schedule not found' 
    });
  }
  
  const updatedSchedule = schedules.get(roomId).find(s => s.id === scheduleId);
  
  // Emit to all clients in the room
  io.to(roomId).emit('schedule:updated', { schedule: updatedSchedule, roomId });
  
  res.json({ success: true, data: updatedSchedule });
});

// Delete a schedule
app.delete('/api/schedules/:roomId/:scheduleId', (req, res) => {
  const { roomId, scheduleId } = req.params;
  const roomSchedules = schedules.get(roomId);
  
  if (!roomSchedules) {
    return res.status(404).json({ 
      success: false, 
      error: 'Room not found' 
    });
  }
  
  const scheduleIndex = roomSchedules.findIndex(s => s.id === scheduleId);
  if (scheduleIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Schedule not found' 
    });
  }
  
  const deletedSchedule = roomSchedules.splice(scheduleIndex, 1)[0];
  
  // Emit to all clients in the room
  io.to(roomId).emit('schedule:deleted', { scheduleId, roomId });
  
  res.json({ success: true, data: deletedSchedule });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle room joining
  socket.on('join', (data) => {
    const { roomId } = data;
    if (!roomId) {
      socket.emit('error', { message: 'Room ID is required' });
      return;
    }
    
    socket.join(roomId);
    rooms.add(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    // Send current schedules to the newly joined user
    const roomSchedules = getRoomSchedules(roomId);
    socket.emit('schedules:init', { schedules: roomSchedules, roomId });
  });
  
  // Handle schedule creation
  socket.on('schedule:create', (data) => {
    const { roomId, title, datetime } = data;
    
    if (!roomId || !title || !datetime) {
      socket.emit('error', { message: 'Room ID, title, and datetime are required' });
      return;
    }
    
    const schedule = {
      id: Date.now().toString(),
      title,
      datetime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addScheduleToRoom(roomId, schedule);
    
    // Emit to all clients in the room
    io.to(roomId).emit('schedule:created', { schedule, roomId });
  });
  
  // Handle schedule updates
  socket.on('schedule:update', (data) => {
    const { roomId, scheduleId, updates } = data;
    
    const success = updateScheduleInRoom(roomId, scheduleId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    if (!success) {
      socket.emit('error', { message: 'Schedule not found' });
      return;
    }
    
    const updatedSchedule = schedules.get(roomId).find(s => s.id === scheduleId);
    
    // Emit to all clients in the room
    io.to(roomId).emit('schedule:updated', { schedule: updatedSchedule, roomId });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Get server IP for mobile access
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Start server
server.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📡 API available at http://${HOST}:${PORT}/api`);
  console.log(`🔌 WebSocket server ready for real-time updates`);
  console.log(`🌐 Access URLs:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Network: http://${localIP}:${PORT}`);
  console.log(`\n📱 For mobile devices:`);
  console.log(`   1. Connect mobile to laptop hotspot`);
  console.log(`   2. Use: http://${localIP}:${PORT}`);
  console.log(`\n💡 Optional: Use ngrok for internet access:`);
  console.log(`   npx ngrok http ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
