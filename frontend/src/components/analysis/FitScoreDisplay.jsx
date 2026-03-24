import { useState, useEffect } from 'react'
import { Target, TrendingUp, AlertCircle, CheckCircle, XCircle, Award, Loader2, Info } from 'lucide-react'
import { analysisService } from '../../api/analysisService'
import ProgressRing from '../common/ProgressRing'
import Badge from '../common/Badge'
import { SCORE_THRESHOLDS, SCORE_LEVELS, SIZES, MESSAGES } from '../../config/constants'

function FitScoreDisplay({ jobId }) {
  const [fitScore, setFitScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get color and label based on score (HCD: Clear visual feedback)
  const getScoreLevel = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_LEVELS.excellent
    if (score >= SCORE_THRESHOLDS.GOOD) return SCORE_LEVELS.good
    if (score >= SCORE_THRESHOLDS.MODERATE) return SCORE_LEVELS.moderate
    return SCORE_LEVELS.poor
  }

  useEffect(() => {
    loadFitScore()
  }, [jobId])

  const loadFitScore = async () => {
    try {
      setLoading(true)
      const fitScoreAnalysis = await analysisService.analyzeFit(jobId)
      setFitScore(fitScoreAnalysis)
    } catch (err) {
      setError(MESSAGES.ERROR_LOAD_FIT_SCORE)
    } finally{
      setLoading(false)
    }
  }

  // Enhanced loading state with skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-3 py-12">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          <span className="text-gray-600">{MESSAGES.LOADING_ANALYZING}</span>
        </div>
      </div>
    )
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <XCircle className="h-6 w-6 text-red-600" />
          <h3 className="font-semibold text-red-900">Analysis Failed</h3>
        </div>
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadFitScore}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!fitScore) {
    return null
  }

  const scoreLevel = getScoreLevel(fitScore.overall_match)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Fit Score Analysis</h2>
          </div>
          <Badge variant={scoreLevel.badge}>
            <Award className="h-3 w-3" />
            {scoreLevel.label}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Score visualization with progress ring */}
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <ProgressRing
              value={fitScore.overall_match}
              size={SIZES.PROGRESS_RING_LARGE}
              strokeWidth={SIZES.PROGRESS_RING_STROKE_LARGE}
              color={scoreLevel.color}
            />
            <p className="text-gray-600 mt-4 font-medium">Overall Match Score</p>
            <p className="text-sm text-gray-500 mt-1">Based on skills, experience & requirements</p>
          </div>
        </div>

        {/* Analysis card */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-700 leading-relaxed">{fitScore.reasoning}</p>
            </div>
          </div>
        </div>

        {/* Two-column layout for strengths and gaps */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Strengths */}
          {fitScore.strengths && fitScore.strengths.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-green-900">Your Strengths</h3>
                <span className="text-sm text-green-700 font-medium">
                  {fitScore.strengths.length}
                </span>
              </div>
              <ul className="space-y-2">
                {fitScore.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skill Gaps */}
          {fitScore.skill_gaps && fitScore.skill_gaps.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-yellow-900">Skill Gaps</h3>
                <span className="text-sm text-yellow-700 font-medium">
                  {fitScore.skill_gaps.length}
                </span>
              </div>
              <ul className="space-y-2">
                {fitScore.skill_gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Experience alignment */}
        {fitScore.experience_alignment && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Experience Level</h3>
                <p className="text-sm text-gray-800">{fitScore.experience_alignment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Red flags if any */}
        {fitScore.red_flags && fitScore.red_flags.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <div className="flex items-start space-x-2">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Potential Concerns</h3>
                <ul className="space-y-1">
                  {fitScore.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-red-800">• {flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FitScoreDisplay
