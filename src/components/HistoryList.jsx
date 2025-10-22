import { useEffect, useState } from 'react'

const HistoryList = () => {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [completed, setCompleted] = useState([])

  useEffect(() => {
    try {
      const schedules = JSON.parse(localStorage.getItem('schedules') || '[]')
      const now = new Date()
      const ph = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
      const [nowH, nowM] = ph.split(':').map(Number)
      const nowMinutes = nowH * 60 + nowM
      const toMinutes = (hhmm) => {
        if (!hhmm) return -1
        const [h, m] = hhmm.split(':').map(Number)
        return h * 60 + m
      }
      const classified = schedules.map(s => ({ ...s, startMin: toMinutes(s.startTime), endMin: toMinutes(s.endTime) }))
      const a = classified.filter(s => s.startMin <= nowMinutes && nowMinutes < s.endMin).sort((x,y) => x.startMin - y.startMin)
      const u = classified.filter(s => nowMinutes < s.startMin).sort((x,y) => x.startMin - y.startMin)
      const c = classified.filter(s => s.endMin <= nowMinutes).sort((x,y) => y.endMin - x.endMin)
      setActive(a)
      setUpcoming(u)
      setCompleted(c)
    } catch {
      setActive([]); setUpcoming([]); setCompleted([])
    }
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const buildList = () => {
    if (filter === 'active') return active.map(s => ({ ...s, status: 'active' }))
    if (filter === 'completed') return completed.map(s => ({ ...s, status: 'completed' }))
    // all: active, upcoming (status treated as active for display), then completed
    return [
      ...active.map(s => ({ ...s, status: 'active' })),
      ...upcoming.map(s => ({ ...s, status: 'active' })),
      ...completed.map(s => ({ ...s, status: 'completed' })),
    ]
  }

  const items = buildList()

  return (
    <div className="card p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-aircon-gray-800 tracking-widest mb-4 md:mb-0">
          TEMPERATURE HISTORY
        </h2>
        <div className="flex space-x-2">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === filterType
                  ? 'bg-aircon-blue-600 text-white'
                  : 'bg-aircon-gray-100 text-aircon-gray-700 hover:bg-aircon-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-aircon-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-aircon-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No history records found</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-aircon-gray-50 rounded-lg hover:bg-aircon-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-aircon-gray-800">
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.userName && (
                      <span className="text-sm text-aircon-gray-500">for {item.userName}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HistoryList




