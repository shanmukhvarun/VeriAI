// ============================
// VeriAI — Core Data Types
// ============================

export type ApplicationCategory = 'eoa' | 'approval_change' | 'new_institution' | 'programme_change';
export type ApplicationStatus = 'draft' | 'submitted' | 'processing' | 'under_review' | 'decision_recorded' | 'returned';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type VerificationStatus = 'verified' | 'mismatch' | 'pending' | 'not_found' | 'unavailable' | 'manual_review';
export type ComplianceStatus = 'compliant' | 'deficiency' | 'not_verified' | 'pending' | 'not_applicable' | 'manual_review';
export type DocumentCategory = 'affidavit' | 'accreditation' | 'noc' | 'eoa_previous' | 'faculty' | 'infrastructure' | 'payment' | 'other';
export type FindingSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type ReviewAction = 'comment' | 'request_docs' | 'mark_examined' | 'mark_resolved' | 'request_reassessment' | 'recommend_verification' | 'recommend_inspection' | 'ready_for_decision' | 'record_decision';

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: string;
  state: string;
  city: string;
  address: string;
  established: number;
  approvalStatus: string;
  lastEoaYear: string;
  programmes: Programme[];
  accreditations: Accreditation[];
  contacts: Contact[];
}

export interface Programme {
  id: string;
  name: string;
  level: string;
  duration: string;
  approvedIntake: number;
  currentIntake: number;
  accreditationStatus: string;
}

export interface Accreditation {
  id: string;
  body: string;
  grade: string;
  validFrom: string;
  validTo: string;
  status: string;
}

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  category: ApplicationCategory;
  categoryLabel: string;
  status: ApplicationStatus;
  submittedDate: string;
  lastUpdated: string;
  riskScore: number;
  riskLevel: RiskLevel;
  verificationProgress: number;
  complianceScore: number;
  assignedReviewer: string;
  documents: DocumentRecord[];
  findings: Finding[];
  complianceResults: ComplianceResult[];
  auditTrail: AuditEvent[];
  institutionDetails: Record<string, string>;
  programmeDetails: Programme[];
  reviewHistory: ReviewEntry[];
}

export interface DocumentRecord {
  id: string;
  name: string;
  category: DocumentCategory;
  categoryLabel: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  extractedFields: ExtractedField[];
  verificationResult: VerificationStatus;
  verificationMethod: string;
  verificationDetails: string;
  anomalies: DocumentAnomaly[];
  hash: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  referenceNumber: string;
}

export interface ExtractedField {
  field: string;
  extractedValue: string;
  applicationValue: string;
  recordValue: string;
  matchStatus: 'match' | 'mismatch' | 'not_found' | 'pending';
  source: string;
}

export interface DocumentAnomaly {
  id: string;
  severity: FindingSeverity;
  type: string;
  description: string;
  evidence: string;
  method: string;
  recommendedAction: string;
  reviewStatus: 'pending' | 'examined' | 'resolved' | 'dismissed';
}

export interface Finding {
  id: string;
  severity: FindingSeverity;
  category: string;
  title: string;
  description: string;
  evidence: string;
  affectedDocument: string;
  verificationMethod: string;
  recommendedAction: string;
  reviewStatus: 'pending' | 'examined' | 'resolved' | 'dismissed';
  resolvedAt?: string;
  resolvedBy?: string;
  comments: string[];
}

export interface ComplianceResult {
  id: string;
  ruleId: string;
  ruleName: string;
  category: string;
  status: ComplianceStatus;
  evidence: string;
  documentRef: string;
  validatedAt: string;
  reasoning: string;
  remediation: string;
  isMandatory: boolean;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: string;
  applicableCategories: ApplicationCategory[];
  requiredEvidence: string;
  validationMethod: string;
  severity: FindingSeverity;
  isMandatory: boolean;
  effectiveDate: string;
  remediation: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  event: string;
  eventType: string;
  resource: string;
  resourceId: string;
  outcome: string;
  details: string;
  evidenceRef: string;
}

export interface ReviewEntry {
  id: string;
  timestamp: string;
  reviewer: string;
  action: ReviewAction;
  actionLabel: string;
  comment: string;
  findingId?: string;
  attachments?: string[];
}

export interface Notification {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  applicationId: string;
  applicationNumber: string;
  timestamp: string;
  read: boolean;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'verification_officer' | 'compliance_reviewer' | 'institution_rep';
  roleLabel: string;
  avatar: string;
}

export interface RiskWeights {
  missingEvidence: number;
  expiredDocuments: number;
  recordMismatch: number;
  issuerDiscrepancy: number;
  documentAnomaly: number;
  infrastructureConcern: number;
}
