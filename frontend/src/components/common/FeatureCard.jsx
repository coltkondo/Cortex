import { Lock, CheckCircle2 } from 'lucide-react'
import Badge from './Badge'

/**
 * FeatureCard - Premium feature card for dashboard
 * Hover lift animation, status indicators, icon support
 */
function FeatureCard({
  icon: Icon,
  title,
  description,
  onClick,
  status = 'active', // 'active', 'locked', 'completed'
  badge,
  className = '',
}) {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isClickable = !isLocked && onClick

  return (
    <div
      className={`
        premium-card group relative p-8
        ${isClickable ? 'cursor-pointer premium-interactive' : ''}
        ${isLocked ? 'opacity-60' : ''}
        ${className}
      `}
      onClick={isLocked ? undefined : onClick}
    >
      {/* Status Badge */}
      {badge && (
        <div className="absolute top-4 right-4">
          <Badge variant="primary" size="sm">{badge}</Badge>
        </div>
      )}

      {/* Icon Circle */}
      <div className="relative mb-6">
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            transition-all duration-200 group-hover:scale-110
            ${
              isCompleted
                ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20'
                : 'bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20'
            }
          `}
        >
          {isLocked ? (
            <Lock className="w-6 h-6 text-gray-400" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 icon-animate" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-card flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500">Complete previous steps</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeatureCard
