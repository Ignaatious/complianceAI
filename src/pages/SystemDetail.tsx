import { useState, useCallback } from 'react'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { mockSystems } from '@/data/mockSystems'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { ProgressBar } from '@/components/ProgressBar'
import { ChecklistPanel } from '@/components/ChecklistPanel'
import { SparklineChart } from '@/components/SparklineChart'
import { useComplianceScore } from '@/hooks/useComplianceScore'
import { useRole } from '@/context/RoleContext'
import type { ChecklistCategory, SystemTab } from '@/types'
import {
  ClipboardList, Activity, FileText, Eye, Clock,
  Download, Copy, Users, Zap, TrendingUp, AlertTriangle, Lock
} from 'lucide-react'
import {
  ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts'

const adminTabs: { id: SystemTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'checklist', label: 'Compliance Checklist', icon: ClipboardList },
  { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'documentation', label: 'Documentation', icon: FileText },
]

const devTabs: { id: SystemTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'checklist', label: 'Compliance Checklist', icon: ClipboardList },
]

export function SystemDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const tabParam = searchParams.get('tab') as SystemTab | null
  const [activeTab, setActiveTab] = useState<SystemTab>(tabParam || 'overview')

  const { role } = useRole()
  const isDeveloper = location.pathname === '/developer' || role === 'developer'
  const isAdmin = !isDeveloper

  const tabs = isAdmin ? adminTabs : devTabs

  const system = mockSystems.find(s => s.id === id)

  const [checklist, setChecklist] = useState<ChecklistCategory[]>(
    () => system ? JSON.parse(JSON.stringify(system.checklist)) : []
  )

  const { score, completed, total } = useComplianceScore(checklist)

  const handleToggle = useCallback((categoryId: string, itemId: string) => {
    setChecklist(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )}
        : cat
    ))
  }, [])

  const switchTab = (tab: SystemTab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  // Confirmation form state
  const [confirmForm, setConfirmForm] = useState({
    euFacing: null as boolean | null,
    legallyBinding: null as boolean | null,
    endUsers: null as string | null,
    additionalContext: '',
  })
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirmSubmit = () => {
    if (isDeveloper) {
      // Developer just saves inputs — no report generation
      setConfirmed(true)
    }
    // Admin gets the full generate flow
    if (isAdmin) {
      setConfirmed(true)
    }
  }

  if (!system) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-muted">System not found.</p>
      </div>
    )
  }

  const healthData = [{ name: 'Health', value: system.metrics.healthScore, fill: '#4d79ff' }]

  const sparklineMetrics = [
    { label: 'Human Override Rate', data: system.metrics.humanOverrideRate, color: '#4d79ff', icon: Users, suffix: '%' },
    { label: 'Input Schema Changes', data: system.metrics.inputSchemaChanges, color: '#ffaa00', icon: Zap, suffix: '' },
    { label: 'Output Drift Score', data: system.metrics.outputDriftScore, color: '#ff4444', icon: TrendingUp, suffix: '' },
    { label: 'Incidents (30d)', data: system.metrics.incidents, color: '#00cc66', icon: AlertTriangle, suffix: '' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-lg font-semibold text-text-primary">{system.name}</h1>
            <Badge variant="risk" riskLevel={system.riskLevel}>{system.riskLevel} RISK</Badge>
          </div>
          <p className="text-xs font-mono text-text-muted">{system.filePath}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-text-primary">{score}%</div>
          <p className="text-[10px] text-text-muted">{completed}/{total} items complete</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 p-0.5 bg-bg-surface border border-border rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-accent/15 text-accent-bright'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Auto-Detected Profile */}
              <Card>
                <h2 className="text-sm font-semibold text-text-primary mb-4">Auto-Detected Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                  <ProfileRow label="Purpose" value={system.purpose} />
                  <ProfileRow label="Model" value={system.model} mono />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted">Input Fields</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {system.inputFields.map(f => (
                        <Badge
                          key={f.label}
                          variant={f.sensitive ? 'sensitive' : 'neutral'}
                          className="!text-[10px]"
                        >
                          {f.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ProfileRow
                    label="Override Path"
                    value={system.overridePath || 'None'}
                    mono
                    warning={!system.overridePath}
                  />
                  <ProfileRow label="Source File" value={system.sourceFile} mono />
                  <ProfileRow label="Owner" value={system.owner} />
                </div>
              </Card>

              {/* Confirm 4 things */}
              <Card>
                <h2 className="text-sm font-semibold text-text-primary mb-4">Confirm 4 things</h2>
                {confirmed ? (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-risk-green/15 flex items-center justify-center mx-auto">
                      <svg className="w-4 h-4 text-risk-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-xs text-text-primary font-medium">
                      {isDeveloper ? 'Inputs submitted' : 'Compliance record generated'}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {isDeveloper
                        ? 'Your inputs have been saved. An admin will review and generate the compliance record.'
                        : 'The compliance record has been generated and is ready for review in the Documentation tab.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ConfirmRow label="Is this EU-facing?">
                      <div className="flex gap-1.5">
                        {['Yes', 'No'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setConfirmForm(p => ({ ...p, euFacing: opt === 'Yes' }))}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                              confirmForm.euFacing === (opt === 'Yes')
                                ? 'bg-accent/15 border-accent-bright text-accent-bright'
                                : 'border-border text-text-secondary hover:border-text-muted'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </ConfirmRow>
                    <ConfirmRow label="Is the output legally binding?">
                      <div className="flex gap-1.5">
                        {['Yes', 'No'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setConfirmForm(p => ({ ...p, legallyBinding: opt === 'Yes' }))}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                              confirmForm.legallyBinding === (opt === 'Yes')
                                ? 'bg-accent/15 border-accent-bright text-accent-bright'
                                : 'border-border text-text-secondary hover:border-text-muted'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </ConfirmRow>
                    <ConfirmRow label="Who are the end users?">
                      <div className="flex gap-1.5">
                        {['B2B', 'B2C', 'Both'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setConfirmForm(p => ({ ...p, endUsers: opt }))}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                              confirmForm.endUsers === opt
                                ? 'bg-accent/15 border-accent-bright text-accent-bright'
                                : 'border-border text-text-secondary hover:border-text-muted'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </ConfirmRow>
                    <ConfirmRow label="Any additional context on real-world use?">
                      <input
                        type="text"
                        value={confirmForm.additionalContext}
                        onChange={e => setConfirmForm(p => ({ ...p, additionalContext: e.target.value }))}
                        placeholder="Optional context..."
                        className="w-full px-3 py-1.5 rounded text-xs bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-bright transition-colors"
                      />
                    </ConfirmRow>
                    <button
                      onClick={handleConfirmSubmit}
                      className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors"
                    >
                      {isDeveloper ? 'Submit Inputs \u2192' : 'Confirm & Generate Compliance Record \u2192'}
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <Card className="!p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Compliance Score</span>
                  <span className="text-sm font-mono font-bold text-text-primary">{score}%</span>
                </div>
                <ProgressBar value={score} size="md" className="mt-2" />
              </Card>
              <ChecklistPanel categories={checklist} onToggle={handleToggle} showArticleRef={isAdmin} />
            </div>
          )}

          {activeTab === 'monitoring' && isAdmin && (
            <div className="space-y-4">
              {/* Health gauge */}
              <Card>
                <div className="flex items-center gap-6">
                  <div className="w-28 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={healthData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          background={{ fill: '#1e1e2e' }}
                          dataKey="value"
                          cornerRadius={10}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-2xl font-mono font-bold text-text-primary">{system.metrics.healthScore}%</p>
                    <p className="text-xs text-text-muted">System Health</p>
                  </div>
                </div>
              </Card>

              {/* Sparkline metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sparklineMetrics.map(metric => (
                  <Card key={metric.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <metric.icon size={14} style={{ color: metric.color }} />
                        <span className="text-xs text-text-secondary">{metric.label}</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-text-primary">
                        {metric.data[metric.data.length - 1]?.toFixed(1)}{metric.suffix}
                      </span>
                    </div>
                    <SparklineChart data={metric.data} color={metric.color} height={48} />
                  </Card>
                ))}
              </div>

              {/* Alert log */}
              <Card>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Alert Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-text-muted text-left border-b border-border">
                        <th className="pb-2 pr-4 font-medium">Timestamp</th>
                        <th className="pb-2 pr-4 font-medium">Event</th>
                        <th className="pb-2 pr-4 font-medium">Severity</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {system.metrics.alertLog.map(entry => (
                        <tr key={entry.id} className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-text-muted">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </td>
                          <td className="py-2 pr-4 text-text-secondary">{entry.eventType}</td>
                          <td className="py-2 pr-4">
                            <Badge variant="severity" severity={entry.severity}>{entry.severity}</Badge>
                          </td>
                          <td className="py-2 text-text-muted">{entry.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'documentation' && isAdmin && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">Technical Documentation</h2>
                    <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> Auto-generated &middot; Last updated {system.lastScanned}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-bright px-2 py-1 rounded border border-border hover:border-accent-bright/30 transition-colors">
                      <Download size={12} /> Download PDF
                    </button>
                    <button className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-bright px-2 py-1 rounded border border-border hover:border-accent-bright/30 transition-colors">
                      <Copy size={12} /> Copy Markdown
                    </button>
                  </div>
                </div>

                {/* Annex IV preview */}
                <div className="prose-invert text-xs space-y-4 font-sans leading-relaxed">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-semibold text-text-primary mb-1">1. General Description</h3>
                    <p className="text-text-secondary">{system.description}</p>
                  </div>
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-semibold text-text-primary mb-1">2. Intended Purpose</h3>
                    <p className="text-text-secondary">{system.purpose}</p>
                  </div>
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-semibold text-text-primary mb-1">3. System Architecture</h3>
                    <p className="text-text-secondary">
                      Model: <span className="font-mono text-accent-bright">{system.model}</span>
                    </p>
                    <p className="text-text-secondary mt-1">
                      Source: <span className="font-mono text-accent-bright">{system.sourceFile}</span>
                    </p>
                    {system.overridePath && (
                      <p className="text-text-secondary mt-1">
                        Override mechanism: <span className="font-mono text-accent-bright">{system.overridePath}</span>
                      </p>
                    )}
                  </div>
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-semibold text-text-primary mb-1">4. Data Requirements</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {system.inputFields.map(f => (
                        <Badge
                          key={f.label}
                          variant={f.sensitive ? 'sensitive' : 'neutral'}
                          className="!text-[10px]"
                        >
                          {f.label}: {f.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-semibold text-text-primary mb-1">5. Risk Classification</h3>
                    <p className="text-text-secondary">
                      This system is classified as <Badge variant="risk" riskLevel={system.riskLevel}>{system.riskLevel} RISK</Badge> under the EU AI Act.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">6. Compliance Status</h3>
                    <p className="text-text-secondary">
                      Current compliance score: <span className="font-mono font-bold text-text-primary">{score}%</span> ({completed}/{total} requirements met)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ProfileRow({ label, value, mono, warning }: { label: string; value: string; mono?: boolean; warning?: boolean }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
      <p className={`text-xs mt-0.5 ${mono ? 'font-mono' : ''} ${warning ? 'text-risk-amber' : 'text-text-primary'}`}>
        {value}{warning ? ' \u26A0\uFE0F' : ''}
      </p>
    </div>
  )
}

function ConfirmRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
