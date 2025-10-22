// API service for shared schedules
const getApiBaseUrl = () => {
  // Try to detect the server URL automatically
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL
  }
  
  // For development, try to connect to the same host as the frontend
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  const port = window.location.port || '3001'
  
  // If running on same host, use the same port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3001/api`
  }
  
  // For other devices, try common server ports
  return `${protocol}//${hostname}:3001/api`
}

const API_BASE_URL = getApiBaseUrl()

// Generate a simple user ID based on device/browser
const getUserId = () => {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('userId', userId)
  }
  return userId
}

// Get user info
const getUserInfo = () => {
  const userId = getUserId()
  const userName = localStorage.getItem('userName') || `User ${userId.slice(-4)}`
  return { userId, userName }
}

// Set user name
const setUserName = (name) => {
  localStorage.setItem('userName', name)
}

// Mock schedules storage (in real app, this would be a database)
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

// API functions
export const scheduleAPI = {
  // Get all schedules
  async getAllSchedules() {
    try {
      console.log(`Attempting to connect to: ${API_BASE_URL}`)
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // Increased timeout for network issues
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Successfully connected to server')
      return data
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
      console.error('Server URL attempted:', API_BASE_URL)
      
      // Return error with more specific message
      return { 
        success: false, 
        error: 'Unable to connect to server. Please check if the backend is running.',
        data: [] 
      }
    }
  },

  // Create a new schedule
  async createSchedule(scheduleData) {
    try {
      const { userId, userName } = getUserInfo()
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          ...scheduleData
        }),
        signal: AbortSignal.timeout(5000)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to create schedule:', error)
      return { success: false, error: 'Unable to connect to server. Please check if the backend is running.' }
    }
  },

  // Update a schedule
  async updateSchedule(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to update schedule:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete a schedule
  async deleteSchedule(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to delete schedule:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user info
  getUserInfo,
  setUserName
}

// Real-time updates simulation (in real app, this would be WebSocket)
export const realtimeAPI = {
  // Subscribe to schedule updates
  subscribeToUpdates(callback) {
    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await scheduleAPI.getAllSchedules()
        if (response.success) {
          callback(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch updates:', error)
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }
}
