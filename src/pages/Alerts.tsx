import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FilterBar } from '@/components/FilterBar'
import { AlertCard } from '@/components/AlertCard'
import { mockAlerts } from '@/data/mockAlerts'
import type { Alert } from '@/types'

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export function Alerts() {
  const [filter, setFilter] = useState('all')
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  const filteredAlerts = useMemo(() => {
    const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter)
    return [...filtered].sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 }
      const diff = severityOrder[a.severity] - severityOrder[b.severity]
      if (diff !== 0) return diff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [filter, alerts])

  const handleAssign = (alertId: string, assignee: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, assignee } : a))
  }

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' as const } : a))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Alerts</h1>
        <p className="text-xs text-text-muted mt-0.5">
          {alerts.filter(a => a.status === 'active').length} active alerts
        </p>
      </div>

      <FilterBar options={filterOptions} value={filter} onChange={setFilter} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        key={filter}
        className="space-y-3"
      >
        {filteredAlerts.map(alert => (
          <motion.div key={alert.id} variants={item}>
            <AlertCard
              alert={alert}
              onAssign={handleAssign}
              onDismiss={handleDismiss}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">No alerts match the current filter.</p>
        </div>
      )}
    </div>
  )
}
