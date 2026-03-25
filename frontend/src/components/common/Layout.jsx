import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, FileText, LineChart, BookOpen, Brain, Plus } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'
import PremiumButton from './PremiumButton'

/**
 * Layout - Premium navigation with 5 main sections
 * Sticky top navbar, glassmorphism, dark mode toggle, CTA button
 */
function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/applications', label: 'Applications', icon: Briefcase },
    { path: '/resume', label: 'Resume', icon: FileText },
    { path: '/insights', label: 'Insights', icon: LineChart },
    { path: '/resources', label: 'Resources', icon: BookOpen },
  ]

  const handleNewAnalysis = () => {
    // Navigate to home page
    navigate('/')

    // Wait for navigation to complete, then scroll to appropriate section
    setTimeout(() => {
      // Check if user has resume - this will be checked by HomePage component
      // For now, scroll to resume section (HomePage will handle the logic)
      const resumeSection = document.getElementById('resume-section')
      const jobSection = document.getElementById('job-section')

      // If job section exists (resume uploaded), scroll there, otherwise scroll to resume
      const targetSection = jobSection || resumeSection
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Premium Navigation */}
      <nav className="glass-premium sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container-premium">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus-premium rounded-button px-2 -mx-2"
            >
              <div className="relative">
                <Brain className="w-8 h-8 text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-soft" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cortex
              </span>
            </Link>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-button
                      text-sm font-medium transition-all duration-200
                      focus-premium
                      ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 shadow-soft'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Side - Dark Mode + CTA */}
            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <PremiumButton
                variant="primary"
                size="md"
                icon={Plus}
                onClick={handleNewAnalysis}
                className="hidden md:flex"
              >
                New Analysis
              </PremiumButton>
              {/* Mobile CTA */}
              <PremiumButton
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleNewAnalysis}
                className="flex md:hidden"
              >
                New
              </PremiumButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 mt-auto">
        <div className="container-premium py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Cortex</span>
              </div>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span>Your Career Second Brain</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Powered by AI</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
