/**
 * PageHeader - Reusable premium page header component
 * Used across multiple pages for consistent styling
 */
function PageHeader({ icon: Icon, title, description, actions }) {
  return (
    <div className="bg-gradient-subtle border-b border-gray-200 dark:border-gray-800">
      <div className="container-premium py-12">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
