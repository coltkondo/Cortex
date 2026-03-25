import { X } from 'lucide-react'
import { useEffect } from 'react'

/**
 * Modal - Reusable modal component with backdrop
 * Premium styling, dark mode support, ESC key to close
 */
function Modal({ children, onClose, size = 'md' }) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 dark:bg-gray-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-white dark:bg-gray-900
          rounded-card shadow-card
          border border-gray-200 dark:border-gray-800
          max-h-[90vh] overflow-y-auto
          animate-fade-slide-up
        `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            w-8 h-8 rounded-lg
            flex items-center justify-center
            text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors
          "
          title="Close (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}

export default Modal
