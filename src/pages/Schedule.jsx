import ScheduleForm from '../components/ScheduleForm'

const Schedule = () => {
  return (
    <div className="w-full h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-hidden px-4">
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
        <div className="col-span-12 lg:col-span-7 row-span-6">
          <div className="card h-full p-6 overflow-auto">
            <div className="mb-4 text-left">
              <h1 className="text-2xl font-bold text-slate-800 tracking-widest">SCHEDULE SETTINGS</h1>
              <p className="text-slate-600">Create intelligent schedules for your system.</p>
            </div>
            <ScheduleForm />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 row-span-6">
          <div className="card h-full p-6 overflow-auto">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 tracking-widest">ACTIVE SCHEDULES</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Morning Routine</h3>
                    <p className="text-xs text-slate-600">Mon-Fri • 7:00 - 9:00 • 22°C</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-400 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Evening Comfort</h3>
                    <p className="text-xs text-slate-600">Daily • 18:00 - 23:00 • 24°C</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">DISABLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule




