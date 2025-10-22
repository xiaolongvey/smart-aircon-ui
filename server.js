const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
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
    createdAt: new Date().toISOString(),
    isActive: true
  }
]

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
    const { userId, userName, startTime, endTime, comfortLevel } = req.body
    
    const newSchedule = {
      id: Date.now(),
      userId: userId || 'user_' + Math.random().toString(36).substr(2, 9),
      userName: userName || 'Anonymous',
      startTime,
      endTime,
      comfortLevel: comfortLevel || 22,
      createdAt: new Date().toISOString(),
      isActive: true
    }
    
    schedules.push(newSchedule)
    res.json({ success: true, data: newSchedule })
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
    res.json({ success: true, data: deletedSchedule })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})
