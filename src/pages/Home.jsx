import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePower } from '../contexts/PowerContext'
import { useSettings } from '../contexts/SettingsContext'
import { useSchedule } from '../contexts/ScheduleContext'
import TemperatureCard from '../components/TemperatureCard'

const Home = () => {
  const { powerOn } = usePower()
  const { settings } = useSettings()
  const { schedules, deleteSchedule, loading, error } = useSchedule()
  const [phNow, setPhNow] = useState(new Date())

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id)
    } catch (err) {
      console.error('Failed to delete schedule', err)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => setPhNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatPhDateTime = (date) => {
    try {
      return new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).format(date)
    } catch {
      return date.toLocaleString()
    }
  }

  const getNextSevenAmPH = () => {
    const now = new Date()
    const phString = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(now) // "YYYY-MM-DD, HH:MM"
    const [ymd, hm] = phString.split(', ')
    const [year, month, day] = ymd.split('-').map(Number)
    const [hour, minute] = hm.split(':').map(Number)
    const isPastSeven = hour > 7 || (hour === 7 && minute >= 0)
    const target = new Date(Date.UTC(year, month - 1, day, 23, 0)) // temp baseline
    // Recompute in Manila TZ by constructing a date string
    const targetLocal = new Date(`${ymd}T07:00:00+08:00`)
    if (isPastSeven) {
      const nextDayLocal = new Date(targetLocal.getTime() + 24 * 60 * 60 * 1000)
      return nextDayLocal
    }
    return targetLocal
  }

  return (
    <div className="w-full h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-hidden px-4">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
        {/* Left: System Active Panel (Landscape) */}
        <div className="col-span-12 lg:col-span-7 row-span-6">
          <div className="card h-full p-6 flex flex-col">
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-slate-800 tracking-widest">chEElax DASHBOARD</h1>
              <div className="text-teal-700 text-sm font-medium mt-1">{formatPhDateTime(phNow)}</div>
            </div>
            <div className="flex-1">
              <TemperatureCard />
            </div>
          </div>
        </div>

        {/* Right: Stats and Actions stacked to fit without scroll */}
        <div className="col-span-12 lg:col-span-5 row-span-6 flex flex-col gap-0">
          <div className="card p-3">
            <div className="grid grid-cols-2 gap-0 items-center">
              <div className="p-2 text-center rounded-lg bg-emerald-50 h-16 flex flex-col justify-center leading-tight">
                <div className="text-emerald-600 text-xs">Energy Saving</div>
                <div className="text-slate-800 text-base font-semibold mt-0">+15%</div>
              </div>
              <div className="p-2 text-center rounded-lg bg-violet-50 h-16 flex flex-col justify-center leading-tight">
                <div className="text-violet-600 text-xs">System Status</div>
                <div className="text-slate-800 text-base font-semibold mt-0">Operational</div>
              </div>
            </div>
          </div>

          {/* All Schedules Grid */}
          <div className="card p-4 dark:bg-black dark:border-gray-800">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 tracking-widest">Shared Schedules</h2>
            {loading ? (
              <div className="text-slate-500 dark:text-gray-300 text-sm">Loading schedules...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">Error: {error}</div>
            ) : schedules?.length === 0 ? (
              <div className="text-slate-500 dark:text-gray-300 text-sm">No schedules yet. Create one to get started!</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {schedules.map(s => (
                  <div key={s.id} className="p-3 rounded-lg bg-teal-50 dark:bg-gray-900 relative">
                    <div className="text-teal-600 dark:text-teal-300 text-xs uppercase tracking-widest">Schedule</div>
                    <div className="text-slate-800 dark:text-white text-lg font-semibold mt-1">{s.startTime} - {s.endTime}</div>
                    {s.userName && (
                      <div className="text-slate-600 dark:text-gray-300 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        by {s.userName}
                      </div>
                    )}
                    {s.comfortLevel && (
                      <div className="text-teal-700 dark:text-teal-300 text-sm font-medium mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {s.comfortLevel}°C Comfort Level
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteSchedule(s.id)}
                      disabled={!powerOn}
                      className={`absolute bottom-2 right-2 ${
                        powerOn 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="Delete schedule"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4 mt-0">
            <h2 className="text-lg font-semibold text-slate-800 mb-3 tracking-widest text-center">QUICK ACTIONS</h2>
            <div className="grid grid-cols-2 gap-3 items-stretch">
              <Link 
                to="/schedule" 
                className={`text-center font-medium px-4 py-3 rounded-lg transition-colors ${
                  powerOn 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                }`}
              >
                + New Schedule
              </Link>
              <Link 
                to="/history" 
                className={`text-center font-medium px-4 py-3 rounded-lg transition-colors ${
                  powerOn 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
