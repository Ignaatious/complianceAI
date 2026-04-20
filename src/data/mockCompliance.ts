import type { ChecklistCategory } from '@/types'

export const resumeScreenerChecklist: ChecklistCategory[] = [
  {
    id: 'doc-rs',
    name: 'System Documentation',
    articleRef: 'Article 11',
    items: [
      { id: 'doc-rs-1', label: 'System purpose and intended use documented', description: 'Clear description of what the system does and its intended context of use', completed: true, mandatory: true },
      { id: 'doc-rs-2', label: 'Technical architecture documented', description: 'Model architecture, training methodology, and deployment infrastructure', completed: true, mandatory: true },
      { id: 'doc-rs-3', label: 'Input/output specifications defined', description: 'Data formats, expected inputs, and output schema documented', completed: true, mandatory: true },
      { id: 'doc-rs-4', label: 'Performance metrics and benchmarks recorded', description: 'Accuracy, precision, recall, and fairness metrics on test datasets', completed: false, mandatory: true },
      { id: 'doc-rs-5', label: 'Known limitations documented', description: 'Edge cases, failure modes, and scenarios where the system may underperform', completed: false, mandatory: false },
    ],
  },
  {
    id: 'data-rs',
    name: 'Data Governance',
    articleRef: 'Article 10',
    items: [
      { id: 'data-rs-1', label: 'Training data sources documented', description: 'Origin, collection method, and licensing of all training data', completed: true, mandatory: true },
      { id: 'data-rs-2', label: 'Bias assessment completed', description: 'Statistical analysis of training data for demographic bias', completed: true, mandatory: true },
      { id: 'data-rs-3', label: 'Data retention policy defined', description: 'How long input data is stored and when it is deleted', completed: false, mandatory: true },
      { id: 'data-rs-4', label: 'Personal data handling documented', description: 'GDPR-compliant processing records for personal data in inputs', completed: true, mandatory: true },
    ],
  },
  {
    id: 'oversight-rs',
    name: 'Human Oversight',
    articleRef: 'Article 14',
    items: [
      { id: 'oversight-rs-1', label: 'Human review process defined', description: 'Who reviews outputs and under what conditions', completed: true, mandatory: true },
      { id: 'oversight-rs-2', label: 'Override mechanism implemented', description: 'Users can override or reject system decisions', completed: true, mandatory: true },
      { id: 'oversight-rs-3', label: 'Escalation path documented', description: 'Clear process for escalating edge cases to human reviewers', completed: false, mandatory: true },
    ],
  },
  {
    id: 'transparency-rs',
    name: 'Transparency',
    articleRef: 'Article 13',
    items: [
      { id: 'transparency-rs-1', label: 'User notification implemented', description: 'Users are informed they are interacting with an AI system', completed: true, mandatory: true },
      { id: 'transparency-rs-2', label: 'Decision explanation capability', description: 'System can provide reasons for its outputs', completed: false, mandatory: true },
      { id: 'transparency-rs-3', label: 'Logging and audit trail active', description: 'All decisions are logged with timestamps and input data references', completed: true, mandatory: false },
    ],
  },
  {
    id: 'monitoring-rs',
    name: 'Post-Market Monitoring',
    articleRef: 'Article 72',
    items: [
      { id: 'monitoring-rs-1', label: 'Performance monitoring active', description: 'Real-time tracking of accuracy and drift metrics', completed: true, mandatory: true },
      { id: 'monitoring-rs-2', label: 'Incident reporting process defined', description: 'How to report and track serious incidents', completed: false, mandatory: true },
      { id: 'monitoring-rs-3', label: 'Regular review schedule set', description: 'Periodic reassessment of system compliance and performance', completed: false, mandatory: false },
    ],
  },
]

