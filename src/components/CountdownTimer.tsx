import { useCountdown } from '@/hooks/useCountdown'

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown()

  if (isPast) {
    return <span className="text-risk-high font-mono text-sm font-bold">DEADLINE PASSED</span>
  }

  if (compact) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-mono font-bold text-text-primary">{days}</span>
        <span className="text-[10px] text-text-muted">days remaining</span>
      </div>
    )
  }

  const blocks = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HRS' },
    { value: minutes, label: 'MIN' },
    { value: seconds, label: 'SEC' },
  ]

  return (
    <div className="flex gap-2">
      {blocks.map(block => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="w-12 h-10 flex items-center justify-center bg-bg-elevated border border-border rounded-md">
            <span className="font-mono text-lg font-bold text-text-primary">
              {String(block.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[9px] text-text-muted mt-1 tracking-wider">{block.label}</span>
        </div>
      ))}
    </div>
  )
}
