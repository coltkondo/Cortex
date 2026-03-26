/**
 * Circular progress ring for visualizing scores
 * UX Principle: Visual data representation improves comprehension
 */
import { SIZES } from '../../config/constants'
import { PROGRESS_RING_COLORS, PROGRESS_RING_STROKES } from '../../config/theme'

function ProgressRing({ value, size = 'default', strokeWidth, color = 'primary' }) {
  // Handle size presets
  const sizeMap = {
    default: SIZES.PROGRESS_RING_DEFAULT,
    large: SIZES.PROGRESS_RING_LARGE,
  }

  const strokeMap = {
    default: SIZES.PROGRESS_RING_STROKE_DEFAULT,
    large: SIZES.PROGRESS_RING_STROKE_LARGE,
  }

  // Convert size to number (handle both preset strings and direct numbers)
  const numericSize = typeof size === 'string' ? sizeMap[size] || SIZES.PROGRESS_RING_DEFAULT : size
  const numericStroke = strokeWidth || (typeof size === 'string' ? strokeMap[size] || SIZES.PROGRESS_RING_STROKE_DEFAULT : SIZES.PROGRESS_RING_STROKE_DEFAULT)

  const radius = (numericSize - numericStroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const colorClasses = PROGRESS_RING_COLORS
  const strokeColors = PROGRESS_RING_STROKES

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={numericSize} height={numericSize} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={numericSize / 2}
          cy={numericSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={numericStroke}
          fill="none"
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <circle
          cx={numericSize / 2}
          cy={numericSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={numericStroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${strokeColors[color]} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute text-center ${colorClasses[color]}`}>
        <div className="text-3xl font-bold">{value}%</div>
      </div>
    </div>
  )
}

export default ProgressRing
