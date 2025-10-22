import { useState } from 'react'
import { usePower } from '../contexts/PowerContext'
import { useSettings } from '../contexts/SettingsContext'

const TemperatureCard = ({ temperature = 22, isOn = true, mode = 'cool' }) => {
  const [currentTemp, setCurrentTemp] = useState(temperature)
  const { powerOn, togglePower } = usePower()
  const { settings, formatTemperature } = useSettings()
  const [currentMode, setCurrentMode] = useState(mode)

  const modes = [
    { id: 'cool', label: 'Cool', icon: '❄️', temperature: 16 },
    { id: 'warm', label: 'Warm', icon: '☀️', temperature: 25 },
    { id: 'auto', label: 'Auto', icon: '🔄', temperature: 22 }
  ]

  const adjustTemperature = (direction) => {
    if (!powerOn) return
    
    if (direction === 'up' && currentTemp < 30) {
      setCurrentTemp(currentTemp + 1)
    } else if (direction === 'down' && currentTemp > 16) {
      setCurrentTemp(currentTemp - 1)
    }
  }



  return (
    <div className="card p-6 h-full dark:bg-black dark:border-gray-800">
      <div className="flex items-center h-full gap-6">
        {/* Temperature Display Circle */}
        <div className="relative">
          <div className={`w-72 h-72 rounded-full border-8 flex items-center justify-center transition-all duration-300 ${
            powerOn 
              ? 'border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-black dark:to-gray-900' 
              : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black'
          }`}>
            <div className="text-center">
              <div className={`text-8xl font-bold transition-colors duration-300 ${
                powerOn ? 'text-teal-700 dark:text-teal-200' : 'text-gray-400 dark:text-gray-300'
              }`}>
                {formatTemperature(currentTemp)}
              </div>
              <div className={`text-sm font-medium tracking-widest transition-colors duration-300 ${
                powerOn ? 'text-teal-500 dark:text-teal-300' : 'text-gray-400 dark:text-gray-400'
              }`}>
                {settings.temperatureUnit === 'celsius' ? 'CELSIUS' : 'FAHRENHEIT'}
              </div>
            </div>
          </div>

          {/* Vertical Controls */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button
              onClick={() => adjustTemperature('up')}
              disabled={!powerOn}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                powerOn 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => adjustTemperature('down')}
              disabled={!powerOn}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                powerOn 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            onClick={togglePower}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
              powerOn 
                ? 'bg-teal-400 hover:bg-teal-500 shadow-xl ring-4 ring-teal-200' 
                : 'bg-teal-100 hover:bg-teal-200 ring-2 ring-teal-300'
            }`}
          >
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                powerOn ? 'text-white' : 'text-gray-600'
              }`}
            >
              ⚡
            </div>
          </button>

          <div className="flex justify-center gap-3">
            {modes.map((modeItem) => (
              <button
                key={modeItem.id}
                onClick={() => {
                  if (powerOn) {
                    setCurrentMode(modeItem.id)
                    setCurrentTemp(modeItem.temperature)
                  }
                }}
                disabled={!powerOn}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === modeItem.id
                    ? powerOn 
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : powerOn
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="mr-2">{modeItem.icon}</span>
                {modeItem.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm font-medium tracking-widest">
            <span className={powerOn ? 'text-teal-700' : 'text-gray-400'}>
              {powerOn ? 'SYSTEM ACTIVE' : 'SYSTEM STANDBY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemperatureCard




