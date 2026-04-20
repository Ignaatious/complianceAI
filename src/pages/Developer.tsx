import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockSystems } from '@/data/mockSystems'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { ProgressBar } from '@/components/ProgressBar'
import { ChevronRight, Terminal, Copy, Check } from 'lucide-react'

const pendingSystems = mockSystems.filter(s => s.complianceScore < 100)

const cliCommands = [
  { cmd: 'aiact scan', desc: 'Scan your codebase for AI systems' },
  { cmd: 'aiact status', desc: 'Show compliance status for all detected systems' },
  { cmd: 'aiact confirm [name]', desc: 'Start the confirmation flow for a specific system' },
]

export function Developer() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  // Inline confirmation form state per system
  const [submittedSystems, setSubmittedSystems] = useState<Set<string>>(new Set())
  const [confirmForms, setConfirmForms] = useState<Record<string, {
    euFacing: boolean | null
    legallyBinding: boolean | null
    endUsers: string | null
    additionalContext: string
  }>>({})

  const getForm = (id: string) => confirmForms[id] || { euFacing: null, legallyBinding: null, endUsers: null, additionalContext: '' }
  const updateForm = (id: string, patch: Record<string, unknown>) => {
    setConfirmForms(prev => ({ ...prev, [id]: { ...getForm(id), ...patch } }))
  }

  const copyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(cmd)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Your Systems</h1>
        <p className="text-xs text-text-muted mt-0.5">
          {pendingSystems.length} system{pendingSystems.length !== 1 ? 's' : ''} pending confirmation
        </p>
      </div>

      {/* Pending systems */}
      <div className="space-y-2">
        {pendingSystems.map(system => (
          <div key={system.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === system.id ? null : system.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-bg-elevated/30 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-xs font-mono text-text-primary truncate">{system.filePath}</span>
                <Badge variant="risk" riskLevel={system.riskLevel}>{system.riskLevel} RISK</Badge>
                <ProgressBar value={system.complianceScore} size="sm" showLabel className="w-32 hidden sm:flex" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                {submittedSystems.has(system.id) ? (
                  <span className="flex items-center gap-1 text-[10px] text-risk-green whitespace-nowrap">
                    <Check size={10} /> Submitted
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] text-text-muted whitespace-nowrap">needs 30s confirmation</span>
                    <ChevronRight
                      size={14}
                      className={`text-text-muted transition-transform ${expandedId === system.id ? 'rotate-90' : ''}`}
                    />
                  </>
                )}
              </div>
            </button>

            {expandedId === system.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border"
              >
                <div className="p-4 space-y-4 bg-bg-surface">
                  <div className="space-y-3">
                    <InlineConfirmRow label="Is this EU-facing?">
                      <div className="flex gap-1.5">
                        {['Yes', 'No'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => updateForm(system.id, { euFacing: opt === 'Yes' })}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                              getForm(system.id).euFacing === (opt === 'Yes')
                                ? 'bg-accent/15 border-accent-bright text-accent-bright'
                                : 'border-border text-text-secondary hover:border-text-muted'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </InlineConfirmRow>
                    <InlineConfirmRow label="Is the output legally binding?">
                      <div className="flex gap-1.5">
                        {['Yes', 'No'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => updateForm(system.id, { legallyBinding: opt === 'Yes' })}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                              getForm(system.id).legallyBinding === (opt === 'Yes')
                                ? 'bg-accent/15 border-accent-bright text-accent-bright'
                                : 'border-border text-text-secondary hover:border-text-muted'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </InlineConfirmRow>
                    <InlineConfirmRow label="Who are the end users?">
                      <div className="flex gap-1.5">
                        {['B2B', 'B2C', 'Both'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => updateForm(system.id, { endUsers: opt })}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                              getForm(system.id).endUsers === opt
                                ? 'bg-accent/15 border-accent-bright text-accent-bright'
                                : 'border-border text-text-secondary hover:border-text-muted'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </InlineConfirmRow>
                    <InlineConfirmRow label="Additional context?">
                      <input
                        type="text"
                        value={getForm(system.id).additionalContext}
                        onChange={e => updateForm(system.id, { additionalContext: e.target.value })}
                        placeholder="Optional..."
                        className="w-48 px-3 py-1.5 rounded text-xs bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-bright transition-colors"
                      />
                    </InlineConfirmRow>
                  </div>
                  <button
                    onClick={() => {
                      setSubmittedSystems(prev => new Set(prev).add(system.id))
                      setExpandedId(null)
                    }}
                    className="w-full py-2 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors"
                  >
                    Submit Inputs &rarr;
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* CLI Reference */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={14} className="text-accent-bright" />
          <h2 className="text-sm font-semibold text-text-primary">CLI Reference</h2>
        </div>
        <div className="space-y-2">
          {cliCommands.map(({ cmd, desc }) => (
            <div key={cmd} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated border border-border">
              <div>
                <code className="text-xs font-mono text-accent-bright">{cmd}</code>
                <p className="text-[10px] text-text-muted mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => copyCmd(cmd)}
                className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-bright transition-colors px-2 py-1"
              >
                <Copy size={10} />
                {copiedCmd === cmd ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function InlineConfirmRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
