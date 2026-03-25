import { useNavigate } from 'react-router-dom'
import { Briefcase, Plus } from 'lucide-react'
import PipelineBoard from '../components/pipeline/PipelineBoard'
import PremiumButton from '../components/common/PremiumButton'

/**
 * PipelinePage (Applications) - Premium Kanban board
 * Track job applications through every stage
 */
function PipelinePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Premium Page Header */}
      <div className="bg-gradient-subtle border-b border-gray-200 dark:border-gray-800">
        <div className="container-premium py-12">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Applications
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Track your job applications through every stage of the process
                </p>
              </div>
            </div>
            <PremiumButton
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/analysis/new')}
              className="flex-shrink-0"
            >
              New Application
            </PremiumButton>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="container-premium py-12">
        <PipelineBoard />
      </div>
    </div>
  )
}

export default PipelinePage
