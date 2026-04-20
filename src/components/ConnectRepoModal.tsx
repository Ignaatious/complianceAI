import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRole } from '@/context/RoleContext'
import { X, Github, GitBranch, Lock, Globe, Check, Loader2, Search } from 'lucide-react'

interface ConnectRepoModalProps {
  open: boolean
  onClose: () => void
}

type Step = 'connect' | 'select-repo' | 'configure' | 'scanning' | 'done'

export function ConnectRepoModal({ open, onClose }: ConnectRepoModalProps) {
  const { github, connectGitHub, selectRepo, updateGitHubSettings } = useRole()
  const [step, setStep] = useState<Step>(github.connected ? 'select-repo' : 'connect')
  const [repoSearch, setRepoSearch] = useState('')
  const [scanProgress, setScanProgress] = useState(0)

  const handleConnect = (_provider: 'github' | 'gitlab') => {
    // Simulate OAuth flow
    connectGitHub()
    setStep('select-repo')
  }

  const handleSelectRepo = (repoId: string) => {
    selectRepo(repoId)
    setStep('configure')
  }

  const handleStartScan = () => {
    setStep('scanning')
    setScanProgress(0)
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStep('done')
          return 100
        }
        return prev + Math.random() * 20 + 5
      })
    }, 400)
  }

  const handleDone = () => {
    setStep(github.connected ? 'select-repo' : 'connect')
    onClose()
  }

  const filteredRepos = github.repos.filter(r =>
    r.fullName.toLowerCase().includes(repoSearch.toLowerCase())
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleDone} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-accent-bright" />
            <h2 className="text-sm font-semibold text-text-primary">Connect Repository</h2>
          </div>
          <button onClick={handleDone} className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Step content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {step === 'connect' && (
              <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-text-secondary mb-4">
                  Connect your code repository to automatically detect and scan AI systems in your codebase.
                </p>
                <button
                  onClick={() => handleConnect('github')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent-bright/30 hover:bg-bg-elevated/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-bg-elevated group-hover:bg-accent/10">
                    <Github size={20} className="text-text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-text-primary">GitHub</p>
                    <p className="text-[10px] text-text-muted">Connect via OAuth &middot; Supports GitHub.com and Enterprise</p>
                  </div>
                  <span className="text-[10px] text-accent-bright font-medium">Connect &rarr;</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent-bright/30 hover:bg-bg-elevated/50 transition-colors group"
                  onClick={() => handleConnect('gitlab')}
                >
                  <div className="p-2 rounded-lg bg-bg-elevated group-hover:bg-accent/10">
                    <GitBranch size={20} className="text-text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-text-primary">GitLab</p>
                    <p className="text-[10px] text-text-muted">Connect via OAuth &middot; Supports GitLab.com and self-hosted</p>
                  </div>
                  <span className="text-[10px] text-accent-bright font-medium">Connect &rarr;</span>
                </button>
              </motion.div>
            )}

            {step === 'select-repo' && (
              <motion.div key="select-repo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={github.avatarUrl || ''}
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-text-secondary">Signed in as <span className="text-text-primary font-medium">{github.username}</span></span>
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={repoSearch}
                    onChange={e => setRepoSearch(e.target.value)}
                    placeholder="Search repositories..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-bright transition-colors"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredRepos.map(repo => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                        github.selectedRepoId === repo.id
                          ? 'border-accent-bright bg-accent/10'
                          : 'border-border hover:border-border-hover hover:bg-bg-elevated/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {repo.private ? <Lock size={12} className="text-text-muted flex-shrink-0" /> : <Globe size={12} className="text-text-muted flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-text-primary truncate">{repo.fullName}</p>
                          <p className="text-[10px] text-text-muted">{repo.defaultBranch} &middot; Pushed {new Date(repo.lastPush).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {github.selectedRepoId === repo.id && <Check size={14} className="text-accent-bright flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {filteredRepos.length === 0 && (
                  <p className="text-xs text-text-muted text-center py-4">No repositories match your search.</p>
                )}
              </motion.div>
            )}

            {step === 'configure' && (
              <motion.div key="configure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {(() => {
                  const selectedRepo = github.repos.find(r => r.id === github.selectedRepoId)
                  return (
                    <>
                      <div className="p-3 rounded-lg bg-bg-elevated border border-border">
                        <div className="flex items-center gap-2">
                          <Github size={14} className="text-text-primary" />
                          <span className="text-xs font-mono text-text-primary">{selectedRepo?.fullName}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Branch to scan</label>
                          <input
                            type="text"
                            value={github.scanBranch}
                            onChange={e => updateGitHubSettings({ scanBranch: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-accent-bright transition-colors"
                          />
                        </div>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-bg-elevated/30 cursor-pointer transition-colors">
                          <div>
                            <p className="text-xs text-text-primary">Auto-scan on push</p>
                            <p className="text-[10px] text-text-muted">Automatically scan for AI systems when code is pushed</p>
                          </div>
                          <button
                            onClick={() => updateGitHubSettings({ autoScan: !github.autoScan })}
                            className={`w-9 h-5 rounded-full transition-colors relative ${github.autoScan ? 'bg-accent-bright' : 'bg-bg-elevated border border-border'}`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${github.autoScan ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                          </button>
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-bg-elevated/30 cursor-pointer transition-colors">
                          <div>
                            <p className="text-xs text-text-primary">Enable webhook notifications</p>
                            <p className="text-[10px] text-text-muted">Receive alerts when compliance-relevant changes are detected</p>
                          </div>
                          <button
                            onClick={() => updateGitHubSettings({ webhookEnabled: !github.webhookEnabled })}
                            className={`w-9 h-5 rounded-full transition-colors relative ${github.webhookEnabled ? 'bg-accent-bright' : 'bg-bg-elevated border border-border'}`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${github.webhookEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                          </button>
                        </label>
                      </div>

                      <button
                        onClick={handleStartScan}
                        className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors"
                      >
                        Start Initial Scan &rarr;
                      </button>
                    </>
                  )
                })()}
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 text-center space-y-4">
                <Loader2 size={24} className="text-accent-bright animate-spin mx-auto" />
                <div>
                  <p className="text-sm text-text-primary font-medium">Scanning repository...</p>
                  <p className="text-[10px] text-text-muted mt-1">Detecting AI systems, models, and input schemas</p>
                </div>
                <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-bright rounded-full"
                    animate={{ width: `${Math.min(scanProgress, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-[10px] font-mono text-text-muted">{Math.min(Math.round(scanProgress), 100)}%</p>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-risk-green/15 flex items-center justify-center mx-auto">
                  <Check size={20} className="text-risk-green" />
                </div>
                <div>
                  <p className="text-sm text-text-primary font-medium">Scan Complete</p>
                  <p className="text-[10px] text-text-muted mt-1">4 AI systems detected in your repository</p>
                </div>
                <div className="text-left space-y-1 p-3 rounded-lg bg-bg-elevated border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-text-primary">resume_screener.py</span>
                    <span className="text-risk-high text-[10px]">HIGH RISK</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-text-primary">contract_analyzer.ts</span>
                    <span className="text-risk-high text-[10px]">HIGH RISK</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-text-primary">chat_agent.ts</span>
                    <span className="text-risk-amber text-[10px]">LIMITED RISK</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-text-primary">fraud_detector.py</span>
                    <span className="text-risk-high text-[10px]">HIGH RISK</span>
                  </div>
                </div>
                <button
                  onClick={handleDone}
                  className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors"
                >
                  View Systems &rarr;
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
