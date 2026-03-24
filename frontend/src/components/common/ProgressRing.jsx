/**
 * Circular progress ring for visualizing scores
 * UX Principle: Visual data representation improves comprehension
 */
import { SIZES } from '../../config/constants'
import { PROGRESS_RING_COLORS, PROGRESS_RING_STROKES } from '../../config/theme'

function ProgressRing({ value, size = SIZES.PROGRESS_RING_DEFAULT, strokeWidth = SIZES.PROGRESS_RING_STROKE_DEFAULT, color = 'primary' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const colorClasses = PROGRESS_RING_COLORS
  const strokeColors = PROGRESS_RING_STROKES

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
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
