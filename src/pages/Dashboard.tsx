import { motion } from 'framer-motion'
import { Cpu, AlertTriangle, Bell, Shield } from 'lucide-react'
import { MetricCard } from '@/components/MetricCard'
import { ProgressBar } from '@/components/ProgressBar'
import { CountdownTimer } from '@/components/CountdownTimer'
import { AlertCard } from '@/components/AlertCard'
import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { useCountdown } from '@/hooks/useCountdown'
import { mockSystems } from '@/data/mockSystems'
import { mockAlerts, mockNextActions } from '@/data/mockAlerts'
import { useNavigate } from 'react-router-dom'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { totalDays } = useCountdown()
  const navigate = useNavigate()
  const totalSystems = mockSystems.length
  const highRiskCount = mockSystems.filter(s => s.riskLevel === 'HIGH').length
  const activeAlerts = mockAlerts.filter(a => a.status === 'active').length
  const avgCompliance = Math.round(mockSystems.reduce((acc, s) => acc + s.complianceScore, 0) / totalSystems)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Compliance posture bar */}
      <motion.div variants={item}>
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-accent-bright" />
              <span className="text-sm font-medium text-text-primary">Compliance Posture</span>
              <span className="text-xs font-mono text-text-muted">{avgCompliance}% ready</span>
            </div>
            <div className="flex items-center gap-3">
              <CountdownTimer compact />
              <span className="text-[10px] text-text-muted">until Aug 2, 2026</span>
            </div>
          </div>
          <ProgressBar value={avgCompliance} size="md" />
        </Card>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Systems"
          value={totalSystems}
          icon={Cpu}
          color="text-accent-bright"
        />
        <MetricCard
          title="High Risk"
          value={highRiskCount}
          icon={AlertTriangle}
          color="text-risk-high"
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts}
          icon={Bell}
          color="text-risk-amber"
        />
      </motion.div>

      {/* Two-column: Recent alerts + Next actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">Recent Alerts</h2>
              <button
                onClick={() => navigate('/alerts')}
                className="text-[11px] text-accent-bright hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-0">
              {mockAlerts.slice(0, 5).map(alert => (
                <AlertCard key={alert.id} alert={alert} compact />
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Next Actions</h2>
            <div className="space-y-2">
              {mockNextActions.map(action => (
                <div
                  key={action.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-bg-elevated/50 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary">{action.title}</p>
                    <p className="text-[10px] text-text-muted mt-1 font-mono">{action.systemName}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <Badge variant="urgency" urgency={action.urgency}>{action.urgency}</Badge>
                    <span className="text-[10px] text-text-muted whitespace-nowrap">
                      {new Date(action.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
