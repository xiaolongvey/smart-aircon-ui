import { io } from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket
    }

    const getServerUrl = () => {
      if (process.env.REACT_APP_WS_URL) {
        return process.env.REACT_APP_WS_URL
      }
      
      // Auto-detect server URL based on current location
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
      const hostname = window.location.hostname
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//localhost:3001`
      }
      
      // For network access, use the current hostname with port 3001
      return `${protocol}//${hostname}:3001`
    }
    
    const serverUrl = getServerUrl()
    console.log('🔌 WebSocket connecting to:', serverUrl)
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      this.isConnected = true
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.isConnected = false
      this.handleReconnect()
    })

    return this.socket
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Event listeners
  onSchedulesUpdated(callback) {
    this.socket?.on('schedules_updated', callback)
  }

  onScheduleCreated(callback) {
    this.socket?.on('schedule_created', callback)
  }

  onScheduleDeleted(callback) {
    this.socket?.on('schedule_deleted', callback)
  }

  onUserUpdated(callback) {
    this.socket?.on('user_updated', callback)
  }

  onUserDisconnected(callback) {
    this.socket?.on('user_disconnected', callback)
  }

  // Emit events
  updateUserName(userName) {
    this.socket?.emit('update_user_name', { userName })
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners()
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService()

export default websocketService
