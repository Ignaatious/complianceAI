import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

function getColor(value: number): string {
  if (value >= 90) return 'bg-risk-green'
  if (value >= 70) return 'bg-risk-amber'
  return 'bg-risk-high'
}

export function ProgressBar({ value, size = 'sm', showLabel = false, className = '' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 ${height} bg-bg-elevated rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} rounded-full ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-text-secondary w-10 text-right">{value}%</span>
      )}
    </div>
  )
}
