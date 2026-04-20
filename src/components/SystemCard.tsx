import { useNavigate } from 'react-router-dom'
import { Card } from './Card'
import { Badge } from './Badge'
import { ProgressBar } from './ProgressBar'
import type { AISystem } from '@/types'
import { Eye, Wrench } from 'lucide-react'

interface SystemCardProps {
  system: AISystem
}

export function SystemCard({ system }: SystemCardProps) {
  const navigate = useNavigate()

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary truncate">{system.name}</h3>
          <p className="text-xs font-mono text-text-muted mt-0.5 truncate">{system.filePath}</p>
        </div>
        <Badge variant="risk" riskLevel={system.riskLevel}>
          {system.riskLevel} RISK
        </Badge>
      </div>

      <ProgressBar value={system.complianceScore} size="md" showLabel className="mb-3" />

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary">
          {system.model}
        </span>
        {system.inputFields
          .filter(f => f.sensitive)
          .map(f => (
            <span key={f.label} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-risk-high/10 text-risk-high">
              {f.label}
            </span>
          ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-muted">Last scanned {system.lastScanned}</span>
        <div className="flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/systems/${system.id}`) }}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-bright px-2 py-1 rounded border border-border hover:border-accent-bright/30 transition-colors"
          >
            <Eye size={12} /> View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/systems/${system.id}?tab=checklist`) }}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-risk-amber px-2 py-1 rounded border border-border hover:border-risk-amber/30 transition-colors"
          >
            <Wrench size={12} /> Fix Issues
          </button>
        </div>
      </div>
    </Card>
  )
}