export const contractAnalyzerChecklist: ChecklistCategory[] = [
  {
    id: 'doc-ca',
    name: 'System Documentation',
    articleRef: 'Article 11',
    items: [
      { id: 'doc-ca-1', label: 'System purpose and intended use documented', description: 'Clear description of contract analysis scope and use cases', completed: true, mandatory: true },
      { id: 'doc-ca-2', label: 'Technical architecture documented', description: 'NLP model details, preprocessing pipeline, and infrastructure', completed: true, mandatory: true },
      { id: 'doc-ca-3', label: 'Input/output specifications defined', description: 'Supported contract formats and output schema', completed: true, mandatory: true },
      { id: 'doc-ca-4', label: 'Performance metrics and benchmarks recorded', description: 'Clause detection accuracy and extraction precision metrics', completed: true, mandatory: true },
      { id: 'doc-ca-5', label: 'Known limitations documented', description: 'Language limitations, unsupported contract types, ambiguity handling', completed: true, mandatory: false },
    ],
  },
  {
    id: 'data-ca',
    name: 'Data Governance',
    articleRef: 'Article 10',
    items: [
      { id: 'data-ca-1', label: 'Training data sources documented', description: 'Legal corpus sourcing and licensing documentation', completed: true, mandatory: true },
      { id: 'data-ca-2', label: 'Bias assessment completed', description: 'Analysis for jurisdiction and language bias in training data', completed: true, mandatory: true },
      { id: 'data-ca-3', label: 'Data retention policy defined', description: 'Contract data lifecycle and deletion schedule', completed: true, mandatory: true },
      { id: 'data-ca-4', label: 'Personal data handling documented', description: 'PII redaction and processing records', completed: true, mandatory: true },
    ],
  },
  {
    id: 'oversight-ca',
    name: 'Human Oversight',
    articleRef: 'Article 14',
    items: [
      { id: 'oversight-ca-1', label: 'Human review process defined', description: 'Legal team review requirements for flagged clauses', completed: true, mandatory: true },
      { id: 'oversight-ca-2', label: 'Override mechanism implemented', description: 'Lawyers can override clause classifications', completed: true, mandatory: true },
      { id: 'oversight-ca-3', label: 'Escalation path documented', description: 'Process for ambiguous or high-stakes contract terms', completed: true, mandatory: true },
    ],
  },
  {
    id: 'transparency-ca',
    name: 'Transparency',
    articleRef: 'Article 13',
    items: [
      { id: 'transparency-ca-1', label: 'User notification implemented', description: 'Users aware AI is assisting contract analysis', completed: true, mandatory: true },
      { id: 'transparency-ca-2', label: 'Decision explanation capability', description: 'Clause-level reasoning and confidence scores shown', completed: true, mandatory: true },
      { id: 'transparency-ca-3', label: 'Logging and audit trail active', description: 'Full analysis history with version tracking', completed: true, mandatory: false },
    ],
  },
  {
    id: 'monitoring-ca',
    name: 'Post-Market Monitoring',
    articleRef: 'Article 72',
    items: [
      { id: 'monitoring-ca-1', label: 'Performance monitoring active', description: 'Extraction accuracy tracked across contract types', completed: true, mandatory: true },
      { id: 'monitoring-ca-2', label: 'Incident reporting process defined', description: 'Misclassification reporting and tracking system', completed: false, mandatory: true },
      { id: 'monitoring-ca-3', label: 'Regular review schedule set', description: 'Quarterly compliance and performance reviews', completed: false, mandatory: false },
    ],
  },
]

export const chatSupportChecklist: ChecklistCategory[] = [
  {
    id: 'doc-cs',
    name: 'System Documentation',
    articleRef: 'Article 11',
    items: [
      { id: 'doc-cs-1', label: 'System purpose and intended use documented', description: 'Customer support chatbot scope and capabilities', completed: true, mandatory: true },
      { id: 'doc-cs-2', label: 'Technical architecture documented', description: 'LLM integration, prompt engineering, and guardrails', completed: true, mandatory: true },
      { id: 'doc-cs-3', label: 'Input/output specifications defined', description: 'Message formats and response templates', completed: true, mandatory: true },
      { id: 'doc-cs-4', label: 'Performance metrics recorded', description: 'Response accuracy and customer satisfaction scores', completed: true, mandatory: true },
    ],
  },
  {
    id: 'transparency-cs',
    name: 'Transparency',
    articleRef: 'Article 52',
    items: [
      { id: 'transparency-cs-1', label: 'AI disclosure to users', description: 'Users clearly informed they are chatting with an AI', completed: true, mandatory: true },
      { id: 'transparency-cs-2', label: 'Handoff to human available', description: 'Users can request transfer to human agent at any time', completed: true, mandatory: true },
      { id: 'transparency-cs-3', label: 'Response attribution clear', description: 'AI-generated vs. template responses are distinguishable', completed: true, mandatory: false },
    ],
  },
  {
    id: 'monitoring-cs',
    name: 'Post-Market Monitoring',
    articleRef: 'Article 72',
    items: [
      { id: 'monitoring-cs-1', label: 'Performance monitoring active', description: 'Response quality and escalation rates tracked', completed: true, mandatory: true },
      { id: 'monitoring-cs-2', label: 'Feedback loop implemented', description: 'Customer ratings feed into improvement cycle', completed: true, mandatory: true },
    ],
  },
]

