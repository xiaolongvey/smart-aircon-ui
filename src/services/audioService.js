class AudioService {
  constructor() {
    this.audioContext = null
    this.isEnabled = true
    this.volume = 0.5
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  // Enable/disable sound effects
  setEnabled(enabled) {
    this.isEnabled = enabled
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // Generate a simple beep sound
  generateBeep(frequency = 800, duration = 200, type = 'sine') {
    if (!this.audioContext || !this.isEnabled) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration / 1000)
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }

  // Startup ping sound (higher pitch, longer duration)
  playStartupPing() {
    if (!this.isEnabled) return
    
    // Resume audio context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    this.generateBeep(1000, 300, 'sine')
  }

  // Click sound (shorter, lower pitch)
  playClickSound() {
    if (!this.isEnabled) return
    
    // Resume audio context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    this.generateBeep(600, 100, 'square')
  }

  // Success sound (ascending tone)
  playSuccessSound() {
    if (!this.isEnabled) return
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    // Play two ascending beeps
    this.generateBeep(600, 150, 'sine')
    setTimeout(() => {
      this.generateBeep(800, 150, 'sine')
    }, 100)
  }

  // Error sound (descending tone)
  playErrorSound() {
    if (!this.isEnabled) return
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    // Play two descending beeps
    this.generateBeep(800, 150, 'sine')
    setTimeout(() => {
      this.generateBeep(400, 150, 'sine')
    }, 100)
  }

  // Power on sound
  playPowerOnSound() {
    if (!this.isEnabled) return
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    // Ascending power-up sound
    this.generateBeep(400, 200, 'sine')
    setTimeout(() => {
      this.generateBeep(600, 200, 'sine')
    }, 150)
    setTimeout(() => {
      this.generateBeep(800, 300, 'sine')
    }, 300)
  }

  // Power off sound
  playPowerOffSound() {
    if (!this.isEnabled) return
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    // Descending power-down sound
    this.generateBeep(800, 200, 'sine')
    setTimeout(() => {
      this.generateBeep(600, 200, 'sine')
    }, 150)
    setTimeout(() => {
      this.generateBeep(400, 300, 'sine')
    }, 300)
  }
}

// Create singleton instance
const audioService = new AudioService()

export default audioService
