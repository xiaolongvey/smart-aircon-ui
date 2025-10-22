import { usePower } from '../contexts/PowerContext'
import { useSettings } from '../contexts/SettingsContext'
import ToggleSwitch from '../components/ToggleSwitch'

const Settings = () => {
  const { powerOn } = usePower()
  const { settings, updateSetting } = useSettings()


  return (
    <div className="w-full h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-hidden px-4">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
        <div className="col-span-12 lg:col-span-7 row-span-6">
          <div className="card h-full p-6 overflow-auto">
            <div className="mb-4 text-left">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-widest">SYSTEM SETTINGS</h1>
              <p className="text-slate-600 dark:text-gray-300">Customize your experience and preferences.</p>
              {!powerOn && (
                <div className="mt-2 p-3 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                  System is in standby mode. Turn on the system to modify settings.
                </div>
              )}
            </div>
            {/* Settings Sections (Display settings always enabled; others disabled when off) */}
            <div className={`space-y-6`}>
        
        {/* Display Settings */}
        <div className="card p-6 dark:bg-black dark:border-gray-800">
          <h2 className="text-xl font-semibold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
            DISPLAY SETTINGS
          </h2>
          
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.darkMode}
              onChange={(checked) => updateSetting('darkMode', checked)}
              label="Dark Mode"
              description="Switch to dark theme for better viewing in low light"
            />
            
            <div className="py-4">
              <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
                Temperature Unit
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateSetting('temperatureUnit', 'celsius')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    settings.temperatureUnit === 'celsius'
                      ? 'bg-aircon-blue-600 text-white'
                      : 'bg-aircon-gray-100 dark:bg-gray-700 text-aircon-gray-700 dark:text-white hover:bg-aircon-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => updateSetting('temperatureUnit', 'fahrenheit')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    settings.temperatureUnit === 'fahrenheit'
                      ? 'bg-aircon-blue-600 text-white'
                      : 'bg-aircon-gray-100 dark:bg-gray-700 text-aircon-gray-700 dark:text-white hover:bg-aircon-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Settings */}
        <div className={`card p-6 dark:bg-black dark:border-gray-800 ${!powerOn ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-xl font-semibold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
            ENERGY SETTINGS
          </h2>
          
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.energySaver}
              onChange={(checked) => updateSetting('energySaver', checked)}
              label="Energy Saver Mode"
              description="Optimize settings for maximum energy efficiency"
            />
            
            <ToggleSwitch
              checked={settings.autoUpdate}
              onChange={(checked) => updateSetting('autoUpdate', checked)}
              label="Auto Update"
              description="Automatically update system software when available"
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`card p-6 dark:bg-black dark:border-gray-800 ${!powerOn ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-xl font-semibold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
            NOTIFICATION SETTINGS
          </h2>
          
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.notifications}
              onChange={(checked) => updateSetting('notifications', checked)}
              label="Push Notifications"
              description="Receive alerts for schedule changes and system updates"
            />
            
            <ToggleSwitch
              checked={settings.soundEffects}
              onChange={(checked) => updateSetting('soundEffects', checked)}
              label="Sound Effects"
              description="Play sounds for button presses and system alerts"
            />
            
            <ToggleSwitch
              checked={settings.vibration}
              onChange={(checked) => updateSetting('vibration', checked)}
              label="Vibration"
              description="Vibrate device for notifications (mobile only)"
            />
          </div>
        </div>

        {/* Language Settings */}
        <div className={`card p-6 dark:bg-black dark:border-gray-800 ${!powerOn ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-xl font-semibold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
            LANGUAGE SETTINGS
          </h2>
          
          <div className="py-4">
            <label className="block text-sm font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">
              Interface Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-aircon-blue-500 focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="spanish">Español</option>
              <option value="french">Français</option>
              <option value="german">Deutsch</option>
              <option value="chinese">中文</option>
              <option value="japanese">日本語</option>
            </select>
          </div>
        </div>

        {/* System Info */}
        <div className="card p-6 dark:bg-black dark:border-gray-800">
          <h2 className="text-xl font-semibold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
            SYSTEM INFORMATION
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">App Version</h3>
              <p className="text-aircon-gray-600 dark:text-gray-300">App V1.1.0</p>
            </div>
            <div>
              <h3 className="font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">Last Updated</h3>
              <p className="text-aircon-gray-600 dark:text-gray-300">January 15, 2024</p>
            </div>
            <div>
              <h3 className="font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">Device ID</h3>
              <p className="text-aircon-gray-600 dark:text-gray-300 font-mono text-sm">Room 402.2025</p>
            </div>
            <div>
              <h3 className="font-medium text-aircon-gray-700 dark:text-gray-200 mb-2">Firmware</h3>
              <p className="text-aircon-gray-600 dark:text-gray-300">Firmware v1.1.0</p>
            </div>
          </div>
        </div>

            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 row-span-6">
          <div className="card h-full p-6 overflow-auto dark:bg-black dark:border-gray-800">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 tracking-widest">SYSTEM INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-200 mb-2">App Version</h3>
                <p className="text-slate-600 dark:text-gray-300">App V1.1.0</p>
              </div>
              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-200 mb-2">Last Updated</h3>
                <p className="text-slate-600 dark:text-gray-300">January 15, 2024</p>
              </div>
              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-200 mb-2">Device ID</h3>
                <p className="text-slate-600 dark:text-gray-300 font-mono text-sm">Room 402.2025</p>
              </div>
              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-200 mb-2">Firmware</h3>
                <p className="text-slate-600 dark:text-gray-300">Firmware v1.1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings




