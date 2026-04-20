import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FilterBar } from '@/components/FilterBar'
import { SystemCard } from '@/components/SystemCard'
import { ConnectRepoModal } from '@/components/ConnectRepoModal'
import { mockSystems } from '@/data/mockSystems'
import { useRole } from '@/context/RoleContext'
import { GitBranch, Github, Check } from 'lucide-react'

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High Risk' },
  { value: 'needs-attention', label: 'Needs Attention' },
  { value: 'compliant', label: 'Compliant' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export function Systems() {
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const { github } = useRole()

  const selectedRepo = github.repos.find(r => r.id === github.selectedRepoId)

  const filteredSystems = useMemo(() => {
    return mockSystems.filter(system => {
      if (filter === 'all') return true
      if (filter === 'high') return system.riskLevel === 'HIGH'
      if (filter === 'needs-attention') return system.complianceScore < 90
      if (filter === 'compliant') return system.complianceScore >= 90
      return true
    })
  }, [filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">AI Systems</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {mockSystems.length} systems registered
          </p>
        </div>
        {github.connected && selectedRepo ? (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent-bright/30 text-xs font-medium transition-colors"
          >
            <Github size={14} className="text-text-primary" />
            <span className="font-mono text-text-secondary">{selectedRepo.fullName}</span>
            <Check size={12} className="text-risk-green" />
          </button>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors"
          >
            <GitBranch size={14} /> Connect Repo
          </button>
        )}
      </div>

      <FilterBar options={filterOptions} value={filter} onChange={setFilter} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        key={filter}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {filteredSystems.map(system => (
          <motion.div key={system.id} variants={item}>
            <SystemCard system={system} />
          </motion.div>
        ))}
      </motion.div>

      {filteredSystems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">No systems match the current filter.</p>
        </div>
      )}

      <ConnectRepoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
