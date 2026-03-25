import { useState } from 'react'
import { FileText, Loader2, Download, Copy, Check } from 'lucide-react'
import { analysisService } from '../../api/analysisService'
import PremiumButton from '../common/PremiumButton'

/**
 * CoverLetterSection - Premium cover letter generator
 * Generate, display, copy, and download cover letters
 */
function CoverLetterSection({ jobId }) {
  const [coverLetter, setCoverLetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const generateCoverLetter = async () => {
    try {
      setLoading(true)
      const response = await analysisService.generateCoverLetter(jobId)
      setCoverLetter(response)
    } catch (err) {
      setError('Failed to generate cover letter')
    } finally {
      setLoading(false)
    }
  }

  const copyCoverLetter = () => {
    if (coverLetter?.content) {
      navigator.clipboard.writeText(coverLetter.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadCoverLetter = () => {
    if (coverLetter?.content) {
      const blob = new Blob([coverLetter.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cover-letter.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (!coverLetter && !loading) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-3">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Cover Letter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Generate a professional cover letter for this position
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create a personalized cover letter that highlights your relevant experience
          </p>
          <PremiumButton
            variant="primary"
            icon={FileText}
            onClick={generateCoverLetter}
            size="lg"
          >
            Generate Cover Letter
          </PremiumButton>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-3">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crafting your cover letter...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-3">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <PremiumButton variant="secondary" onClick={generateCoverLetter}>
            Try Again
          </PremiumButton>
        </div>
      </div>
    )
  }

  return (
    <div className="premium-card p-8 fade-in-up-delay-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Cover Letter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Ready to customize and send
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyCoverLetter}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors focus-premium"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={downloadCoverLetter}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors focus-premium"
            title="Download as text"
          >
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <PremiumButton
            variant="ghost"
            size="sm"
            onClick={generateCoverLetter}
          >
            Regenerate
          </PremiumButton>
        </div>
      </div>

      {/* Cover Letter Content */}
      <div className="p-6 rounded-button border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-serif">
            {coverLetter.content}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
        Remember to review and personalize before sending
      </div>
    </div>
  )
}

export default CoverLetterSection
