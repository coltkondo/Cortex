import { Construction, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PremiumButton from '../components/common/PremiumButton'

/**
 * PlaceholderPage - Premium "Coming Soon" page
 * Used for Resume, Insights, Resources pages
 */
function PlaceholderPage({ title = 'Feature' }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 inline-flex">
          <div className="w-24 h-24 rounded-card bg-gradient-subtle flex items-center justify-center">
            <Construction className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title} Coming Soon
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
          We're working hard to bring you this feature. Check back soon for updates, or explore other parts of Cortex in the meantime.
        </p>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <PremiumButton
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </PremiumButton>
          <PremiumButton
            variant="ghost"
            onClick={() => navigate('/applications')}
          >
            View Applications
          </PremiumButton>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Want to be notified when {title.toLowerCase()} launches?
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
            Stay tuned for updates
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage
