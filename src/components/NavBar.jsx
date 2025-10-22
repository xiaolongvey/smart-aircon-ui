import { Link, useLocation } from 'react-router-dom'
import { usePower } from '../contexts/PowerContext'

const NavBar = () => {
  const location = useLocation()
  const { powerOn } = usePower()
  
  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/schedule', label: 'SCHEDULE' },
    { path: '/history', label: 'HISTORY' },
    { path: '/settings', label: 'SETTINGS' },
    { path: '/about', label: 'ABOUT' }
  ]

  return (
    <nav className="backdrop-blur-md bg-white/70 dark:bg-black/90 shadow-md border-b border-white/20 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center" />
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''} ${
                  !powerOn ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-aircon-gray-600 hover:text-aircon-blue-600 dark:text-white dark:hover:text-teal-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
          <div className="py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 text-sm nav-link ${location.pathname === item.path ? 'active' : ''} ${
                  !powerOn ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
