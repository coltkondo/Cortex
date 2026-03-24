import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import { analysisService } from '../../api/analysisService'
import { TIMING } from '../../config/constants'

function BulletSuggestions({ jobId }) {
  const [bullets, setBullets] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const generateBullets = async () => {
    try {
      setLoading(true)
      const bulletResponse = await analysisService.generateBullets(jobId)
      setBullets(bulletResponse.suggestions)
    } catch (err) {
      console.error('Failed to generate bullets:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), TIMING.COPY_FEEDBACK_DURATION)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tailored Bullet Suggestions</h2>
        </div>
        {!bullets && (
          <button
            onClick={generateBullets}
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Bullets'}
          </button>
        )}
      </div>

      {bullets && (
        <div className="space-y-4">
          {bullets.map((bullet, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <p className="text-gray-800 flex-1">{bullet}</p>
                <button
                  onClick={() => copyToClipboard(bullet, idx)}
                  className="ml-4 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BulletSuggestions
