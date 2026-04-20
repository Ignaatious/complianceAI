import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { mockSystems } from '@/data/mockSystems'
import { useComplianceScore } from '@/hooks/useComplianceScore'
import {
  FileText, Download, Copy, Clock, CheckCircle, AlertTriangle,
  ExternalLink, Search, ChevronDown, FileCheck, BookOpen, Scale
} from 'lucide-react'

interface DocEntry {
  id: string
  systemId: string
  systemName: string
  title: string
  type: 'annex-iv' | 'risk-assessment' | 'monitoring-plan' | 'incident-report'
  status: 'current' | 'draft' | 'outdated'
  generatedAt: string
  version: string
}

const mockDocs: DocEntry[] = [
  { id: 'doc-1', systemId: 'resume-screener', systemName: 'resume-screener', title: 'Technical Documentation', type: 'annex-iv', status: 'current', generatedAt: '2026-04-01T10:00:00Z', version: 'v2.3' },
  { id: 'doc-2', systemId: 'resume-screener', systemName: 'resume-screener', title: 'Risk Assessment Report', type: 'risk-assessment', status: 'current', generatedAt: '2026-03-28T14:00:00Z', version: 'v1.8' },
  { id: 'doc-3', systemId: 'contract-analyzer', systemName: 'contract-analyzer', title: 'Technical Documentation', type: 'annex-iv', status: 'current', generatedAt: '2026-04-02T09:30:00Z', version: 'v3.1' },
  { id: 'doc-4', systemId: 'contract-analyzer', systemName: 'contract-analyzer', title: 'Post-Market Monitoring Plan', type: 'monitoring-plan', status: 'current', generatedAt: '2026-03-25T11:00:00Z', version: 'v1.2' },
  { id: 'doc-5', systemId: 'chat-support', systemName: 'chat-support', title: 'Technical Documentation', type: 'annex-iv', status: 'current', generatedAt: '2026-04-03T08:00:00Z', version: 'v2.0' },
  { id: 'doc-6', systemId: 'fraud-detector', systemName: 'fraud-detector', title: 'Technical Documentation', type: 'annex-iv', status: 'draft', generatedAt: '2026-03-30T16:00:00Z', version: 'v0.9' },
  { id: 'doc-7', systemId: 'fraud-detector', systemName: 'fraud-detector', title: 'Risk Assessment Report', type: 'risk-assessment', status: 'outdated', generatedAt: '2026-02-15T12:00:00Z', version: 'v1.0' },
  { id: 'doc-8', systemId: 'fraud-detector', systemName: 'fraud-detector', title: 'Incident Report — Bias Threshold Breach', type: 'incident-report', status: 'draft', generatedAt: '2026-04-01T15:00:00Z', version: 'v0.1' },
]

const typeIcons: Record<DocEntry['type'], React.ElementType> = {
  'annex-iv': FileText,
  'risk-assessment': AlertTriangle,
  'monitoring-plan': BookOpen,
  'incident-report': Scale,
}

const typeLabels: Record<DocEntry['type'], string> = {
  'annex-iv': 'Technical Documentation',
  'risk-assessment': 'Risk Assessment',
  'monitoring-plan': 'Monitoring Plan',
  'incident-report': 'Incident Report',
}

const statusStyles: Record<DocEntry['status'], { label: string; className: string }> = {
  current: { label: 'Current', className: 'bg-risk-green/15 text-risk-green border-risk-green/30' },
  draft: { label: 'Draft', className: 'bg-risk-amber/15 text-risk-amber border-risk-amber/30' },
  outdated: { label: 'Outdated', className: 'bg-risk-high/15 text-risk-high border-risk-high/30' },
}

