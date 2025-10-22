import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePower } from '../contexts/PowerContext'
import { useSchedule } from '../contexts/ScheduleContext'

const ScheduleForm = () => {
  const { powerOn } = usePower()
  const { createSchedule, userInfo, updateUserName } = useSchedule()
  const [formData, setFormData] = useState({
    userName: userInfo.userName,
    startTime: '',
    endTime: '',
    comfortLevel: 22
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
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
        setSaveStatus({ type: 'success', message: 'Schedule created successfully!' })
        // Reset form
        setFormData(prev => ({
          ...prev,
          startTime: '',
          endTime: '',
          comfortLevel: 22
        }))
        // Navigate to home after a short delay
        setTimeout(() => navigate('/'), 1500)
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Failed to create schedule' })
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

        {/* Time Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              disabled={!powerOn}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-900 dark:text-white ${
                powerOn 
                  ? 'border-gray-300 dark:border-gray-600 focus:ring-teal-500' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              disabled={!powerOn}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-900 dark:text-white ${
                powerOn 
                  ? 'border-gray-300 dark:border-gray-600 focus:ring-teal-500' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              required
            />
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




