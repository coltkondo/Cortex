import { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { resumeService } from '../../api/resumeService'
import PremiumButton from '../common/PremiumButton'
import EmptyState from '../common/EmptyState'
import ResumeScoreCards from './insights/ResumeScoreCards'
import StrengthsWeaknessesCards from './insights/StrengthsWeaknessesCards'
import KeywordSuggestionsCard from './insights/KeywordSuggestionsCard'
import BulletImprovementsCard from './insights/BulletImprovementsCard'
import SkillsGapCard from './insights/SkillsGapCard'

/**
 * AIInsights - AI-powered resume analysis and improvements
 * Displays scores, strengths, weaknesses, keywords, bullet improvements, skills gap
 */
function AIInsights() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    analyzeResumeData()
  }, [])

  const analyzeResumeData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await resumeService.analyzeResume()
      setAnalysis(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getScoreConfig = (score) => {
    if (score >= 80) return { color: 'emerald', label: 'Excellent', bgColor: 'bg-emerald-500' }
    if (score >= 70) return { color: 'blue', label: 'Good', bgColor: 'bg-blue-500' }
    if (score >= 60) return { color: 'amber', label: 'Needs Work', bgColor: 'bg-amber-500' }
    return { color: 'red', label: 'Poor', bgColor: 'bg-red-500' }
  }

  if (loading && !analysis) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Analyzing your resume...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            This may take a few moments
          </p>
        </div>
      </div>
    )
  }

  if (error && !analysis) {
    return (
      <div className="max-w-6xl mx-auto">
        <EmptyState
          icon={AlertTriangle}
          title="Analysis Failed"
          description={error}
          action={
            <PremiumButton variant="primary" onClick={analyzeResumeData}>
              Try Again
            </PremiumButton>
          }
        />
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Score Cards */}
      <ResumeScoreCards
        overallScore={analysis.overallScore}
        atsScore={analysis.atsScore}
        getScoreConfig={getScoreConfig}
      />

      {/* Strengths & Weaknesses */}
      <StrengthsWeaknessesCards
        strengths={analysis.strengths}
        weaknesses={analysis.weaknesses}
      />

      {/* Keyword Suggestions */}
      <KeywordSuggestionsCard
        keywords={analysis.keywordSuggestions}
        copyToClipboard={copyToClipboard}
      />

      {/* Bullet Improvements */}
      <BulletImprovementsCard
        bulletImprovements={analysis.bulletImprovements}
        copyToClipboard={copyToClipboard}
      />

      {/* Skills Gap */}
      <SkillsGapCard
        skillsGap={analysis.skillsGap}
      />

      {/* Regenerate Button */}
      <div className="flex justify-center">
        <PremiumButton
          variant="secondary"
          size="lg"
          icon={RefreshCw}
          onClick={analyzeResumeData}
          loading={loading}
        >
          Regenerate Analysis
        </PremiumButton>
      </div>
    </div>
  )
}

export default AIInsights
