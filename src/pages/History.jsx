import { usePower } from '../contexts/PowerContext'
import HistoryList from '../components/HistoryList'

const History = () => {
  const { powerOn } = usePower()
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-aircon-gray-800 tracking-widest mb-4">
          TEMPERATURE HISTORY
        </h1>
        <p className="text-aircon-gray-600 max-w-2xl mx-auto">
          Track your air conditioning usage patterns and temperature history. 
          Monitor energy consumption and optimize your comfort settings.
        </p>
        {!powerOn && (
          <div className="mt-4 p-3 rounded-lg text-sm bg-gray-50 text-gray-500 text-center max-w-md mx-auto">
            System is in standby mode. Turn on the system to view history.
          </div>
        )}
      </div>

      {/* History List Component */}
      <div className={!powerOn ? 'opacity-50 pointer-events-none' : ''}>
        <HistoryList />
      </div>

      {/* Export Options */}
      <div className={`card p-6 max-w-2xl mx-auto ${!powerOn ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-xl font-semibold text-aircon-gray-800 mb-4 tracking-widest">
          EXPORT DATA
        </h2>
        <p className="text-aircon-gray-600 mb-6">
          Download your temperature history and usage data for analysis or record keeping.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            className={`btn-secondary ${!powerOn ? 'cursor-not-allowed' : ''}`}
            disabled={!powerOn}
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as CSV
          </button>
          <button 
            className={`btn-secondary ${!powerOn ? 'cursor-not-allowed' : ''}`}
            disabled={!powerOn}
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default History




