import { Sparkles, Brain, Target, Zap } from 'lucide-react'

/**
 * HeroCard - Large premium hero card with abstract illustration
 * Gradient background, floating icons, professional aesthetic
 */
function HeroCard({ children, className = '' }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-card p-12 md:p-16
        bg-gradient-subtle border border-gray-200 dark:border-gray-800
        shadow-premium
        ${className}
      `}
    >
      {/* Abstract Icon Arrangement */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        {/* Floating Icons */}
        <Sparkles
          className="absolute top-12 right-16 w-16 h-16 text-primary-500"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <Brain
          className="absolute bottom-16 left-20 w-20 h-20 text-primary-600"
          style={{ animation: 'float 7s ease-in-out infinite 1s' }}
        />
        <Target
          className="absolute top-24 left-24 w-14 h-14 text-primary-400"
          style={{ animation: 'float 8s ease-in-out infinite 2s' }}
        />
        <Zap
          className="absolute bottom-20 right-24 w-12 h-12 text-primary-500"
          style={{ animation: 'float 9s ease-in-out infinite 3s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-950/20" />
    </div>
  )
}

/* Floating Animation */
const style = document.createElement('style')
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-20px) rotate(5deg);
    }
    50% {
      transform: translateY(-10px) rotate(-5deg);
    }
    75% {
      transform: translateY(-15px) rotate(3deg);
    }
  }
`
document.head.appendChild(style)

export default HeroCard
