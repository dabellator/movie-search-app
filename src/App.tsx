import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import StatusPage from './components/StatusPage'
import SearchPage from './pages/SearchPage'
import MovieDetailsPage from './pages/MovieDetailsPage'

function Navigation() {
  const location = useLocation()
  const isStatusPage = location.pathname === '/status'
  const isMovieDetails = location.pathname.startsWith('/movie/')

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
          Movie Search App
        </Link>
        {!isStatusPage && !isMovieDetails && (
          <Link
            to="/status"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>System Status</span>
          </Link>
        )}
        {isStatusPage && (
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
            ← Back to Search
          </Link>
        )}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