export const fraudDetectorChecklist: ChecklistCategory[] = [
  {
    id: 'doc-fd',
    name: 'System Documentation',
    articleRef: 'Article 11',
    items: [
      { id: 'doc-fd-1', label: 'System purpose and intended use documented', description: 'Transaction fraud detection scope and thresholds', completed: true, mandatory: true },
      { id: 'doc-fd-2', label: 'Technical architecture documented', description: 'Ensemble model architecture and feature engineering', completed: true, mandatory: true },
      { id: 'doc-fd-3', label: 'Input/output specifications defined', description: 'Transaction data schema and risk score output format', completed: false, mandatory: true },
      { id: 'doc-fd-4', label: 'Performance metrics recorded', description: 'False positive rate, detection rate, and latency metrics', completed: false, mandatory: true },
      { id: 'doc-fd-5', label: 'Known limitations documented', description: 'New fraud pattern detection lag and cross-border limitations', completed: false, mandatory: false },
    ],
  },
  {
    id: 'data-fd',
    name: 'Data Governance',
    articleRef: 'Article 10',
    items: [
      { id: 'data-fd-1', label: 'Training data sources documented', description: 'Transaction history sourcing and labeling methodology', completed: true, mandatory: true },
      { id: 'data-fd-2', label: 'Bias assessment completed', description: 'Geographic and demographic bias analysis in fraud labels', completed: false, mandatory: true },
      { id: 'data-fd-3', label: 'Data retention policy defined', description: 'Transaction data storage duration and anonymization schedule', completed: false, mandatory: true },
      { id: 'data-fd-4', label: 'Personal data handling documented', description: 'Financial data GDPR processing records', completed: true, mandatory: true },
    ],
  },
  {
    id: 'oversight-fd',
    name: 'Human Oversight',
    articleRef: 'Article 14',
    items: [
      { id: 'oversight-fd-1', label: 'Human review process defined', description: 'Analyst review thresholds and investigation workflow', completed: true, mandatory: true },
      { id: 'oversight-fd-2', label: 'Override mechanism implemented', description: 'Analysts can unblock flagged transactions', completed: false, mandatory: true },
      { id: 'oversight-fd-3', label: 'Escalation path documented', description: 'High-value transaction escalation to senior analysts', completed: false, mandatory: true },
    ],
  },
  {
    id: 'transparency-fd',
    name: 'Transparency',
    articleRef: 'Article 13',
    items: [
      { id: 'transparency-fd-1', label: 'User notification implemented', description: 'Customers informed about automated transaction screening', completed: false, mandatory: true },
      { id: 'transparency-fd-2', label: 'Decision explanation capability', description: 'Risk score breakdown and contributing factors shown to analysts', completed: false, mandatory: true },
      { id: 'transparency-fd-3', label: 'Logging and audit trail active', description: 'All fraud decisions logged with full feature context', completed: true, mandatory: false },
    ],
  },
  {
    id: 'monitoring-fd',
    name: 'Post-Market Monitoring',
    articleRef: 'Article 72',
    items: [
      { id: 'monitoring-fd-1', label: 'Performance monitoring active', description: 'Real-time false positive and detection rate tracking', completed: true, mandatory: true },
      { id: 'monitoring-fd-2', label: 'Incident reporting process defined', description: 'Missed fraud and wrongful block reporting workflow', completed: false, mandatory: true },
      { id: 'monitoring-fd-3', label: 'Regular review schedule set', description: 'Monthly model performance and bias review cadence', completed: false, mandatory: false },
    ],
  },
]
