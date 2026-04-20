import type { RiskLevel, AlertSeverity } from '@/types'

const riskStyles: Record<RiskLevel, string> = {
  HIGH: 'bg-risk-high/15 text-risk-high border-risk-high/30',
  LIMITED: 'bg-risk-amber/15 text-risk-amber border-risk-amber/30',
  MINIMAL: 'bg-risk-green/15 text-risk-green border-risk-green/30',
}

const severityStyles: Record<AlertSeverity, string> = {
  critical: 'bg-risk-high/15 text-risk-high border-risk-high/30',
  warning: 'bg-risk-amber/15 text-risk-amber border-risk-amber/30',
  info: 'bg-accent-bright/15 text-accent-bright border-accent-bright/30',
}

const urgencyStyles: Record<string, string> = {
  critical: 'bg-risk-high/15 text-risk-high border-risk-high/30',
  high: 'bg-risk-amber/15 text-risk-amber border-risk-amber/30',
  medium: 'bg-accent-bright/15 text-accent-bright border-accent-bright/30',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'risk' | 'severity' | 'urgency' | 'neutral' | 'sensitive'
  riskLevel?: RiskLevel
  severity?: AlertSeverity
  urgency?: string
  className?: string
}

export function Badge({ children, variant = 'neutral', riskLevel, severity, urgency, className = '' }: BadgeProps) {
  let style = 'bg-bg-elevated text-text-secondary border-border'

  if (variant === 'risk' && riskLevel) {
    style = riskStyles[riskLevel]
  } else if (variant === 'severity' && severity) {
    style = severityStyles[severity]
  } else if (variant === 'urgency' && urgency) {
    style = urgencyStyles[urgency] || style
  } else if (variant === 'sensitive') {
    style = 'bg-risk-high/10 text-risk-high border-risk-high/25'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase tracking-wider border ${style} ${className}`}>
      {children}
    </span>
  )
}
