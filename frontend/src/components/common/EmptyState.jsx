/**
 * Empty state component with helpful guidance
 * UX Principle: Empty states guide users on what to do next
 */

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12 px-4">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-gray-100 p-6">
            <Icon className="h-12 w-12 text-gray-400" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}

export default EmptyState
