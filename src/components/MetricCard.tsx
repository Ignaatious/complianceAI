import { Card } from './Card'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: string
  subtitle?: string
}

export function MetricCard({ title, value, icon: Icon, color = 'text-accent-bright', subtitle }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-bg-elevated ${color}`}>
          <Icon size={18} />
        </div>
      </div>
    </Card>
  )
}
