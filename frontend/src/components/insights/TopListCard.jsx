/**
 * TopListCard - Displays top companies or roles with counts
 * Shows ranked list with item name and count
 */
function TopListCard({ title, items, icon: Icon }) {
  // items: [{ name: 'Google', count: 5 }, ...]

  if (!items || items.length === 0) {
    return (
      <div className="premium-card p-6">
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
          No data yet
        </div>
      </div>
    )
  }

  return (
    <div className="premium-card p-6">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate pr-2">
              <span className="text-gray-400 dark:text-gray-600 font-medium">{idx + 1}.</span> {item.name}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-shrink-0">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopListCard
