import { useState } from 'react'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { ConnectRepoModal } from '@/components/ConnectRepoModal'
import { useRole } from '@/context/RoleContext'
import {
  Github, Unplug, RefreshCw, Check,
  Bell, Users, ExternalLink, Lock, Globe, Trash2
} from 'lucide-react'

export function Settings() {
  const { github, disconnectGitHub, updateGitHubSettings } = useRole()
  const [modalOpen, setModalOpen] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [webhookSecret, _setWebhookSecret] = useState('whsec_xxxxxxxxxxxxxxxxxxxxxxxx')
  const [showSecret, setShowSecret] = useState(false)

  const selectedRepo = github.repos.find(r => r.id === github.selectedRepoId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
        <p className="text-xs text-text-muted mt-0.5">Integration and configuration</p>
      </div>

      {/* GitHub Integration */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Github size={16} className="text-text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">GitHub Integration</h2>
          </div>
          {github.connected ? (
            <Badge className="!bg-risk-green/15 !text-risk-green !border-risk-green/30">
              <Check size={10} className="mr-1" /> Connected
            </Badge>
          ) : (
            <Badge>Not connected</Badge>
          )}
        </div>

        {!github.connected ? (
          <div className="space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed">
              Connect your GitHub account to automatically detect AI systems in your codebase.
              Compli will scan for model usage, input schemas, and generate compliance profiles.
            </p>
            <div className="p-4 rounded-lg bg-bg-elevated border border-border">
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Permissions required</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Check size={10} className="text-risk-green" /> Read access to repository contents
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Check size={10} className="text-risk-green" /> Read access to metadata
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Check size={10} className="text-risk-green" /> Webhook event delivery (optional)
                </div>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium transition-colors"
            >
              <Github size={14} /> Connect GitHub Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Account info */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated border border-border">
              <div className="flex items-center gap-3">
                <img src={github.avatarUrl || ''} alt="" className="w-8 h-8 rounded-full border border-border" />
                <div>
                  <p className="text-xs font-medium text-text-primary">{github.username}</p>
                  <p className="text-[10px] text-text-muted">GitHub Account</p>
                </div>
              </div>
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="flex items-center gap-1 text-[11px] text-text-muted hover:text-risk-high px-2 py-1 rounded border border-border hover:border-risk-high/30 transition-colors"
              >
                <Unplug size={10} /> Disconnect
              </button>
            </div>

            {/* Disconnect confirmation */}
            {showDisconnectConfirm && (
              <div className="p-3 rounded-lg bg-risk-high/5 border border-risk-high/20">
                <p className="text-xs text-text-primary mb-2">Disconnect GitHub? This will stop automatic scanning and webhook notifications.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { disconnectGitHub(); setShowDisconnectConfirm(false) }}
                    className="flex items-center gap-1 text-[11px] text-white bg-risk-high hover:bg-risk-high/80 px-3 py-1.5 rounded transition-colors"
                  >
                    <Trash2 size={10} /> Disconnect
                  </button>
                  <button
                    onClick={() => setShowDisconnectConfirm(false)}
                    className="text-[11px] text-text-secondary hover:text-text-primary px-3 py-1.5 rounded border border-border transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Connected repo */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Connected Repository</p>
              {selectedRepo ? (
                <div className="p-3 rounded-lg border border-accent-bright/20 bg-accent/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedRepo.private ? <Lock size={12} className="text-text-muted" /> : <Globe size={12} className="text-text-muted" />}
                      <span className="text-xs font-mono text-text-primary">{selectedRepo.fullName}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setModalOpen(true)}
                        className="text-[10px] text-accent-bright hover:underline"
                      >
                        Change
                      </button>
                      <a
                        href={selectedRepo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-text-muted hover:text-accent-bright flex items-center gap-0.5"
                      >
                        <ExternalLink size={9} /> Open
                      </a>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">
                    Branch: <span className="font-mono">{github.scanBranch}</span> &middot; Last push: {new Date(selectedRepo.lastPush).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full p-3 rounded-lg border border-dashed border-border hover:border-accent-bright/30 text-xs text-text-muted hover:text-accent-bright transition-colors text-center"
                >
                  Select a repository &rarr;
                </button>
              )}
            </div>

            {/* Scan settings */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Scan Configuration</p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-primary">Branch to scan</p>
                      <p className="text-[10px] text-text-muted">Which branch to monitor for AI system changes</p>
                    </div>
                    <input
                      type="text"
                      value={github.scanBranch}
                      onChange={e => updateGitHubSettings({ scanBranch: e.target.value })}
                      className="w-28 px-2 py-1 rounded text-xs font-mono bg-bg-elevated border border-border text-text-primary focus:outline-none focus:border-accent-bright transition-colors text-right"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-bg-elevated/30 cursor-pointer transition-colors">
                  <div>
                    <p className="text-xs text-text-primary">Auto-scan on push</p>
                    <p className="text-[10px] text-text-muted">Run compliance scan automatically when code is pushed</p>
                  </div>
                  <button
                    onClick={() => updateGitHubSettings({ autoScan: !github.autoScan })}
                    className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${github.autoScan ? 'bg-accent-bright' : 'bg-bg-elevated border border-border'}`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${github.autoScan ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-bg-elevated/30 cursor-pointer transition-colors">
                  <div>
                    <p className="text-xs text-text-primary">Webhook notifications</p>
                    <p className="text-[10px] text-text-muted">Receive real-time alerts for compliance-relevant changes</p>
                  </div>
                  <button
                    onClick={() => updateGitHubSettings({ webhookEnabled: !github.webhookEnabled })}
                    className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${github.webhookEnabled ? 'bg-accent-bright' : 'bg-bg-elevated border border-border'}`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${github.webhookEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                  </button>
                </label>
              </div>
            </div>

            {/* Webhook secret (shown when enabled) */}
            {github.webhookEnabled && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Webhook Configuration</p>
                <div className="p-3 rounded-lg border border-border space-y-2">
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Webhook Secret</label>
                    <div className="flex gap-1.5">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={webhookSecret}
                        readOnly
                        className="flex-1 px-2 py-1 rounded text-xs font-mono bg-bg-elevated border border-border text-text-primary focus:outline-none"
                      />
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-[10px] text-text-muted hover:text-accent-bright px-2 py-1 rounded border border-border transition-colors"
                      >
                        {showSecret ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Add this webhook URL to your repo: <span className="font-mono text-accent-bright">https://api.compli.dev/webhooks/github</span>
                  </p>
                </div>
              </div>
            )}

            {/* Manual scan */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent-bright/30 text-xs text-text-secondary hover:text-accent-bright transition-colors">
              <RefreshCw size={12} /> Run Manual Scan
            </button>
          </div>
        )}
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Critical alerts', desc: 'Immediate notification for compliance breaches', enabled: true },
            { label: 'Weekly digest', desc: 'Summary of compliance status and pending actions', enabled: true },
            { label: 'Scan results', desc: 'Notification when repository scans complete', enabled: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-xs text-text-primary">{item.label}</p>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
              <div className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${item.enabled ? 'bg-accent-bright' : 'bg-bg-elevated border border-border'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${item.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Access & Roles */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Team & Roles</h2>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          Admins can generate compliance reports and manage system configurations.
          Developers can only fill in required inputs and confirm system profiles.
        </p>
        <div className="space-y-1.5">
          {[
            { name: 'Maria Santos', role: 'Admin', email: 'maria@acme.com' },
            { name: 'James Chen', role: 'Developer', email: 'james@acme.com' },
            { name: 'Sarah Okoye', role: 'Admin', email: 'sarah@acme.com' },
          ].map(member => (
            <div key={member.email} className="flex items-center justify-between p-2.5 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center text-[10px] font-medium text-text-secondary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs text-text-primary">{member.name}</p>
                  <p className="text-[10px] text-text-muted">{member.email}</p>
                </div>
              </div>
              <Badge className={member.role === 'Admin' ? '!bg-accent/15 !text-accent-bright !border-accent-bright/30' : ''}>
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <ConnectRepoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
