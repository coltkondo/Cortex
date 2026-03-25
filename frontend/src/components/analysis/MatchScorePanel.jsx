import { useState, useEffect } from 'react'
import { Target, TrendingUp, Loader2, AlertCircle } from 'lucide-react'
import { analysisService } from '../../api/analysisService'
import Badge from '../common/Badge'

/**
 * MatchScorePanel - Premium match score display with circular progress
 * Shows percentage match and score category
 */
function MatchScorePanel({ jobId }) {
  const [fitScore, setFitScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFitScore()
  }, [jobId])

  const loadFitScore = async () => {
    try {
      setLoading(true)
      const fitScoreAnalysis = await analysisService.analyzeFit(jobId)
      setFitScore(fitScoreAnalysis)
    } catch (err) {
      setError('Failed to analyze job fit')
    } finally {
      setLoading(false)
    }
  }

  const getScoreConfig = (score) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'emerald', bgColor: 'bg-emerald-500' }
    if (score >= 70) return { label: 'Good Match', color: 'blue', bgColor: 'bg-blue-500' }
    if (score >= 60) return { label: 'Moderate Match', color: 'amber', bgColor: 'bg-amber-500' }
    return { label: 'Low Match', color: 'red', bgColor: 'bg-red-500' }
  }

  if (loading) {
    return (
      <div className="premium-card p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="premium-card p-8">
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const score = fitScore?.overall_match_percentage || 0
  const config = getScoreConfig(score)

  return (
    <div className="premium-card p-8 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Match Score
          </h3>
        </div>
        <Badge variant={config.color}>{config.label}</Badge>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          {/* Background Circle */}
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-800"
            />
            {/* Progress Circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - score / 100)}`}
              className={`${config.bgColor} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {score}%
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {fitScore?.breakdown && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Breakdown
          </h4>
          {Object.entries(fitScore.breakdown).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchScorePanel
