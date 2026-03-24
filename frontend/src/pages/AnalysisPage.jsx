import { useParams } from 'react-router-dom'
import FitScoreDisplay from '../components/analysis/FitScoreDisplay'
import BulletSuggestions from '../components/generator/BulletSuggestions'
import CoverLetterGenerator from '../components/generator/CoverLetterGenerator'
import InterviewPrepGenerator from '../components/generator/InterviewPrepGenerator'

function AnalysisPage() {
  const { jobId } = useParams()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Job Analysis & Content Generation
      </h1>

      <div className="space-y-8">
        <FitScoreDisplay jobId={jobId} />
        <BulletSuggestions jobId={jobId} />
        <CoverLetterGenerator jobId={jobId} />
        <InterviewPrepGenerator jobId={jobId} />
      </div>
    </div>
  )
}

export default AnalysisPage
