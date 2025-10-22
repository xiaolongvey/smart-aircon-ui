import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    temperatureUnit: 'celsius',
    energySaver: true,
    notifications: true,
    autoUpdate: false,
    language: 'english',
    soundEffects: true,
    vibration: false
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }, [settings])

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetSettings = () => {
    setSettings({
      darkMode: false,
      temperatureUnit: 'celsius',
      energySaver: true,
      notifications: true,
      autoUpdate: false,
      language: 'english',
      soundEffects: true,
      vibration: false
    })
  }

  // Temperature conversion utilities
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32)
  }

  const fahrenheitToCelsius = (fahrenheit) => {
    return Math.round((fahrenheit - 32) * 5/9)
  }

  const convertTemperature = (temp, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return temp
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return celsiusToFahrenheit(temp)
    }
    if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      return fahrenheitToCelsius(temp)
    }
    return temp
  }

  const formatTemperature = (temp, unit = null) => {
    const displayUnit = unit || settings.temperatureUnit
    const convertedTemp = convertTemperature(temp, 'celsius', displayUnit)
    return `${convertedTemp}°${displayUnit === 'celsius' ? 'C' : 'F'}`
  }

  const value = {
    settings,
    updateSetting,
    resetSettings,
    convertTemperature,
    formatTemperature,
    celsiusToFahrenheit,
    fahrenheitToCelsius
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
