import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PowerProvider } from './contexts/PowerContext'
import { SettingsProvider } from './contexts/SettingsContext'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import History from './pages/History'
import Settings from './pages/Settings'
import About from './pages/About'

function App() {
  return (
    <SettingsProvider>
      <PowerProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-aircon-blue-50 to-aircon-blue-100 dark:bg-black dark:text-white transition-colors duration-300">
            <NavBar />
            <main className="container mx-auto px-4 py-8 dark:bg-black">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PowerProvider>
    </SettingsProvider>
  )
}

export default App




