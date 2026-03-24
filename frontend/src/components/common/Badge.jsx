/**
 * Badge component for status indicators and tags
 * UX Principle: Clear visual status helps users understand system state
 */
import { BADGE_VARIANTS, BADGE_SIZES } from '../../config/constants'

function Badge({ children, variant = 'default', size = 'md', icon: Icon }) {
  const variants = BADGE_VARIANTS
  const sizes = BADGE_SIZES

  return (
    <span
      className={`inline-flex items-center space-x-1 font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span>{children}</span>
    </span>
  )
}

export default Badge
