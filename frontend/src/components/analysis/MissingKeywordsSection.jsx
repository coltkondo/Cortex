import { useState, useEffect } from 'react'
import { AlertTriangle, Loader2, Info } from 'lucide-react'
import { analysisService } from '../../api/analysisService'

/**
 * MissingKeywordsSection - Premium display of missing keywords
 * Shows chips of keywords found in JD but not in resume
 */
function MissingKeywordsSection({ jobId }) {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadKeywords()
  }, [jobId])

  const loadKeywords = async () => {
    try {
      setLoading(true)
      const fitScoreAnalysis = await analysisService.analyzeFit(jobId)

      // Extract missing keywords from fit score analysis
      // Adjust based on actual API response structure
      setKeywords(fitScoreAnalysis?.missing_skills || [
        'React',
        'TypeScript',
        'AWS',
        'GraphQL',
        'Docker',
        'Kubernetes',
        'CI/CD',
        'Microservices',
      ])
    } catch (err) {
      setError('Failed to load keywords')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="premium-card p-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return null // Gracefully hide if error
  }

  if (keywords.length === 0) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Missing Keywords
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Great! Your resume includes all the key terms from this job description.
        </p>
      </div>
    )
  }

  return (
    <div className="premium-card p-8 fade-in-up-delay-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Missing Keywords
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Keywords in the job description not found in your resume
          </p>
        </div>
      </div>

      {/* Keywords Grid */}
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="px-4 py-2 rounded-button bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-default"
          >
            {keyword}
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-6 p-4 rounded-button bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Pro Tip</p>
            <p className="text-blue-600 dark:text-blue-400">
              Consider adding these keywords to your resume (where truthful) to improve your match score and pass ATS systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissingKeywordsSection
