import type { SystemMetrics, MetricAlert } from '@/types'

function generateSparkline(base: number, variance: number, count: number): number[] {
  const data: number[] = []
  let current = base
  for (let i = 0; i < count; i++) {
    current += (Math.random() - 0.5) * variance * 2
    current = Math.max(0, Math.min(100, current))
    data.push(Math.round(current * 10) / 10)
  }
  return data
}

const resumeScreenerAlerts: MetricAlert[] = [
  { id: 'ma-1', timestamp: '2026-03-31T14:22:00Z', eventType: 'Output drift detected', severity: 'warning', status: 'active' },
  { id: 'ma-2', timestamp: '2026-03-29T09:15:00Z', eventType: 'Override rate spike', severity: 'critical', status: 'acknowledged' },
  { id: 'ma-3', timestamp: '2026-03-25T16:40:00Z', eventType: 'Schema change detected', severity: 'info', status: 'resolved' },
]

const contractAnalyzerAlerts: MetricAlert[] = [
  { id: 'ma-4', timestamp: '2026-04-01T08:30:00Z', eventType: 'Input validation warning', severity: 'info', status: 'active' },
  { id: 'ma-5', timestamp: '2026-03-28T11:00:00Z', eventType: 'Model version update', severity: 'info', status: 'resolved' },
]

const chatSupportAlerts: MetricAlert[] = [
  { id: 'ma-6', timestamp: '2026-03-30T22:10:00Z', eventType: 'Latency threshold exceeded', severity: 'warning', status: 'resolved' },
]

const fraudDetectorAlerts: MetricAlert[] = [
  { id: 'ma-7', timestamp: '2026-04-01T03:45:00Z', eventType: 'Bias metric threshold breach', severity: 'critical', status: 'active' },
  { id: 'ma-8', timestamp: '2026-03-31T18:20:00Z', eventType: 'Output drift detected', severity: 'warning', status: 'active' },
  { id: 'ma-9', timestamp: '2026-03-27T07:00:00Z', eventType: 'Training data update', severity: 'info', status: 'resolved' },
  { id: 'ma-10', timestamp: '2026-03-24T14:30:00Z', eventType: 'Override rate anomaly', severity: 'warning', status: 'acknowledged' },
]

export const systemMetrics: Record<string, SystemMetrics> = {
  'resume-screener': {
    healthScore: 72,
    humanOverrideRate: generateSparkline(15, 5, 30),
    inputSchemaChanges: generateSparkline(2, 2, 30),
    outputDriftScore: generateSparkline(8, 4, 30),
    incidents: generateSparkline(3, 2, 30),
    alertLog: resumeScreenerAlerts,
  },
  'contract-analyzer': {
    healthScore: 88,
    humanOverrideRate: generateSparkline(8, 3, 30),
    inputSchemaChanges: generateSparkline(1, 1, 30),
    outputDriftScore: generateSparkline(4, 2, 30),
    incidents: generateSparkline(1, 1, 30),
    alertLog: contractAnalyzerAlerts,
  },
  'chat-support': {
    healthScore: 95,
    humanOverrideRate: generateSparkline(5, 2, 30),
    inputSchemaChanges: generateSparkline(0.5, 0.5, 30),
    outputDriftScore: generateSparkline(2, 1, 30),
    incidents: generateSparkline(0.5, 0.5, 30),
    alertLog: chatSupportAlerts,
  },
  'fraud-detector': {
    healthScore: 58,
    humanOverrideRate: generateSparkline(22, 8, 30),
    inputSchemaChanges: generateSparkline(4, 3, 30),
    outputDriftScore: generateSparkline(14, 6, 30),
    incidents: generateSparkline(5, 3, 30),
    alertLog: fraudDetectorAlerts,
  },
}
