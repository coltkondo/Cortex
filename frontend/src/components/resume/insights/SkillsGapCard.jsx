import { TrendingUp } from 'lucide-react'

/**
 * SkillsGapCard - Displays missing skills and trending skills
 */
function SkillsGapCard({ skillsGap }) {
  return (
    <div className="premium-card p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        Skills Gap Analysis
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        In-demand skills to strengthen your resume for your target roles
      </p>

      {/* Missing Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          High-Demand Skills Missing from Your Resume
        </h4>
        <div className="flex flex-wrap gap-2">
          {skillsGap.missing.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-800"
            >
              {skill}
            </span>
          ))}
        </div>
        {skillsGap.missing.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            No critical skill gaps identified
          </p>
        )}
      </div>

      {/* Trending Skills */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Trending Skills in Your Industry
        </h4>
        <div className="flex flex-wrap gap-2">
          {skillsGap.trending.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
        {skillsGap.trending.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            No trending skills identified
          </p>
        )}
      </div>
    </div>
  )
}

export default SkillsGapCard
