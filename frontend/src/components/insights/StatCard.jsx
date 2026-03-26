/**
 * StatCard - Premium stat display card
 * Shows key metric with icon, title, value, and optional trend
 */
function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel }) {
  return (
    <div className="premium-card p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
      )}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <span className={trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-gray-500 dark:text-gray-500">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default StatCard
