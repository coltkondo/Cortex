import { useState } from 'react'
import { Lightbulb, Copy, CheckCircle } from 'lucide-react'

/**
 * KeywordSuggestionsCard - Displays ATS keyword recommendations with copy functionality
 */
function KeywordSuggestionsCard({ keywords, copyToClipboard }) {
  const [copiedKeywords, setCopiedKeywords] = useState({})

  const handleCopy = (keyword, idx) => {
    copyToClipboard(keyword, `keyword-${idx}`)
    setCopiedKeywords({ ...copiedKeywords, [idx]: true })
    setTimeout(() => {
      setCopiedKeywords({ ...copiedKeywords, [idx]: false })
    }, 2000)
  }

  return (
    <div className="premium-card p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        ATS Keyword Recommendations
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Add these keywords to improve your resume's visibility in Applicant Tracking Systems
      </p>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, idx) => (
          <button
            key={idx}
            onClick={() => handleCopy(keyword, idx)}
            className="group relative px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-2"
          >
            {keyword}
            {copiedKeywords[idx] ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
        Click to copy keywords to clipboard
      </p>
    </div>
  )
}

export default KeywordSuggestionsCard
