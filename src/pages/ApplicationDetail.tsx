// ============================
// VeriAI — Application Detail Page
// ============================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  ArrowLeft, FileText, ShieldCheck, Building2, Brain, AlertTriangle,
  CheckCircle2, Clock, XCircle, MessageSquare, Plus, Eye,
  ChevronRight, Info, AlertCircle, HardDrive, History
} from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'documents', label: 'Document Inventory', icon: FileText },
  { id: 'records', label: 'Record Comparison', icon: Building2 },
  { id: 'findings', label: 'Verification Findings', icon: AlertTriangle },
  { id: 'compliance', label: 'Compliance Checklist', icon: Brain },
  { id: 'infrastructure', label: 'Infrastructure', icon: HardDrive },
  { id: 'timeline', label: 'Review History', icon: History },
];

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const app = useStore((s) => s.applications.find(a => a.id === id));
  const { resolveFinding, addReviewEntry, addAuditEvent, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  if (!app) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><FileText size={32} /></div>
        <div className="empty-state-title">Application not found</div>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/app/applications')}>Back to Applications</button>
      </div>
    );
  }

  const riskColor = app.riskLevel === 'low' ? 'var(--color-success)' : app.riskLevel === 'moderate' ? 'var(--color-warning)' : 'var(--color-danger)';
  const pendingFindings = app.findings.filter(f => f.reviewStatus === 'pending').length;

  const handleResolveFinding = (findingId: string) => {
    resolveFinding(app.id, findingId, currentUser.name);
    addAuditEvent(app.id, {
      id: `ae-${Date.now()}`, timestamp: new Date().toISOString(), actor: currentUser.name, actorRole: currentUser.roleLabel,
      event: 'Finding resolved', eventType: 'resolve', resource: 'Finding', resourceId: findingId,
      outcome: 'Success', details: `Finding ${findingId} marked as resolved`, evidenceRef: ''
    });
    addReviewEntry(app.id, {
      id: `rh-${Date.now()}`, timestamp: new Date().toISOString(), reviewer: currentUser.name,
      action: 'mark_resolved', actionLabel: 'Marked Finding as Resolved', comment: 'Finding resolved by reviewer.', findingId
    });
  };

  const handleAddComment = (findingId: string) => {
    if (!comment.trim()) return;
    addReviewEntry(app.id, {
      id: `rh-${Date.now()}`, timestamp: new Date().toISOString(), reviewer: currentUser.name,
      action: 'comment', actionLabel: 'Added Comment', comment, findingId
    });
    addAuditEvent(app.id, {
      id: `ae-${Date.now()}`, timestamp: new Date().toISOString(), actor: currentUser.name, actorRole: currentUser.roleLabel,
      event: 'Comment added', eventType: 'comment', resource: 'Finding', resourceId: findingId,
      outcome: 'Success', details: comment, evidenceRef: ''
    });
    setComment('');
    setShowCommentModal(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/applications')}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 className="page-title">{app.applicationNumber}</h1>
            <span className={`badge ${app.status === 'decision_recorded' ? 'badge-success' : app.status === 'under_review' ? 'badge-warning' : 'badge-primary'}`}>
              {app.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
          <p className="page-subtitle">{app.institutionName} • {app.categoryLabel}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Risk Gauge */}
          <div style={{ textAlign: 'center' }}>
            <div className="risk-gauge" style={{ '--gauge-color': riskColor, '--gauge-pct': app.riskScore } as any}>
              <div className="risk-gauge-inner">
                <div className="risk-gauge-value" style={{ color: riskColor }}>{app.riskScore}</div>
                <div className="risk-gauge-label">Risk Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card primary" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{app.verificationProgress}%</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Verification Progress</div>
        </div>
        <div className="kpi-card success" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{app.complianceScore}%</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Compliance Score</div>
        </div>
        <div className="kpi-card accent" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{app.documents.length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Documents</div>
        </div>
        <div className="kpi-card warning" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{pendingFindings}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Pending Findings</div>
        </div>
        <div className="kpi-card danger" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{app.complianceResults.filter(r => r.status === 'deficiency').length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Deficiencies</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="dashboard-grid dashboard-grid-2" style={{ gap: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Institution Details</span></div>
            <div className="card-body">
              {Object.entries(app.institutionDetails).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{key}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Application Journey</span></div>
            <div className="card-body">
              <div className="timeline">
                {app.auditTrail.slice(-8).reverse().map((event) => (
                  <div key={event.id} className="timeline-item">
                    <div className={`timeline-dot ${event.eventType === 'decision' ? 'success' : event.eventType === 'anomaly' ? 'danger' : event.eventType === 'verify' ? 'active' : ''}`} />
                    <div className="timeline-content">
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{event.event}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{event.details}</div>
                      <div className="timeline-time">{event.actor} • {new Date(event.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {app.programmeDetails.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-header"><span className="card-title">Programmes & Courses</span></div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Programme</th><th>Level</th><th>Duration</th><th>Approved Intake</th><th>Current</th><th>Accreditation</th></tr></thead>
                  <tbody>
                    {app.programmeDetails.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</td>
                        <td><span className="badge badge-neutral">{p.level}</span></td>
                        <td style={{ fontSize: 13 }}>{p.duration}</td>
                        <td style={{ fontSize: 13 }}>{p.approvedIntake}</td>
                        <td style={{ fontSize: 13 }}>{p.currentIntake}</td>
                        <td><span className={`badge ${p.accreditationStatus === 'Accredited' ? 'badge-success' : p.accreditationStatus === 'Expired' ? 'badge-danger' : 'badge-warning'}`}>{p.accreditationStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div>
          {app.documents.length === 0 ? (
            <div className="card"><div className="empty-state"><div className="empty-state-icon"><FileText size={32} /></div><div className="empty-state-title">No documents uploaded</div><div className="empty-state-text">Documents will appear here when uploaded with the application.</div></div></div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {app.documents.map(doc => (
                <div key={doc.id} className="card">
                  <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}><FileText size={20} /></div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{doc.categoryLabel} • {doc.fileType} • {doc.fileSize}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge badge-dot ${doc.verificationResult === 'verified' ? 'badge-success' : doc.verificationResult === 'mismatch' ? 'badge-danger' : 'badge-warning'}`}>
                        {doc.verificationResult.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13, marginBottom: 16 }}>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Issuer:</span> <strong>{doc.issuer}</strong></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Reference:</span> <strong>{doc.referenceNumber}</strong></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Issued:</span> <strong>{doc.issuedDate}</strong></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Expiry:</span> <strong>{doc.expiryDate || 'N/A'}</strong></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Verification:</span> <strong>{doc.verificationMethod}</strong></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Hash:</span> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{doc.hash.slice(0, 16)}...</span></div>
                    </div>
                    {doc.verificationDetails && (
                      <div style={{ padding: '10px 14px', background: doc.verificationResult === 'verified' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                        <strong>Verification Detail:</strong> {doc.verificationDetails}
                      </div>
                    )}
                    {doc.extractedFields.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Extracted Fields Comparison</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr auto', gap: '1px', background: 'var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                          <div style={{ padding: '8px 12px', background: 'var(--color-bg)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>Field</div>
                          <div style={{ padding: '8px 12px', background: 'var(--color-bg)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>Extracted</div>
                          <div style={{ padding: '8px 12px', background: 'var(--color-bg)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>Application</div>
                          <div style={{ padding: '8px 12px', background: 'var(--color-bg)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>Record</div>
                          <div style={{ padding: '8px 12px', background: 'var(--color-bg)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>Status</div>
                          {doc.extractedFields.map((field, i) => (
                            <>
                              <div key={`f-${i}`} style={{ padding: '8px 12px', background: 'var(--color-bg-card)', fontSize: 12, fontWeight: 600 }}>{field.field}</div>
                              <div style={{ padding: '8px 12px', background: 'var(--color-bg-card)', fontSize: 12, color: field.matchStatus === 'mismatch' ? 'var(--color-danger)' : 'inherit', fontWeight: field.matchStatus === 'mismatch' ? 600 : 400 }}>{field.extractedValue}</div>
                              <div style={{ padding: '8px 12px', background: 'var(--color-bg-card)', fontSize: 12 }}>{field.applicationValue}</div>
                              <div style={{ padding: '8px 12px', background: 'var(--color-bg-card)', fontSize: 12 }}>{field.recordValue}</div>
                              <div style={{ padding: '8px 12px', background: 'var(--color-bg-card)' }}>
                                {field.matchStatus === 'match' ? <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} /> :
                                 field.matchStatus === 'mismatch' ? <XCircle size={16} style={{ color: 'var(--color-danger)' }} /> :
                                 <Clock size={16} style={{ color: 'var(--color-warning)' }} />}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    )}
                    {doc.anomalies.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>⚠ Anomalies Detected</div>
                        {doc.anomalies.map(a => (
                          <div key={a.id} style={{ padding: 12, background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 8, marginBottom: 8, fontSize: 13 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <strong>{a.type}</strong>
                              <span className={`badge ${a.severity === 'critical' ? 'badge-danger' : a.severity === 'high' ? 'badge-danger' : 'badge-warning'}`}>{a.severity.toUpperCase()}</span>
                            </div>
                            <div>{a.description}</div>
                            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}><strong>Evidence:</strong> {a.evidence}</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}><strong>Method:</strong> {a.method}</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-primary)' }}><strong>Action:</strong> {a.recommendedAction}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Institutional Record Comparison</span></div>
          <div className="card-body">
            {app.documents.flatMap(d => d.extractedFields).length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}><div className="empty-state-title">No record comparisons available</div><div className="empty-state-text">Record comparisons are generated when documents are processed.</div></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Field</th><th>Application Value</th><th>Document Extracted</th><th>Institutional Record</th><th>Result</th><th>Source</th></tr></thead>
                  <tbody>
                    {app.documents.flatMap(d => d.extractedFields.map(f => ({ ...f, docName: d.name }))).map((field, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{field.field}</td>
                        <td style={{ fontSize: 13 }}>{field.applicationValue}</td>
                        <td style={{ fontSize: 13, color: field.matchStatus === 'mismatch' ? 'var(--color-danger)' : 'inherit', fontWeight: field.matchStatus === 'mismatch' ? 600 : 400 }}>{field.extractedValue}</td>
                        <td style={{ fontSize: 13 }}>{field.recordValue || '—'}</td>
                        <td>
                          <span className={`badge badge-dot ${field.matchStatus === 'match' ? 'badge-success' : field.matchStatus === 'mismatch' ? 'badge-danger' : 'badge-warning'}`}>
                            {field.matchStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{field.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'findings' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {app.findings.length === 0 ? (
            <div className="card"><div className="empty-state" style={{ padding: 40 }}><CheckCircle2 size={32} style={{ color: 'var(--color-success)', margin: '0 auto 12px' }} /><div className="empty-state-title">No findings</div></div></div>
          ) : (
            app.findings.map(finding => (
              <div key={finding.id} className="card" style={{ borderLeft: `3px solid ${finding.severity === 'critical' ? 'var(--color-danger)' : finding.severity === 'high' ? 'var(--color-danger)' : finding.severity === 'moderate' ? 'var(--color-warning)' : 'var(--color-info)'}` }}>
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={18} style={{ color: finding.severity === 'critical' || finding.severity === 'high' ? 'var(--color-danger)' : 'var(--color-warning)' }} />
                    <span className="card-title">{finding.title}</span>
                    <span className={`badge ${finding.severity === 'critical' || finding.severity === 'high' ? 'badge-danger' : 'badge-warning'}`}>{finding.severity.toUpperCase()}</span>
                  </div>
                  <span className={`badge ${finding.reviewStatus === 'resolved' ? 'badge-success' : finding.reviewStatus === 'examined' ? 'badge-info' : 'badge-warning'}`}>
                    {finding.reviewStatus.replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: 14, marginBottom: 12 }}>{finding.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, marginBottom: 16 }}>
                    <div><span style={{ color: 'var(--color-text-tertiary)' }}>Category:</span> <strong>{finding.category}</strong></div>
                    <div><span style={{ color: 'var(--color-text-tertiary)' }}>Document:</span> <strong>{finding.affectedDocument || 'N/A'}</strong></div>
                    <div><span style={{ color: 'var(--color-text-tertiary)' }}>Method:</span> <strong>{finding.verificationMethod}</strong></div>
                    <div><span style={{ color: 'var(--color-text-tertiary)' }}>Finding ID:</span> <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{finding.id}</strong></div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
                    <strong>Evidence:</strong> {finding.evidence}
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--color-primary-50)', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                    <strong>Recommended Action:</strong> {finding.recommendedAction}
                  </div>
                  {finding.comments.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Comments</div>
                      {finding.comments.map((c, i) => (
                        <div key={i} style={{ padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 6, fontSize: 13, marginBottom: 4 }}>💬 {c}</div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {finding.reviewStatus === 'pending' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleResolveFinding(finding.id)}>
                          <CheckCircle2 size={14} /> Mark Resolved
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowCommentModal(finding.id)}>
                          <MessageSquare size={14} /> Add Comment
                        </button>
                      </>
                    )}
                    {finding.reviewStatus === 'resolved' && (
                      <span style={{ fontSize: 12, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={14} /> Resolved {finding.resolvedAt ? `on ${new Date(finding.resolvedAt).toLocaleDateString()}` : ''} {finding.resolvedBy ? `by ${finding.resolvedBy}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Compliance Checklist</span></div>
          {app.complianceResults.length === 0 ? (
            <div className="card-body"><div className="empty-state" style={{ padding: 40 }}><div className="empty-state-title">No compliance results yet</div></div></div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Requirement</th><th>Category</th><th>Status</th><th>Evidence</th><th>Reasoning</th><th>Remediation</th></tr></thead>
                <tbody>
                  {app.complianceResults.map(cr => (
                    <tr key={cr.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{cr.ruleName}</div>
                        {cr.isMandatory && <span className="badge badge-danger" style={{ fontSize: 10, marginTop: 2 }}>Mandatory</span>}
                      </td>
                      <td><span className="badge badge-neutral" style={{ fontSize: 11 }}>{cr.category}</span></td>
                      <td>
                        <span className={`badge badge-dot ${cr.status === 'compliant' ? 'badge-success' : cr.status === 'deficiency' ? 'badge-danger' : cr.status === 'not_verified' ? 'badge-warning' : 'badge-neutral'}`}>
                          {cr.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, maxWidth: 200 }}>{cr.evidence}</td>
                      <td style={{ fontSize: 12, maxWidth: 200 }}>{cr.reasoning}</td>
                      <td style={{ fontSize: 12, color: cr.remediation ? 'var(--color-primary)' : 'var(--color-text-tertiary)', maxWidth: 200 }}>{cr.remediation || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Infrastructure Evidence</span></div>
          <div className="card-body">
            {app.documents.filter(d => d.category === 'infrastructure').length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}><HardDrive size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 12px' }} /><div className="empty-state-title">No infrastructure evidence uploaded</div><div className="empty-state-text">Infrastructure certificates, photographs, and floor plans will appear here.</div></div>
            ) : (
              app.documents.filter(d => d.category === 'infrastructure').map(doc => (
                <div key={doc.id} style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 10, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ fontSize: 14 }}>{doc.name}</strong>
                    <span className={`badge ${doc.verificationResult === 'verified' ? 'badge-success' : 'badge-danger'}`}>{doc.verificationResult}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{doc.verificationDetails}</div>
                  {doc.anomalies.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {doc.anomalies.map(a => (
                        <div key={a.id} style={{ padding: 8, background: 'var(--color-danger-bg)', borderRadius: 6, fontSize: 12, marginTop: 4 }}>
                          ⚠ {a.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Review History & Audit Timeline</span></div>
          <div className="card-body">
            <div className="timeline">
              {[...app.auditTrail, ...app.reviewHistory.map(r => ({
                id: r.id, timestamp: r.timestamp, actor: r.reviewer, actorRole: 'Reviewer',
                event: r.actionLabel, eventType: 'review', resource: 'Review', resourceId: r.findingId || '',
                outcome: '', details: r.comment, evidenceRef: ''
              }))].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(event => (
                <div key={event.id} className="timeline-item">
                  <div className={`timeline-dot ${event.eventType === 'decision' ? 'success' : event.eventType === 'anomaly' ? 'danger' : event.eventType === 'review' ? 'warning' : 'active'}`} />
                  <div className="timeline-content">
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{event.event}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{event.details}</div>
                    {event.outcome && <span className={`badge ${event.outcome.includes('Success') ? 'badge-success' : event.outcome.includes('Alert') || event.outcome.includes('Issues') ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: 10, marginTop: 4 }}>{event.outcome}</span>}
                    <div className="timeline-time">{event.actor} ({event.actorRole}) • {new Date(event.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="modal-overlay" onClick={() => setShowCommentModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Review Comment</span>
              <button className="modal-close" onClick={() => setShowCommentModal(null)}><XCircle size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-textarea" rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Enter your review comment..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCommentModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleAddComment(showCommentModal)}>
                <MessageSquare size={16} /> Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
