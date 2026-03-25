import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * DarkModeToggle - Premium dark mode switch
 * Smooth rotation animation, integrates with ThemeContext
 */
function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-button flex items-center justify-center
                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                 hover:border-primary-300 dark:hover:border-primary-600
                 transition-all duration-200 ease-out
                 shadow-soft hover:shadow-card
                 focus-premium"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
            isDark
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-5 h-5 text-indigo-500 transition-all duration-300 ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  )
}

export default DarkModeToggle
