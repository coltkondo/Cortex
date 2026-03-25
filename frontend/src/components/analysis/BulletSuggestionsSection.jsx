import { useState, useEffect } from 'react'
import { Sparkles, Loader2, Copy, Check } from 'lucide-react'
import { analysisService } from '../../api/analysisService'
import PremiumButton from '../common/PremiumButton'

/**
 * BulletSuggestionsSection - Premium display of suggested resume bullets
 * Shows AI-generated bullet points with copy functionality
 */
function BulletSuggestionsSection({ jobId }) {
  const [bullets, setBullets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [generated, setGenerated] = useState(false)

  const loadBullets = async () => {
    try {
      setLoading(true)
      const bulletResponse = await analysisService.generateBullets(jobId)
      setBullets(bulletResponse?.suggestions || [])
      setGenerated(true)
    } catch (err) {
      setError('Failed to generate bullet suggestions')
    } finally {
      setLoading(false)
    }
  }

  const copyBullet = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (!generated && !loading) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Resume Bullet Improvements
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Get AI-powered suggestions tailored to this job
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click below to generate custom resume bullets aligned with this job description
          </p>
          <PremiumButton
            variant="primary"
            icon={Sparkles}
            onClick={loadBullets}
          >
            Generate Suggestions
          </PremiumButton>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-2">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generating tailored bullet points...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="premium-card p-8 fade-in-up-delay-2">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <PremiumButton variant="secondary" onClick={loadBullets}>
            Try Again
          </PremiumButton>
        </div>
      </div>
    )
  }

  return (
    <div className="premium-card p-8 fade-in-up-delay-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Suggested Resume Bullets
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {bullets.length} tailored suggestions
            </p>
          </div>
        </div>
        <PremiumButton
          variant="ghost"
          size="sm"
          icon={Sparkles}
          onClick={loadBullets}
        >
          Regenerate
        </PremiumButton>
      </div>

      {/* Bullets List */}
      <div className="space-y-4">
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="group p-4 rounded-button border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-soft bg-white dark:bg-gray-900"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-semibold mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {bullet.text || bullet}
                </p>
                {bullet.reason && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                    Why: {bullet.reason}
                  </p>
                )}
              </div>
              <button
                onClick={() => copyBullet(bullet.text || bullet, index)}
                className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all focus-premium"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BulletSuggestionsSection
