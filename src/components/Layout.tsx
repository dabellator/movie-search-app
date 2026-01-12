import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  headerActions?: ReactNode
}

const Layout = ({ children, headerActions }: LayoutProps) => (
  <div className="min-h-screen bg-gray-900 text-white">
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
          Movie Search App
        </Link>
        {headerActions && (
          <div className="flex items-center gap-4">
            {headerActions}
          </div>
        )}
      </div>
    </nav>
    {children}
  </div>
)

export default Layout
