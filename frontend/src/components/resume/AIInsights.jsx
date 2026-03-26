import { useState, useEffect, useRef } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { resumeService } from '../../api/resumeService'
import { useStore } from '../../store/useStore'
import PremiumButton from '../common/PremiumButton'
import EmptyState from '../common/EmptyState'
import ResumeScoreCards from './insights/ResumeScoreCards'
import StrengthsWeaknessesCards from './insights/StrengthsWeaknessesCards'
import KeywordSuggestionsCard from './insights/KeywordSuggestionsCard'
import BulletImprovementsCard from './insights/BulletImprovementsCard'
import SkillsGapCard from './insights/SkillsGapCard'

/**
 * AIInsights - AI-powered resume analysis and improvements
 * Analysis is cached in store and persists across tab navigation
 * Only re-analyzes when user clicks "Regenerate Analysis" button
 */
function AIInsights() {
  const { resumeInsights, setResumeInsights } = useStore()
  const hasAttemptedLoad = useRef(false)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Only fetch on first mount if insights not in store and we haven't tried to load yet
    if (!resumeInsights && !hasAttemptedLoad.current) {
      hasAttemptedLoad.current = true
      analyzeResumeData()
    }
  }, []) // Empty dependency array - only runs on mount

  const analyzeResumeData = async (isRegenerate = false) => {
    if (isRegenerate) {
      setRegenerating(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const data = await resumeService.analyzeResume()
      setResumeInsights(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume')
    } finally {
      setLoading(false)
      setRegenerating(false)
    }
  }

  const handleRegenerate = () => {
    analyzeResumeData(true)
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

  if (loading && !resumeInsights) {
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

  if (error && !resumeInsights) {
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

  if (!resumeInsights) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Regenerate Button */}
      <div className="flex justify-end">
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-button hover:bg-primary-700 dark:hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-soft hover:shadow-card"
        >
          <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
          <span>{regenerating ? 'Regenerating...' : 'Regenerate Analysis'}</span>
        </button>
      </div>

      {/* Score Cards */}
      <ResumeScoreCards
        overallScore={resumeInsights.overallScore}
        atsScore={resumeInsights.atsScore}
        getScoreConfig={getScoreConfig}
      />

      {/* Strengths & Weaknesses */}
      <StrengthsWeaknessesCards
        strengths={resumeInsights.strengths}
        weaknesses={resumeInsights.weaknesses}
      />

      {/* Keyword Suggestions */}
      <KeywordSuggestionsCard
        keywords={resumeInsights.keywordSuggestions}
        copyToClipboard={copyToClipboard}
      />

      {/* Bullet Improvements */}
      <BulletImprovementsCard
        bulletImprovements={resumeInsights.bulletImprovements}
        copyToClipboard={copyToClipboard}
      />

      {/* Skills Gap */}
      <SkillsGapCard
        skillsGap={resumeInsights.skillsGap}
      />
    </div>
  )
}

export default AIInsights
