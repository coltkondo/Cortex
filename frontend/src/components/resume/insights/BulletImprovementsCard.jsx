import { useState } from 'react'
import { TrendingUp, ArrowRight, Copy, CheckCircle } from 'lucide-react'

/**
 * BulletImprovementsCard - Displays before/after bullet point improvements
 */
function BulletImprovementsCard({ bulletImprovements, copyToClipboard }) {
  const [copiedBullets, setCopiedBullets] = useState({})

  const handleCopy = (text, idx) => {
    copyToClipboard(text, `bullet-${idx}`)
    setCopiedBullets({ ...copiedBullets, [idx]: true })
    setTimeout(() => {
      setCopiedBullets({ ...copiedBullets, [idx]: false })
    }, 2000)
  }

  return (
    <div className="premium-card p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        Bullet Point Improvements
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        AI-enhanced versions of your resume bullets with stronger impact and measurable results
      </p>
      <div className="space-y-6">
        {bulletImprovements.map((improvement, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center mb-4">
              {/* Before */}
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-500 mb-2">Current</div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  {improvement.original}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </div>

              {/* After */}
              <div>
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">Improved</div>
                <div className="relative">
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {improvement.improved}
                  </p>
                  <button
                    onClick={() => handleCopy(improvement.improved, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Copy improved bullet"
                  >
                    {copiedBullets[idx] ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                <span className="font-medium">Why this is better:</span> {improvement.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BulletImprovementsCard
