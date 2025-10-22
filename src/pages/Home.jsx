import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePower } from '../contexts/PowerContext'
import { useSettings } from '../contexts/SettingsContext'
import { useSchedule } from '../contexts/ScheduleContext'
import TemperatureCard from '../components/TemperatureCard'

const Home = () => {
  const { powerOn } = usePower()
  const { settings } = useSettings()
  const { schedules, deleteSchedule, loading, error, activeUsers, connectionStatus } = useSchedule()
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
              <div className="p-2 text-center rounded-lg bg-emerald-50 dark:bg-emerald-900 h-16 flex flex-col justify-center leading-tight">
                <div className="text-emerald-600 dark:text-emerald-300 text-xs">Energy Saving</div>
                <div className="text-slate-800 dark:text-white text-base font-semibold mt-0">+15%</div>
              </div>
              <div className="p-2 text-center rounded-lg bg-violet-50 dark:bg-violet-900 h-16 flex flex-col justify-center leading-tight">
                <div className="text-violet-600 dark:text-violet-300 text-xs">Active Users</div>
                <div className="text-slate-800 dark:text-white text-base font-semibold mt-0 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {activeUsers}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule Dashboard */}
          <div className="card p-4 dark:bg-black dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white tracking-widest">TODAY'S SCHEDULE</h2>
              <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live Updates
              </div>
            </div>
            
            {loading ? (
              <div className="text-slate-500 dark:text-gray-300 text-sm text-center py-4">Loading schedules...</div>
            ) : error ? (
              <div className="text-red-500 text-sm text-center py-4">Error: {error}</div>
            ) : schedules?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-500 dark:text-gray-300 text-sm mb-2">No schedules for today</div>
                <div className="text-xs text-slate-400 dark:text-gray-400">Create a schedule to get started!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  // Helper functions
                  const formatTime = (time24) => {
                    const [hours, minutes] = time24.split(':').map(Number)
                    const period = hours >= 12 ? 'PM' : 'AM'
                    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
                  }
                  
                  const isToday = (schedule) => {
                    if (!schedule.scheduleDate) return true
                    const scheduleDate = new Date(schedule.scheduleDate)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    scheduleDate.setHours(0, 0, 0, 0)
                    return scheduleDate.getTime() === today.getTime()
                  }
                  
                  const isCurrentlyActive = (schedule) => {
                    const now = new Date()
                    const currentTime = now.getHours() * 60 + now.getMinutes()
                    const startTime = schedule.startTime.split(':').map(Number)
                    const endTime = schedule.endTime.split(':').map(Number)
                    const startMinutes = startTime[0] * 60 + startTime[1]
                    const endMinutes = endTime[0] * 60 + endTime[1]
                    
                    return currentTime >= startMinutes && currentTime < endMinutes
                  }
                  
                  const isUpcoming = (schedule) => {
                    const now = new Date()
                    const currentTime = now.getHours() * 60 + now.getMinutes()
                    const startTime = schedule.startTime.split(':').map(Number)
                    const startMinutes = startTime[0] * 60 + startTime[1]
                    
                    return currentTime < startMinutes
                  }
                  
                  // Filter and sort today's schedules
                  const todaySchedules = schedules
                    .filter(isToday)
                    .sort((a, b) => {
                      const timeA = a.startTime.split(':').map(Number)
                      const timeB = b.startTime.split(':').map(Number)
                      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
                    })
                  
                  if (todaySchedules.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="text-slate-500 dark:text-gray-300 text-sm mb-2">No schedules for today</div>
                        <div className="text-xs text-slate-400 dark:text-gray-400">Create a schedule to get started!</div>
                      </div>
                    )
                  }
                  
                  return todaySchedules.map(schedule => {
                    const isActive = isCurrentlyActive(schedule)
                    const isUpcomingSchedule = isUpcoming(schedule)
                    
                    return (
                      <div key={schedule.id} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isActive 
                          ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-600 shadow-lg' 
                          : isUpcomingSchedule
                          ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                              isActive 
                                ? 'bg-green-500 animate-pulse' 
                                : isUpcomingSchedule
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}></div>
                            <div className="text-sm font-medium text-slate-600 dark:text-gray-300 uppercase tracking-wider">
                              {isActive ? 'ACTIVE NOW' : isUpcomingSchedule ? 'UPCOMING' : 'COMPLETED'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            disabled={!powerOn}
                            className={`p-1 rounded ${
                              powerOn 
                                ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            aria-label="Delete schedule"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-slate-600 dark:text-gray-300">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {schedule.comfortLevel}°C
                          </div>
                          {schedule.userName && (
                            <div className="text-slate-500 dark:text-gray-400">
                              by {schedule.userName}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>

          {/* Tomorrow's Schedules (if any) */}
          {schedules && schedules.filter(s => {
            if (!s.scheduleDate) return false
            const scheduleDate = new Date(s.scheduleDate)
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)
            scheduleDate.setHours(0, 0, 0, 0)
            return scheduleDate.getTime() === tomorrow.getTime()
          }).length > 0 && (
            <div className="card p-4 dark:bg-black dark:border-gray-800">
              <h3 className="text-md font-semibold text-slate-800 dark:text-white mb-3 tracking-widest">TOMORROW'S SCHEDULES</h3>
              <div className="space-y-2">
                {schedules
                  .filter(s => {
                    if (!s.scheduleDate) return false
                    const scheduleDate = new Date(s.scheduleDate)
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    tomorrow.setHours(0, 0, 0, 0)
                    scheduleDate.setHours(0, 0, 0, 0)
                    return scheduleDate.getTime() === tomorrow.getTime()
                  })
                  .sort((a, b) => {
                    const timeA = a.startTime.split(':').map(Number)
                    const timeB = b.startTime.split(':').map(Number)
                    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
                  })
                  .map(schedule => {
                    const formatTime = (time24) => {
                      const [hours, minutes] = time24.split(':').map(Number)
                      const period = hours >= 12 ? 'PM' : 'AM'
                      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
                      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
                    }
                    
                    return (
                      <div key={schedule.id} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-slate-800 dark:text-white">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-gray-300">
                              {schedule.comfortLevel}°C {schedule.userName && `• by ${schedule.userName}`}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            disabled={!powerOn}
                            className={`p-1 rounded ${
                              powerOn 
                                ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            aria-label="Delete schedule"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

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
