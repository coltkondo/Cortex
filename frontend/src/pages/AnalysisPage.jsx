import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PremiumButton from '../components/common/PremiumButton'
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
