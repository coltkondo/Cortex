import { CheckCircle, AlertTriangle } from 'lucide-react'

/**
 * StrengthsWeaknessesCards - Displays strengths and areas to improve
 */
function StrengthsWeaknessesCards({ strengths, weaknesses }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="premium-card p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.map((strength, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="premium-card p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Areas to Improve
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((weakness, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default StrengthsWeaknessesCards
