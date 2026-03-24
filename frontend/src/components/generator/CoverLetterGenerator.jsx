import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import { analysisService } from '../../api/analysisService'
import { TIMING } from '../../config/constants'

function CoverLetterGenerator({ jobId }) {
  const [coverLetter, setCoverLetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState('professional')
  const [copied, setCopied] = useState(false)

  const generateCoverLetter = async () => {
    try {
      setLoading(true)
      const coverLetterResponse = await analysisService.generateCoverLetter(jobId, tone)
      setCoverLetter(coverLetterResponse.content)
    } catch (err) {
      console.error('Failed to generate cover letter:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK_DURATION)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cover Letter</h2>
        </div>
        <div className="flex items-center space-x-4">
          {!coverLetter && (
            <>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
              </select>
              <button
                onClick={generateCoverLetter}
                disabled={loading}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Cover Letter'}
              </button>
            </>
          )}
        </div>
      </div>

      {coverLetter && (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <div className="whitespace-pre-wrap text-gray-800">{coverLetter}</div>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default CoverLetterGenerator
