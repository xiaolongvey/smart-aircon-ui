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
                {schedules.map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-teal-50 dark:bg-gray-900 rounded-lg border border-teal-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">{schedule.startTime} - {schedule.endTime}</h3>
                        <p className="text-xs text-slate-600 dark:text-gray-300">
                          {schedule.userName && `by ${schedule.userName} • `}
                          {schedule.comfortLevel && `${schedule.comfortLevel}°C`}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule




