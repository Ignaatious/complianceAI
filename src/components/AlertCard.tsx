import { useState } from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import type { Alert } from '@/types'
import { teamMembers } from '@/data/mockAlerts'
import { AlertCircle, AlertTriangle, Info, ChevronDown, X } from 'lucide-react'

const severityIcon = {
  critical: <AlertCircle size={16} className="text-risk-high" />,
  warning: <AlertTriangle size={16} className="text-risk-amber" />,
  info: <Info size={16} className="text-accent-bright" />,
}

interface AlertCardProps {
  alert: Alert
  onAssign?: (alertId: string, assignee: string) => void
  onDismiss?: (alertId: string) => void
  compact?: boolean
}

export function AlertCard({ alert, onAssign, onDismiss, compact = false }: AlertCardProps) {
  const [showAssign, setShowAssign] = useState(false)

  if (compact) {
    return (
      <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
        {severityIcon[alert.severity]}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary truncate">{alert.title}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {alert.systemNames.join(', ')} &middot; {new Date(alert.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-0.5">{severityIcon[alert.severity]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary">{alert.title}</h3>
            <Badge variant="severity" severity={alert.severity}>{alert.severity}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {alert.systemNames.map(name => (
              <span key={name} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-text-secondary mb-3 leading-relaxed">{alert.whatChanged}</p>

      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">What to do</p>
        <ol className="space-y-1">
          {alert.actions.map((action, i) => (
            <li key={i} className="text-xs text-text-secondary flex gap-2">
              <span className="text-text-muted font-mono">{i + 1}.</span>
              {action}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {alert.deadline && (
            <Badge>Due {new Date(alert.deadline).toLocaleDateString()}</Badge>
          )}
          {alert.assignee && (
            <span className="text-[10px] text-text-muted">
              Assigned to {teamMembers.find(m => m.id === alert.assignee)?.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => setShowAssign(!showAssign)}
              className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-bright px-2 py-1 rounded border border-border hover:border-accent-bright/30 transition-colors"
            >
              Assign to <ChevronDown size={10} />
            </button>
            {showAssign && (
              <div className="absolute right-0 bottom-full mb-1 w-40 bg-bg-surface border border-border rounded-lg shadow-lg z-10 py-1">
                {teamMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => { onAssign?.(alert.id, member.id); setShowAssign(false) }}
                    className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onDismiss?.(alert.id)}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-risk-high px-2 py-1 rounded border border-border hover:border-risk-high/30 transition-colors"
          >
            <X size={10} /> Dismiss
          </button>
        </div>
      </div>
    </Card>
  )
}
