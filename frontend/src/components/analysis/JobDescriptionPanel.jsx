import { useState, useEffect } from 'react'
import { FileText, Loader2, ExternalLink, AlertCircle } from 'lucide-react'
import { jobService } from '../../api/jobService'

/**
 * JobDescriptionPanel - Premium left panel displaying job description
 * Shows company, title, location, and full description
 */
function JobDescriptionPanel({ jobId }) {
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadJobData()
  }, [jobId])

  const loadJobData = async () => {
    try {
      setLoading(true)
      const data = await jobService.getJob(jobId)
      setJobData(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load job description')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="premium-card h-full flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading job description...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="premium-card h-full flex items-center justify-center p-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">Error Loading Job</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="premium-card p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {jobData.role}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
              {jobData.company}
            </p>
            {jobData.source && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Source: {jobData.source}
              </p>
            )}
            {jobData.source && jobData.source.startsWith('http') && (
              <a
                href={jobData.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                View Original Posting
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {jobData.description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDescriptionPanel
