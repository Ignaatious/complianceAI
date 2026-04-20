export type RiskLevel = 'HIGH' | 'LIMITED' | 'MINIMAL'

export type AlertSeverity = 'critical' | 'warning' | 'info'

export type AlertStatus = 'active' | 'acknowledged' | 'resolved'

export type UserRole = 'admin' | 'developer'

export type SystemTab = 'overview' | 'checklist' | 'monitoring' | 'documentation' | 'history'

export interface ChecklistItem {
  id: string
  label: string
  description: string
  completed: boolean
  mandatory: boolean
}

export interface ChecklistCategory {
  id: string
  name: string
  articleRef: string
  items: ChecklistItem[]
}

export interface DetectedField {
  label: string
  value: string
  sensitive?: boolean
}

export interface AISystem {
  id: string
  name: string
  filePath: string
  description: string
  riskLevel: RiskLevel
  complianceScore: number
  purpose: string
  model: string
  inputFields: DetectedField[]
  overridePath: string | null
  sourceFile: string
  lastScanned: string
  checklist: ChecklistCategory[]
  metrics: SystemMetrics
  owner: string
}

export interface SystemMetrics {
  healthScore: number
  humanOverrideRate: number[]
  inputSchemaChanges: number[]
  outputDriftScore: number[]
  incidents: number[]
  alertLog: MetricAlert[]
}

export interface MetricAlert {
  id: string
  timestamp: string
  eventType: string
  severity: AlertSeverity
  status: AlertStatus
}

export interface Alert {
  id: string
  systemIds: string[]
  systemNames: string[]
  title: string
  description: string
  whatChanged: string
  actions: string[]
  severity: AlertSeverity
  status: AlertStatus
  createdAt: string
  deadline: string | null
  assignee: string | null
}

export interface NextAction {
  id: string
  title: string
  systemName: string
  deadline: string
  urgency: 'critical' | 'high' | 'medium'
}

export interface TeamMember {
  id: string
  name: string
  role: string
}

export interface GitHubRepo {
  id: string
  fullName: string
  url: string
  defaultBranch: string
  private: boolean
  lastPush: string
}

export interface GitHubConnection {
  connected: boolean
  username: string | null
  avatarUrl: string | null
  accessToken: string | null
  repos: GitHubRepo[]
  selectedRepoId: string | null
  scanBranch: string
  autoScan: boolean
  webhookEnabled: boolean
}
