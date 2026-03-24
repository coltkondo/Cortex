import { Link, useLocation } from 'react-router-dom'
import { Home, Kanban, Brain, Github, ExternalLink } from 'lucide-react'
import Badge from './Badge'

function Layout({ children }) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/pipeline', label: 'Pipeline', icon: Kanban },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Enhanced Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Brain className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                    Cortex
                  </span>
                  <Badge variant="primary" size="sm" className="ml-2">AI</Badge>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-1">
                {navItems.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side - Status indicator */}
            <div className="flex items-center space-x-4">
              <Badge variant="success" size="sm">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-primary-600" />
                <span className="font-semibold">Cortex</span>
              </div>
              <span className="text-gray-400">|</span>
              <span>Your Career Second Brain</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Powered by <span className="font-semibold text-primary-600">Gemini AI</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
