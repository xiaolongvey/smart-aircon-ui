import { createContext, useContext, useState, useEffect } from 'react'
import { scheduleAPI } from '../services/api'
import websocketService from '../services/websocket'

const ScheduleContext = createContext()

export const useSchedule = () => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userInfo, setUserInfo] = useState(scheduleAPI.getUserInfo())
  const [activeUsers, setActiveUsers] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false })

  // Load schedules on mount
  useEffect(() => {
    loadSchedules()
    
    // Connect to WebSocket
    const socket = websocketService.connect()
    
    // Set up real-time event listeners
    websocketService.onSchedulesUpdated((data) => {
      setSchedules(data.schedules)
      setActiveUsers(data.activeUsers)
    })
    
    websocketService.onScheduleCreated((data) => {
      setSchedules(prev => [data.schedule, ...prev])
      setActiveUsers(data.activeUsers)
    })
    
    websocketService.onScheduleDeleted((data) => {
      setSchedules(prev => prev.filter(s => s.id !== data.schedule.id))
      setActiveUsers(data.activeUsers)
    })
    
    websocketService.onUserUpdated((data) => {
      setActiveUsers(data.activeUsers)
    })
    
    websocketService.onUserDisconnected((data) => {
      setActiveUsers(data.activeUsers)
    })
    
    // Update connection status
    const updateConnectionStatus = () => {
      setConnectionStatus(websocketService.getConnectionStatus())
    }
    
    updateConnectionStatus()
    const statusInterval = setInterval(updateConnectionStatus, 5000)
    
    return () => {
      clearInterval(statusInterval)
      websocketService.removeAllListeners()
    }
  }, [])

  const loadSchedules = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await scheduleAPI.getAllSchedules()
      if (response.success) {
        setSchedules(response.data)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  const createSchedule = async (scheduleData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await scheduleAPI.createSchedule(scheduleData)
      if (response.success) {
        setSchedules(prev => [response.data, ...prev])
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to create schedule'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (id, updateData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await scheduleAPI.updateSchedule(id, updateData)
      if (response.success) {
        setSchedules(prev => 
          prev.map(schedule => 
            schedule.id === id ? response.data : schedule
          )
        )
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to update schedule'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await scheduleAPI.deleteSchedule(id)
      if (response.success) {
        setSchedules(prev => prev.filter(schedule => schedule.id !== id))
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to delete schedule'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updateUserName = (name) => {
    scheduleAPI.setUserName(name)
    setUserInfo(prev => ({ ...prev, userName: name }))
    // Notify server of user name update
    websocketService.updateUserName(name)
  }

  // Get schedules by user
  const getUserSchedules = (userId) => {
    return schedules.filter(schedule => schedule.userId === userId)
  }

  // Get all schedules sorted by time
  const getSortedSchedules = () => {
    return [...schedules].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number)
      const timeB = b.startTime.split(':').map(Number)
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
    })
  }

  const value = {
    schedules,
    loading,
    error,
    userInfo,
    activeUsers,
    connectionStatus,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    loadSchedules,
    updateUserName,
    getUserSchedules,
    getSortedSchedules
  }

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  )
}
