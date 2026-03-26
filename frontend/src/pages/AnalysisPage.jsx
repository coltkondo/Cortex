import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import PremiumButton from '../components/common/PremiumButton'
import { applicationService } from '../api/applicationService'
import { useStore } from '../store/useStore'
import JobDescriptionPanel from '../components/analysis/JobDescriptionPanel'
import MatchScorePanel from '../components/analysis/MatchScorePanel'
import MissingKeywordsSection from '../components/analysis/MissingKeywordsSection'
import BulletSuggestionsSection from '../components/analysis/BulletSuggestionsSection'
import CoverLetterSection from '../components/analysis/CoverLetterSection'

/**
 * AnalysisPage - Premium two-column job analysis layout
 * Left: Job Description | Right: AI Analysis (Match Score, Keywords, Bullets, Cover Letter)
 */
function AnalysisPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { applications, addApplication } = useStore()
  const [addingToPipeline, setAddingToPipeline] = useState(false)
  const [isInPipeline, setIsInPipeline] = useState(false)

  useEffect(() => {
    // Check if this job is already in the pipeline
    const existingApp = applications.find((app) => app.jobId === parseInt(jobId))
    setIsInPipeline(!!existingApp)
  }, [applications, jobId])

  const handleAddToPipeline = async () => {
    if (isInPipeline) {
      // Navigate to applications page
      navigate('/applications')
      return
    }

    setAddingToPipeline(true)
    try {
      const newApplication = await applicationService.createApplication({
        jobId: parseInt(jobId),
        stage: 'saved',
      })

      addApplication(newApplication)
      setIsInPipeline(true)

      // Show success and navigate
      setTimeout(() => {
        navigate('/applications')
      }, 500)
    } catch (error) {
      console.error('Failed to add to pipeline:', error)
      alert('Failed to add to pipeline. Please try again.')
    } finally {
      setAddingToPipeline(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Premium Page Header */}
      <div className="bg-gradient-subtle border-b border-gray-200 dark:border-gray-800">
        <div className="container-premium py-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Job Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered insights for this position
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PremiumButton
                variant={isInPipeline ? 'secondary' : 'primary'}
                icon={Plus}
                onClick={handleAddToPipeline}
                loading={addingToPipeline}
                disabled={addingToPipeline}
              >
                {isInPipeline ? 'View in Pipeline' : 'Add to Pipeline'}
              </PremiumButton>
              <PremiumButton
                variant="ghost"
                icon={ArrowLeft}
                onClick={() => navigate('/')}
              >
                Back
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="container-premium py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Job Description (40%) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <JobDescriptionPanel jobId={jobId} />
            </div>
          </div>

          {/* Right Column - AI Analysis (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Match Score */}
            <MatchScorePanel jobId={jobId} />

            {/* Missing Keywords */}
            <MissingKeywordsSection jobId={jobId} />

            {/* Bullet Suggestions */}
            <BulletSuggestionsSection jobId={jobId} />

            {/* Cover Letter */}
            <CoverLetterSection jobId={jobId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage
