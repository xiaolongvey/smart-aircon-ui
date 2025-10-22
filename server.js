import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || '0.0.0.0' // Listen on all network interfaces

// Middleware
app.use(cors({
  origin: "*", // Allow all origins for multi-device access
  credentials: true
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// In-memory storage (in production, use a real database)
let schedules = [
  {
    id: 1,
    userId: 'user_demo',
    userName: 'Demo User',
    startTime: '08:00',
    endTime: '12:00',
    comfortLevel: 22,
    scheduleDate: new Date().toISOString().split('T')[0],
    isToday: true,
    createdAt: new Date().toISOString(),
    isActive: true
  }
]

// Active users tracking
let activeUsers = new Map()
let userSessions = new Map()
let uniqueUserNames = new Set() // Track unique user names

// Helper functions
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

const checkScheduleConflict = (newSchedule, existingSchedules) => {
  const conflicts = []
  
  for (const existing of existingSchedules) {
    if (existing.id === newSchedule.id) continue // Skip self
    
    // Check if dates match
    if (existing.scheduleDate !== newSchedule.scheduleDate) continue
    
    // Check time overlap
    const newStart = newSchedule.startTime
    const newEnd = newSchedule.endTime
    const existingStart = existing.startTime
    const existingEnd = existing.endTime
    
    // Convert to minutes for easier comparison
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }
    
    const newStartMin = timeToMinutes(newStart)
    const newEndMin = timeToMinutes(newEnd)
    const existingStartMin = timeToMinutes(existingStart)
    const existingEndMin = timeToMinutes(existingEnd)
    
    // Check for overlap
    if ((newStartMin < existingEndMin && newEndMin > existingStartMin)) {
      conflicts.push({
        id: existing.id,
        userName: existing.userName,
        startTime: existing.startTime,
        endTime: existing.endTime,
        comfortLevel: existing.comfortLevel
      })
    }
  }
  
  return conflicts
}

const broadcastUpdate = (event, data) => {
  io.emit(event, data)
}

const getUniqueUserCount = () => {
  return uniqueUserNames.size
}

const getActiveUsersForToday = () => {
  const today = new Date().toISOString().split('T')[0]
  const todaySchedules = schedules.filter(schedule => schedule.scheduleDate === today)
  const uniqueUsersToday = new Set()
  
  todaySchedules.forEach(schedule => {
    if (schedule.userName && schedule.userName.trim() !== '' && schedule.userName !== 'Anonymous') {
      uniqueUsersToday.add(schedule.userName.trim())
    }
  })
  
  return uniqueUsersToday.size
}

// API Routes
app.get('/api/schedules', (req, res) => {
  try {
    res.json({ success: true, data: schedules })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/schedules', (req, res) => {
  try {
    const { userId, userName, startTime, endTime, comfortLevel, scheduleDate, isToday } = req.body
    
    // Generate user ID if not provided
    const finalUserId = userId || generateUserId()
    
    const newSchedule = {
      id: Date.now(),
      userId: finalUserId,
      userName: userName || 'Anonymous',
      startTime,
      endTime,
      comfortLevel: comfortLevel || 22,
      scheduleDate: scheduleDate || new Date().toISOString().split('T')[0],
      isToday: isToday !== undefined ? isToday : true,
      createdAt: new Date().toISOString(),
      isActive: true
    }
    
    // Check for conflicts
    const conflicts = checkScheduleConflict(newSchedule, schedules)
    
    if (conflicts.length > 0) {
      return res.json({ 
        success: false, 
        error: 'Schedule conflict detected',
        conflicts: conflicts,
        message: `Time slot conflicts with existing schedule by ${conflicts[0].userName} (${conflicts[0].startTime}-${conflicts[0].endTime})`
      })
    }
    
    // Add schedule
    schedules.push(newSchedule)
    
    // Track unique user name if provided
    if (userName && userName.trim() !== '' && userName !== 'Anonymous') {
      uniqueUserNames.add(userName.trim())
    }
    
    // Broadcast update to all connected clients
    broadcastUpdate('schedule_created', {
      schedule: newSchedule,
      totalSchedules: schedules.length,
      activeUsers: getActiveUsersForToday()
    })
    
    res.json({ 
      success: true, 
      data: newSchedule,
      message: 'Schedule created successfully',
      totalSchedules: schedules.length
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put('/api/schedules/:id', (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    const index = schedules.findIndex(s => s.id === parseInt(id))
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }
    
    schedules[index] = { ...schedules[index], ...updateData }
    res.json({ success: true, data: schedules[index] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.delete('/api/schedules/:id', (req, res) => {
  try {
    const { id } = req.params
    
    const index = schedules.findIndex(s => s.id === parseInt(id))
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }
    
    const deletedSchedule = schedules.splice(index, 1)[0]
    
    // Broadcast update to all connected clients
    broadcastUpdate('schedule_deleted', {
      schedule: deletedSchedule,
      totalSchedules: schedules.length,
      activeUsers: getActiveUsersForToday()
    })
    
    res.json({ 
      success: true, 
      data: deletedSchedule,
      message: 'Schedule deleted successfully',
      totalSchedules: schedules.length
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
  
  // Track active user
  const userId = generateUserId()
  activeUsers.set(socket.id, {
    id: userId,
    socketId: socket.id,
    connectedAt: new Date().toISOString(),
    userName: null // Will be set when user provides a name
  })
  
  // Send current schedules to new user
  socket.emit('schedules_updated', {
    schedules: schedules,
    totalSchedules: schedules.length,
    activeUsers: getActiveUsersForToday()
  })
  
  // Handle user name updates
  socket.on('update_user_name', (data) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      // Remove old name from unique set if it exists
      if (user.userName && user.userName !== 'Anonymous') {
        uniqueUserNames.delete(user.userName)
      }
      
      // Update user name
      user.userName = data.userName
      activeUsers.set(socket.id, user)
      
      // Add new name to unique set (only if not empty/Anonymous)
      if (data.userName && data.userName.trim() !== '' && data.userName !== 'Anonymous') {
        uniqueUserNames.add(data.userName.trim())
      }
      
      // Broadcast user update
      broadcastUpdate('user_updated', {
        userId: user.id,
        userName: data.userName,
        activeUsers: getActiveUsersForToday()
      })
    }
  })
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    const user = activeUsers.get(socket.id)
    
    // Remove user name from unique set if it exists
    if (user && user.userName && user.userName !== 'Anonymous') {
      uniqueUserNames.delete(user.userName)
    }
    
    activeUsers.delete(socket.id)
    
    // Broadcast user count update
    broadcastUpdate('user_disconnected', {
      activeUsers: getActiveUsersForToday()
    })
  })
})

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`)
  console.log(`📡 API available at http://${HOST}:${PORT}/api`)
  console.log(`🔌 WebSocket server ready for real-time updates`)
  console.log(`🌐 Access from other devices:`)
  console.log(`   - Local: http://localhost:${PORT}`)
  console.log(`   - Network: http://192.168.1.4:${PORT}`)
  console.log(`   - Any device on same network can use the Network URL above`)
  console.log(`\n💡 If other devices can't connect:`)
  console.log(`   1. Make sure all devices are on the same WiFi network`)
  console.log(`   2. Check Windows Firewall - allow Node.js through firewall`)
  console.log(`   3. Try accessing http://192.168.1.4:${PORT} from another device`)
})
