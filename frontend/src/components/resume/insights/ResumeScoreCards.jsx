import ProgressRing from '../../common/ProgressRing'

/**
 * ResumeScoreCards - Displays overall and ATS scores side by side
 */
function ResumeScoreCards({ overallScore, atsScore, getScoreConfig }) {
  const overallConfig = getScoreConfig(overallScore)
  const atsConfig = getScoreConfig(atsScore)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Overall Score */}
      <div className="premium-card p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Overall Resume Score
        </h3>
        <div className="flex flex-col items-center">
          <ProgressRing
            value={overallScore}
            size={160}
            strokeWidth={12}
            color={overallConfig.color}
          />
          <div className="mt-4 text-center">
            <div className={`inline-block px-4 py-1 rounded-full ${overallConfig.bgColor} text-white text-sm font-medium`}>
              {overallConfig.label}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Resume quality and presentation
            </p>
          </div>
        </div>
      </div>

      {/* ATS Score */}
      <div className="premium-card p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          ATS Compatibility Score
        </h3>
        <div className="flex flex-col items-center">
          <ProgressRing
            value={atsScore}
            size={160}
            strokeWidth={12}
            color={atsConfig.color}
          />
          <div className="mt-4 text-center">
            <div className={`inline-block px-4 py-1 rounded-full ${atsConfig.bgColor} text-white text-sm font-medium`}>
              {atsConfig.label}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Applicant Tracking System compatibility
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeScoreCards
