/**
 * FunnelChart - Visual funnel showing application progression
 * Shows: Saved → Applied → Screen → Interview → Offer with conversion rates
 */
function FunnelChart({ byStage, successRate }) {
  const stages = [
    { key: 'saved', label: 'Saved', count: byStage.saved, percentage: 100 },
    { key: 'applied', label: 'Applied', count: byStage.applied, percentage: successRate.appliedRate },
    { key: 'screen', label: 'Phone Screen', count: byStage.screen, percentage: successRate.screenRate },
    { key: 'interview', label: 'Interview', count: byStage.interview, percentage: successRate.interviewRate },
    { key: 'offer', label: 'Offer', count: byStage.offer, percentage: successRate.offerRate },
  ]

  return (
    <div className="space-y-3">
      {stages.map((stage, idx) => {
        const width = 100 - idx * 15 // Progressive narrowing
        return (
          <div key={stage.key} className="relative">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-button py-4 px-6 transition-all duration-300"
              style={{ width: `${width}%` }}
            >
              <div className="flex items-center justify-between text-white">
                <span className="font-medium">{stage.label}</span>
                <span className="font-bold">{stage.count}</span>
              </div>
            </div>
            {idx < stages.length - 1 && stage.percentage > 0 && (
              <div className="absolute -bottom-1 right-4 text-xs text-gray-500 dark:text-gray-500">
                {Math.round(stage.percentage)}% conversion
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FunnelChart
