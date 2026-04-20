import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserRole, GitHubConnection, GitHubRepo } from '@/types'

const mockRepos: GitHubRepo[] = [
  { id: 'r1', fullName: 'acme-corp/ml-platform', url: 'https://github.com/acme-corp/ml-platform', defaultBranch: 'main', private: true, lastPush: '2026-04-03T10:30:00Z' },
  { id: 'r2', fullName: 'acme-corp/hiring-tools', url: 'https://github.com/acme-corp/hiring-tools', defaultBranch: 'main', private: true, lastPush: '2026-04-01T14:20:00Z' },
  { id: 'r3', fullName: 'acme-corp/legal-ai', url: 'https://github.com/acme-corp/legal-ai', defaultBranch: 'develop', private: true, lastPush: '2026-03-30T08:45:00Z' },
  { id: 'r4', fullName: 'acme-corp/support-bot', url: 'https://github.com/acme-corp/support-bot', defaultBranch: 'main', private: false, lastPush: '2026-03-28T16:00:00Z' },
  { id: 'r5', fullName: 'acme-corp/fraud-detection', url: 'https://github.com/acme-corp/fraud-detection', defaultBranch: 'main', private: true, lastPush: '2026-04-02T09:15:00Z' },
]

const defaultConnection: GitHubConnection = {
  connected: false,
  username: null,
  avatarUrl: null,
  accessToken: null,
  repos: [],
  selectedRepoId: null,
  scanBranch: 'main',
  autoScan: true,
  webhookEnabled: false,
}

interface RoleContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
  github: GitHubConnection
  connectGitHub: () => void
  disconnectGitHub: () => void
  selectRepo: (repoId: string) => void
  updateGitHubSettings: (patch: Partial<GitHubConnection>) => void
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin')
  const [github, setGitHub] = useState<GitHubConnection>(defaultConnection)

  const connectGitHub = () => {
    // Simulate OAuth callback
    setGitHub({
      connected: true,
      username: 'acme-admin',
      avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AA&backgroundColor=003399',
      accessToken: 'gho_mock_xxxxxxxxxxxxxxxxxxxx',
      repos: mockRepos,
      selectedRepoId: null,
      scanBranch: 'main',
      autoScan: true,
      webhookEnabled: false,
    })
  }

  const disconnectGitHub = () => {
    setGitHub(defaultConnection)
  }

  const selectRepo = (repoId: string) => {
    setGitHub(prev => ({ ...prev, selectedRepoId: repoId }))
  }

  const updateGitHubSettings = (patch: Partial<GitHubConnection>) => {
    setGitHub(prev => ({ ...prev, ...patch }))
  }

  return (
    <RoleContext.Provider value={{ role, setRole, github, connectGitHub, disconnectGitHub, selectRepo, updateGitHubSettings }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
