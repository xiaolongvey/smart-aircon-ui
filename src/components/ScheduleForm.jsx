import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePower } from '../contexts/PowerContext'

const ScheduleForm = () => {
  const { powerOn } = usePower()
  const [formData, setFormData] = useState({
    userName: '',
    startTime: '',
    endTime: '',
    comfortLevel: 22
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // days and enable toggles removed for simplified form

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!powerOn) return
    
    console.log('Schedule submitted:', formData)
    try {
      const schedules = JSON.parse(localStorage.getItem('schedules') || '[]')
      const newSchedule = { id: Date.now(), ...formData }
      const next = [newSchedule, ...schedules].slice(0, 10)
      localStorage.setItem('schedules', JSON.stringify(next))
      setSaveStatus({ type: 'success', message: 'Schedule saved' })
      navigate('/')
    } catch (err) {
      console.error('Failed to save schedule', err)
      setSaveStatus({ type: 'error', message: 'Failed to save schedule' })
    }
    // Here you would typically send the data to your backend
  }

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-aircon-gray-800 mb-6 text-center tracking-widest">
        SET SCHEDULE
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {saveStatus && (
          <div className={`p-3 rounded-lg text-sm ${saveStatus.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'}`}>
            {saveStatus.message}
          </div>
        )}
        {!powerOn && (
          <div className="p-3 rounded-lg text-sm bg-gray-50 text-gray-500 text-center">
            System is in standby mode. Turn on the system to create schedules.
          </div>
        )}
        {/* User Name */}
        <div>
          <label className="block text-sm font-medium text-aircon-gray-700 mb-2">
            User Name (optional)
          </label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            placeholder="Enter your name"
            disabled={!powerOn}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
              powerOn 
                ? 'border-gray-300 focus:ring-teal-500' 
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Time Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-aircon-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              disabled={!powerOn}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                powerOn 
                  ? 'border-gray-300 focus:ring-teal-500' 
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-aircon-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              disabled={!powerOn}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                powerOn 
                  ? 'border-gray-300 focus:ring-teal-500' 
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              required
            />
          </div>
        </div>

        {/* Comfort Level (slider) */}
        <div>
          <label className="block text-sm font-medium text-aircon-gray-700 mb-2">
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
                  ? 'bg-gray-200 cursor-pointer' 
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
            <div className="flex justify-between text-xs text-aircon-gray-500 mt-1">
              <span>16°C</span>
              <span>30°C</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!powerOn}
            className={`w-full font-medium px-6 py-3 rounded-lg transition-colors duration-200 ${
              powerOn 
                ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            SAVE SCHEDULE
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




