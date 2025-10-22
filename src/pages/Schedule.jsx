import { useSchedule } from '../contexts/ScheduleContext'
import ScheduleForm from '../components/ScheduleForm'

const Schedule = () => {
  const { schedules, loading, error } = useSchedule()

  return (
    <div className="w-full h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-hidden px-4">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
        <div className="col-span-12 lg:col-span-7 row-span-6">
          <div className="card h-full p-6 overflow-auto dark:bg-black dark:border-gray-800">
            <div className="mb-4 text-left">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-widest">SCHEDULE SETTINGS</h1>
              <p className="text-slate-600 dark:text-gray-300">Create intelligent schedules for your system.</p>
            </div>
            <ScheduleForm />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 row-span-6">
          <div className="card h-full p-6 overflow-auto dark:bg-black dark:border-gray-800">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 tracking-widest">SHARED SCHEDULES</h2>
            {loading ? (
              <div className="text-slate-500 dark:text-gray-300 text-sm">Loading schedules...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">Error: {error}</div>
            ) : schedules?.length === 0 ? (
              <div className="text-slate-500 dark:text-gray-300 text-sm">No schedules yet. Create one to get started!</div>
            ) : (
              <div className="space-y-3">
                {schedules.map(schedule => {
                  // Format date for display
                  const formatDate = (dateString) => {
                    if (!dateString) return 'Today'
                    const date = new Date(dateString)
                    const today = new Date()
                    const tomorrow = new Date()
                    tomorrow.setDate(today.getDate() + 1)
                    
                    if (date.toDateString() === today.toDateString()) {
                      return 'Today'
                    } else if (date.toDateString() === tomorrow.toDateString()) {
                      return 'Tomorrow'
                    } else {
                      return date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    }
                  }
                  
                  // Convert 24-hour time to 12-hour format with AM/PM
                  const formatTime = (time24) => {
                    const [hours, minutes] = time24.split(':').map(Number)
                    const period = hours >= 12 ? 'PM' : 'AM'
                    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
                  }
                  
                  // Determine if schedule is for today or tomorrow based on common sense
                  const getScheduleContext = (schedule) => {
                    const now = new Date()
                    const currentHour = now.getHours()
                    const scheduleHour = parseInt(schedule.startTime.split(':')[0])
                    
                    // If schedule date is explicitly set to tomorrow
                    if (schedule.scheduleDate) {
                      const scheduleDate = new Date(schedule.scheduleDate)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      scheduleDate.setHours(0, 0, 0, 0)
                      
                      if (scheduleDate.getTime() > today.getTime()) {
                        return 'Tomorrow'
                      }
                    }
                    
                    // Common sense logic: if it's late at night and schedule is early morning, it's probably tomorrow
                    if (currentHour >= 20 && scheduleHour <= 6) {
                      return 'Tomorrow'
                    }
                    
                    // If it's early morning and schedule is late night, it's probably today
                    if (currentHour <= 6 && scheduleHour >= 20) {
                      return 'Today'
                    }
                    
                    // If schedule hour is much earlier than current hour, it's probably tomorrow
                    if (scheduleHour < currentHour - 2) {
                      return 'Tomorrow'
                    }
                    
                    // Default to today
                    return 'Today'
                  }
                  
                  return (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-teal-50 dark:bg-gray-900 rounded-lg border border-teal-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              getScheduleContext(schedule) === 'Tomorrow' 
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                                : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            }`}>
                              {getScheduleContext(schedule)}
                            </span>
                          </h3>
                          <div className="text-xs text-slate-600 dark:text-gray-300 space-y-1">
                            <div className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(schedule.scheduleDate)}
                            </div>
                            {schedule.userName && (
                              <div className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                by {schedule.userName}
                              </div>
                            )}
                            {schedule.comfortLevel && (
                              <div className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {schedule.comfortLevel}°C
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        ACTIVE
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule




