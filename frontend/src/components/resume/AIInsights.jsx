import { useState, useEffect } from 'react'
import { RefreshCw, Copy, CheckCircle, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react'
import { resumeService } from '../../api/resumeService'
import PremiumButton from '../common/PremiumButton'
import ProgressRing from '../common/ProgressRing'
import EmptyState from '../common/EmptyState'

/**
 * AIInsights - AI-powered resume analysis and improvements
 * Displays scores, strengths, weaknesses, keywords, bullet improvements, skills gap
 */
function AIInsights() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedItems, setCopiedItems] = useState({})

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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedItems({ ...copiedItems, [id]: true })
    setTimeout(() => {
      setCopiedItems({ ...copiedItems, [id]: false })
    }, 2000)
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
          action={{
            label: 'Try Again',
            onClick: analyzeResumeData,
          }}
        />
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const overallConfig = getScoreConfig(analysis.overallScore)
  const atsConfig = getScoreConfig(analysis.atsScore)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Score Cards (side by side) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overall Score */}
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Overall Resume Score
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={analysis.overallScore}
              size="large"
              strokeWidth={12}
              className="mb-4"
            />
            <div className={`
              px-4 py-2 rounded-full text-sm font-semibold
              bg-${overallConfig.color}-100 dark:bg-${overallConfig.color}-900/30
              text-${overallConfig.color}-700 dark:text-${overallConfig.color}-300
            `}>
              {overallConfig.label}
            </div>
          </div>
        </div>

        {/* ATS Score */}
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            ATS Compatibility Score
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={analysis.atsScore}
              size="large"
              strokeWidth={12}
              className="mb-4"
            />
            <div className={`
              px-4 py-2 rounded-full text-sm font-semibold
              bg-${atsConfig.color}-100 dark:bg-${atsConfig.color}-900/30
              text-${atsConfig.color}-700 dark:text-${atsConfig.color}-300
            `}>
              {atsConfig.label}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{strength}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Areas to Improve
          </h3>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{weakness}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keyword Suggestions */}
      <div className="premium-card p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          ATS Keyword Recommendations
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Add these keywords to improve your chances with Applicant Tracking Systems
        </p>
        <div className="flex flex-wrap gap-2">
          {analysis.keywordSuggestions.map((keyword, idx) => (
            <button
              key={idx}
              onClick={() => copyToClipboard(keyword, `keyword-${idx}`)}
              className="
                px-4 py-2 rounded-button
                bg-primary-50 dark:bg-primary-900/30
                border border-primary-200 dark:border-primary-800
                text-primary-700 dark:text-primary-300
                hover:bg-primary-100 dark:hover:bg-primary-900/50
                transition-all premium-hover
                text-sm font-medium
                flex items-center gap-2
              "
            >
              {keyword}
              {copiedItems[`keyword-${idx}`] ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bullet Improvements */}
      <div className="premium-card p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Bullet Point Improvements
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Here are some of your bullet points rewritten for maximum impact
        </p>
        <div className="space-y-6">
          {analysis.bulletImprovements.map((improvement, idx) => (
            <div
              key={idx}
              className="
                p-6 rounded-button
                bg-gray-50 dark:bg-gray-900/50
                border border-gray-200 dark:border-gray-800
              "
            >
              {/* Before */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                    Current
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {improvement.original}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                <ArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              </div>

              {/* After */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Improved
                  </span>
                  <button
                    onClick={() => copyToClipboard(improvement.improved, `bullet-${idx}`)}
                    className="
                      ml-auto text-primary-600 dark:text-primary-400
                      hover:text-primary-700 dark:hover:text-primary-300
                      transition-colors
                    "
                  >
                    {copiedItems[`bullet-${idx}`] ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                  {improvement.improved}
                </p>
              </div>

              {/* Reason */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Why this is better:</strong> {improvement.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Gap */}
      <div className="premium-card p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Skills Gap Analysis
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Based on your industry and role, here are skills to consider adding
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Missing Skills */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              High-Demand Skills (Missing)
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsGap.missing.map((skill, idx) => (
                <span
                  key={idx}
                  className="
                    px-3 py-1.5 rounded-button
                    bg-red-50 dark:bg-red-900/20
                    border border-red-200 dark:border-red-800
                    text-red-700 dark:text-red-300
                    text-sm
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Trending Skills */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Trending Skills (Emerging)
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsGap.trending.map((skill, idx) => (
                <span
                  key={idx}
                  className="
                    px-3 py-1.5 rounded-button
                    bg-blue-50 dark:bg-blue-900/20
                    border border-blue-200 dark:border-blue-800
                    text-blue-700 dark:text-blue-300
                    text-sm
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

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
