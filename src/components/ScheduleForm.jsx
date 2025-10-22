import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePower } from '../contexts/PowerContext'
import { useSchedule } from '../contexts/ScheduleContext'
import { useSettings } from '../contexts/SettingsContext'

const ScheduleForm = () => {
  const { powerOn } = usePower()
  const { createSchedule, userInfo, updateUserName } = useSchedule()
  const { audioService } = useSettings()
  const [formData, setFormData] = useState({
    userName: '',
    startTime: '',
    endTime: '',
    comfortLevel: 22,
    scheduleDate: '',
    isToday: true
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // Smart date logic: if time is in the past, schedule for tomorrow
      if (field === 'startTime' && value) {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
        const [scheduleHour, scheduleMinute] = value.split(':').map(Number)
        
        // If scheduled time is earlier than current time, set for tomorrow
        const isPastTime = scheduleHour < currentHour || 
          (scheduleHour === currentHour && scheduleMinute <= currentMinute)
        
        if (isPastTime) {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          newData.scheduleDate = tomorrow.toISOString().split('T')[0]
          newData.isToday = false
        } else {
          newData.scheduleDate = now.toISOString().split('T')[0]
          newData.isToday = true
        }
      }
      
      return newData
    })
    
    // Update user name in context when changed
    if (field === 'userName') {
      updateUserName(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!powerOn) return
    
    setLoading(true)
    setSaveStatus(null)
    
    try {
      const result = await createSchedule(formData)
      if (result.success) {
        // Play success sound
        audioService.playSuccessSound()
        setSaveStatus({ type: 'success', message: result.message || 'Schedule created successfully!' })
        // Reset form
        setFormData(prev => ({
          ...prev,
          userName: '',
          startTime: '',
          endTime: '',
          comfortLevel: 22,
          scheduleDate: '',
          isToday: true
        }))
        // Navigate to home after a short delay
        setTimeout(() => navigate('/'), 1500)
      } else {
        // Handle conflict detection
        if (result.conflicts && result.conflicts.length > 0) {
          // Play error sound
          audioService.playErrorSound()
          const conflict = result.conflicts[0]
          
          // Convert conflict times to 12-hour format
          const formatConflictTime = (time24) => {
            const [hours, minutes] = time24.split(':').map(Number)
            const period = hours >= 12 ? 'PM' : 'AM'
            const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
            return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
          }
          
          setSaveStatus({ 
            type: 'error', 
            message: `Time slot conflicts with existing schedule by ${conflict.userName} (${formatConflictTime(conflict.startTime)}-${formatConflictTime(conflict.endTime)}). Please choose a different time.`
          })
        } else {
          // Play error sound
          audioService.playErrorSound()
          setSaveStatus({ type: 'error', message: result.error || 'Failed to create schedule' })
        }
      }
    } catch (err) {
      console.error('Failed to create schedule', err)
      setSaveStatus({ type: 'error', message: 'Failed to create schedule' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 max-w-2xl mx-auto dark:bg-black dark:border-gray-800">
      <h2 className="text-2xl font-bold text-aircon-gray-800 dark:text-white mb-6 text-center tracking-widest">
        SET SCHEDULE
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {saveStatus && (
          <div className={`p-3 rounded-lg text-sm ${saveStatus.type === 'success' ? 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-200' : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200'}`}>
            {saveStatus.message}
          </div>
        )}
        {!powerOn && (
          <div className="p-3 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
            System is in standby mode. Turn on the system to create schedules.
          </div>
        )}
        {/* User Name */}
        <div>
          <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
            User Name (optional)
          </label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            placeholder="Enter your name"
            disabled={!powerOn}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-900 dark:text-white ${
              powerOn 
                ? 'border-gray-300 dark:border-gray-600 focus:ring-teal-500' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
            Schedule Date
          </label>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={formData.scheduleDate}
              onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
              disabled={!powerOn}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-900 dark:text-white ${
                powerOn 
                  ? 'border-gray-300 dark:border-gray-600 focus:ring-teal-500' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              required
            />
            {formData.startTime && (
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                formData.isToday 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              }`}>
                {formData.isToday ? '📅 Today' : '📅 Tomorrow'}
              </div>
            )}
          </div>
          {formData.startTime && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.isToday 
                ? 'Schedule will run today' 
                : 'Time is in the past, scheduled for tomorrow'
              }
            </p>
          )}
        </div>

        {/* Time Settings - Alarm Clock Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-3">
              Start Time
            </label>
            <AlarmClockTimePicker
              value={formData.startTime}
              onChange={(time) => handleInputChange('startTime', time)}
              disabled={!powerOn}
            />
            {formData.startTime && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                <span>
                  {(() => {
                    const [hours, minutes] = formData.startTime.split(':').map(Number)
                    const period = hours >= 12 ? 'PM' : 'AM'
                    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
                  })()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.isToday 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                }`}>
                  {formData.isToday ? 'Today' : 'Tomorrow'}
                </span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-3">
              End Time
            </label>
            <AlarmClockTimePicker
              value={formData.endTime}
              onChange={(time) => handleInputChange('endTime', time)}
              disabled={!powerOn}
            />
            {formData.endTime && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                <span>
                  {(() => {
                    const [hours, minutes] = formData.endTime.split(':').map(Number)
                    const period = hours >= 12 ? 'PM' : 'AM'
                    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
                  })()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.isToday 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                }`}>
                  {formData.isToday ? 'Today' : 'Tomorrow'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Comfort Level (slider) */}
        <div>
          <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
            Comfort Level: {formData.comfortLevel}°C
          </label>
          <div className="relative">
            <input
              type="range"
              min="16"
              max="30"
              value={formData.comfortLevel}
              onChange={(e) => handleInputChange('comfortLevel', parseInt(e.target.value))}
              disabled={!powerOn}
              className={`w-full h-2 rounded-lg appearance-none slider ${
                powerOn 
                  ? 'bg-gray-200 dark:bg-gray-700 cursor-pointer' 
                  : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
              }`}
            />
            <div className="flex justify-between text-xs text-aircon-gray-500 dark:text-gray-400 mt-1">
              <span>16°C</span>
              <span>30°C</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!powerOn || loading}
            onClick={() => audioService.playClickSound()}
            className={`w-full font-medium px-6 py-3 rounded-lg transition-colors duration-200 ${
              powerOn && !loading
                ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'CREATING SCHEDULE...' : 'SAVE SCHEDULE'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Alarm Clock Time Picker Component
const AlarmClockTimePicker = ({ value, onChange, disabled }) => {
  const [hour12, setHour12] = useState(12)
  const [minute, setMinute] = useState(0)
  const [period, setPeriod] = useState('AM')

  // Initialize state when value changes
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number)
      setHour12(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours)
      setMinute(minutes)
      setPeriod(hours >= 12 ? 'PM' : 'AM')
    }
  }, [value])

  const updateTime = (newHour12, newMinute, newPeriod) => {
    let hour24 = newHour12
    if (newPeriod === 'AM' && newHour12 === 12) {
      hour24 = 0
    } else if (newPeriod === 'PM' && newHour12 !== 12) {
      hour24 = newHour12 + 12
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`
    onChange(timeString)
  }

  const handleHourChange = (newHour) => {
    setHour12(newHour)
    updateTime(newHour, minute, period)
  }

  const handleMinuteChange = (newMinute) => {
    setMinute(newMinute)
    updateTime(hour12, newMinute, period)
  }

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
    updateTime(hour12, minute, newPeriod)
  }

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // Generate minute options (0-59, in 5-minute intervals)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5)

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 ${
      disabled 
        ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900' 
        : 'border-gray-300 dark:border-gray-600'
    }`}>
      <div className="flex items-center justify-center gap-4">
        {/* Hour Selector */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">HOUR</div>
          <div className="relative">
            <select
              value={hour12}
              onChange={(e) => handleHourChange(parseInt(e.target.value))}
              disabled={disabled}
              className={`appearance-none bg-transparent text-2xl font-bold text-center focus:outline-none ${
                disabled ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-800 dark:text-white cursor-pointer'
              }`}
              style={{ width: '60px' }}
            >
              {hourOptions.map(hour => (
                <option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Colon Separator */}
        <div className="text-3xl font-bold text-gray-400 dark:text-gray-500">:</div>

        {/* Minute Selector */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">MIN</div>
          <div className="relative">
            <select
              value={minute}
              onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
              disabled={disabled}
              className={`appearance-none bg-transparent text-2xl font-bold text-center focus:outline-none ${
                disabled ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-800 dark:text-white cursor-pointer'
              }`}
              style={{ width: '60px' }}
            >
              {minuteOptions.map(min => (
                <option key={min} value={min}>
                  {min.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* AM/PM Selector */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">PERIOD</div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handlePeriodChange('AM')}
              disabled={disabled}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === 'AM'
                  ? 'bg-blue-500 text-white'
                  : disabled
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('PM')}
              disabled={disabled}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === 'PM'
                  ? 'bg-blue-500 text-white'
                  : disabled
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              PM
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-aircon-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default ScheduleForm