const regulatoryRefs = [
  { title: 'EU AI Act Full Text', desc: 'Regulation (EU) 2024/1689 — Official Journal', url: '#' },
  { title: 'High-Risk AI Systems List', desc: 'Annex III — Categories of high-risk systems', url: '#' },
  { title: 'Technical Documentation Requirements', desc: 'Annex IV — Required documentation structure', url: '#' },
  { title: 'Conformity Assessment Procedures', desc: 'Annex VI & VII — Assessment pathways', url: '#' },
]

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'annex-iv', label: 'Technical Docs' },
  { value: 'risk-assessment', label: 'Risk Assessment' },
  { value: 'monitoring-plan', label: 'Monitoring Plans' },
  { value: 'incident-report', label: 'Incidents' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

export function Docs() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

  const filteredDocs = mockDocs.filter(doc => {
    if (filter !== 'all' && doc.type !== filter) return false
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase()) && !doc.systemName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const currentCount = mockDocs.filter(d => d.status === 'current').length
  const draftCount = mockDocs.filter(d => d.status === 'draft').length
  const outdatedCount = mockDocs.filter(d => d.status === 'outdated').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Documentation</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {mockDocs.length} documents across {mockSystems.length} systems
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors">
          <FileCheck size={14} /> Generate All Reports
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Current</span>
            <CheckCircle size={12} className="text-risk-green" />
          </div>
          <p className="text-xl font-mono font-bold text-risk-green mt-1">{currentCount}</p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Drafts</span>
            <Clock size={12} className="text-risk-amber" />
          </div>
          <p className="text-xl font-mono font-bold text-risk-amber mt-1">{draftCount}</p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Outdated</span>
            <AlertTriangle size={12} className="text-risk-high" />
          </div>
          <p className="text-xl font-mono font-bold text-risk-high mt-1">{outdatedCount}</p>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-bright transition-colors"
          />
        </div>
        <div className="flex gap-0.5 p-0.5 bg-bg-elevated rounded-lg border border-border">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
                filter === opt.value
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <motion.div variants={container} initial="hidden" animate="show" key={filter + search} className="space-y-2">
        {filteredDocs.map(doc => {
          const Icon = typeIcons[doc.type]
          const status = statusStyles[doc.status]
          const system = mockSystems.find(s => s.id === doc.systemId)
          const isExpanded = expandedDoc === doc.id

          return (
            <motion.div key={doc.id} variants={item}>
              <div className="border border-border rounded-lg overflow-hidden bg-bg-surface">
                <div
                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-bg-elevated/30 transition-colors text-left cursor-pointer"
                >
                  <div className="p-1.5 rounded bg-bg-elevated flex-shrink-0">
                    <Icon size={14} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-primary truncate">{doc.title}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium uppercase tracking-wider border ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-text-muted">{doc.systemName}</span>
                      <span className="text-[10px] text-text-muted">&middot;</span>
                      <span className="text-[10px] text-text-muted">{doc.version}</span>
                      <span className="text-[10px] text-text-muted">&middot;</span>
                      <span className="text-[10px] text-text-muted">{new Date(doc.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation() }}
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-bright px-1.5 py-1 rounded border border-border hover:border-accent-bright/30 transition-colors"
                    >
                      <Download size={10} /> PDF
                    </button>
                    <button
                      onClick={e => { e.stopPropagation() }}
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-bright px-1.5 py-1 rounded border border-border hover:border-accent-bright/30 transition-colors"
                    >
                      <Copy size={10} /> MD
                    </button>
                    <ChevronDown size={12} className={`text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded preview */}
                {isExpanded && system && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border"
                  >
                    <DocPreview doc={doc} system={system} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">No documents match the current filter.</p>
        </div>
      )}

      {/* Regulatory References */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Scale size={14} className="text-accent-bright" />
          <h2 className="text-sm font-semibold text-text-primary">Regulatory References</h2>
        </div>
        <div className="space-y-1.5">
          {regulatoryRefs.map(ref => (
            <a
              key={ref.title}
              href={ref.url}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-accent-bright/30 hover:bg-bg-elevated/30 transition-colors group"
            >
              <div>
                <p className="text-xs text-text-primary group-hover:text-accent-bright transition-colors">{ref.title}</p>
                <p className="text-[10px] text-text-muted">{ref.desc}</p>
              </div>
              <ExternalLink size={10} className="text-text-muted group-hover:text-accent-bright transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DocPreview({ doc, system }: { doc: DocEntry; system: typeof mockSystems[0] }) {
  const { score, completed, total } = useComplianceScore(system.checklist)

  if (doc.type === 'incident-report') {
    return (
      <div className="p-4 text-xs space-y-3 bg-bg-primary/50">
        <div className="border-b border-border/50 pb-2">
          <h4 className="text-sm font-semibold text-text-primary mb-1">Incident Report</h4>
          <p className="text-[10px] text-text-muted">Generated {new Date(doc.generatedAt).toLocaleString()} &middot; {doc.version}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Affected System</p>
          <p className="text-text-primary font-mono">{system.name}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Incident Summary</p>
          <p className="text-text-secondary leading-relaxed">Monthly bias audit detected a 23% higher false-positive rate for transactions originating from specific geographic regions. This crossed the 15% threshold defined in the post-market monitoring plan.</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Root Cause</p>
          <p className="text-text-secondary leading-relaxed">Training data underrepresented transactions from recently onboarded geographic regions, causing the model to over-flag transactions from these areas as potentially fraudulent.</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Remediation Steps</p>
          <ol className="space-y-1 text-text-secondary">
            <li className="flex gap-2"><span className="text-text-muted font-mono">1.</span> Retrain model with rebalanced geographic sampling</li>
            <li className="flex gap-2"><span className="text-text-muted font-mono">2.</span> Update monitoring thresholds for new regions</li>
            <li className="flex gap-2"><span className="text-text-muted font-mono">3.</span> Schedule follow-up bias audit in 14 days</li>
          </ol>
        </div>
      </div>
    )
  }

  if (doc.type === 'risk-assessment') {
    return (
      <div className="p-4 text-xs space-y-3 bg-bg-primary/50">
        <div className="border-b border-border/50 pb-2">
          <h4 className="text-sm font-semibold text-text-primary mb-1">Risk Assessment Report</h4>
          <p className="text-[10px] text-text-muted">Generated {new Date(doc.generatedAt).toLocaleString()} &middot; {doc.version}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Risk Classification</p>
            <Badge variant="risk" riskLevel={system.riskLevel}>{system.riskLevel} RISK</Badge>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Compliance Score</p>
            <p className="text-text-primary font-mono font-bold">{score}% <span className="text-text-muted font-normal">({completed}/{total})</span></p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Identified Risks</p>
          <div className="space-y-1.5">
            {system.inputFields.filter(f => f.sensitive).map(f => (
              <div key={f.label} className="flex items-center gap-2 p-2 rounded bg-risk-high/5 border border-risk-high/10">
                <AlertTriangle size={10} className="text-risk-high flex-shrink-0" />
                <span className="text-text-secondary">Processes sensitive field: <span className="font-mono text-risk-high">{f.label}</span></span>
              </div>
            ))}
            {!system.overridePath && (
              <div className="flex items-center gap-2 p-2 rounded bg-risk-amber/5 border border-risk-amber/10">
                <AlertTriangle size={10} className="text-risk-amber flex-shrink-0" />
                <span className="text-text-secondary">No human override mechanism detected</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Mitigation Measures</p>
          <p className="text-text-secondary leading-relaxed">{system.overridePath ? `Human override mechanism available at ${system.overridePath}. ` : ''}Regular bias audits and performance monitoring are in place. Escalation paths defined for edge cases.</p>
        </div>
      </div>
    )
  }

  if (doc.type === 'monitoring-plan') {
    return (
      <div className="p-4 text-xs space-y-3 bg-bg-primary/50">
        <div className="border-b border-border/50 pb-2">
          <h4 className="text-sm font-semibold text-text-primary mb-1">Post-Market Monitoring Plan</h4>
          <p className="text-[10px] text-text-muted">Generated {new Date(doc.generatedAt).toLocaleString()} &middot; {doc.version}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Monitoring Scope</p>
          <p className="text-text-secondary leading-relaxed">{system.description}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Key Metrics Tracked</p>
          <div className="grid grid-cols-2 gap-2">
            {['Human Override Rate', 'Input Schema Changes', 'Output Drift Score', 'Incident Count'].map(metric => (
              <div key={metric} className="flex items-center gap-2 p-2 rounded bg-bg-elevated border border-border">
                <CheckCircle size={10} className="text-risk-green flex-shrink-0" />
                <span className="text-text-secondary">{metric}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Review Schedule</p>
          <p className="text-text-secondary">Quarterly compliance review with automated weekly drift checks. Immediate escalation for threshold breaches.</p>
        </div>
      </div>
    )
  }

  // Default: annex-iv / Technical Documentation
  return (
    <div className="p-4 text-xs space-y-3 bg-bg-primary/50">
      <div className="border-b border-border/50 pb-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1">Technical Documentation</h4>
        <p className="text-[10px] text-text-muted">Generated {new Date(doc.generatedAt).toLocaleString()} &middot; {doc.version}</p>
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Purpose</p>
          <p className="text-text-secondary mt-0.5">{system.purpose}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Model</p>
          <p className="text-text-primary font-mono mt-0.5">{system.model}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Risk Level</p>
          <div className="mt-0.5"><Badge variant="risk" riskLevel={system.riskLevel}>{system.riskLevel} RISK</Badge></div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Compliance</p>
          <p className="text-text-primary font-mono font-bold mt-0.5">{score}%</p>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Input Fields</p>
        <div className="flex flex-wrap gap-1">
          {system.inputFields.map(f => (
            <span key={f.label} className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${f.sensitive ? 'bg-risk-high/10 text-risk-high border-risk-high/25' : 'bg-bg-elevated text-text-secondary border-border'}`}>
              {f.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted">Source</p>
        <p className="text-text-primary font-mono mt-0.5">{system.sourceFile}</p>
      </div>
    </div>
  )
}
