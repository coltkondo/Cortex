import { useNavigate } from 'react-router-dom'
import { Briefcase, Plus } from 'lucide-react'
import PipelineBoard from '../components/pipeline/PipelineBoard'
import PremiumButton from '../components/common/PremiumButton'
import PageHeader from '../components/common/PageHeader'

/**
 * ApplicationsPage - Premium Kanban board
 * Track job applications through every stage
 */
function ApplicationsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PageHeader
        icon={Briefcase}
        title="Applications"
        description="Track your job applications through every stage of the process"
        actions={
          <PremiumButton
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/analysis/new')}
          >
            New Application
          </PremiumButton>
        }
      />

      {/* Pipeline Board */}
      <div className="container-premium py-12">
        <PipelineBoard />
      </div>
    </div>
  )
}

export default ApplicationsPage
