// ============================
// VeriAI — Review Queue Page
// ============================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  ClipboardList, AlertTriangle, CheckCircle2, XCircle, Clock,
  MessageSquare, FileText, Eye, Search, Filter, ChevronRight,
  AlertCircle, RefreshCw, Send, Shield, ExternalLink
} from 'lucide-react';

export default function ReviewQueue() {
  const { applications, currentUser, resolveFinding, addReviewEntry, addAuditEvent, updateApplication } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState<{ type: string; findingId?: string; appId: string } | null>(null);
  const [actionComment, setActionComment] = useState('');

  // Items that need review
  const reviewItems = applications
    .filter(a => a.status !== 'draft' && a.status !== 'decision_recorded')
    .map(a => ({
      ...a,
      pendingFindings: a.findings.filter(f => f.reviewStatus === 'pending').length,
      criticalFindings: a.findings.filter(f => f.reviewStatus === 'pending' && (f.severity === 'critical' || f.severity === 'high')).length,
      missingDocs: a.complianceResults.filter(r => r.status === 'deficiency' || r.status === 'not_verified').length,
    }))
    .filter(a => {
      if (filter === 'all') return true;
      if (filter === 'high_risk') return a.riskLevel === 'high' || a.riskLevel === 'critical';
      if (filter === 'missing_docs') return a.missingDocs > 0;
      if (filter === 'mismatch') return a.findings.some(f => f.category === 'Document Mismatch' && f.reviewStatus === 'pending');
      if (filter === 'compliance') return a.complianceResults.some(r => r.status === 'deficiency');
      if (filter === 'inspection') return a.findings.some(f => f.category === 'Infrastructure' && f.reviewStatus === 'pending');
      if (filter === 'ready') return a.findings.filter(f => f.reviewStatus === 'pending').length === 0 && a.status === 'under_review';
      return true;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  const selectedApp = selectedAppId ? applications.find(a => a.id === selectedAppId) : null;

  const handleAction = (type: string) => {
    if (!showActionModal) return;
    const { appId, findingId } = showActionModal;

    const entry = {
      id: `rh-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reviewer: currentUser.name,
      action: type as any,
      actionLabel: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      comment: actionComment,
      findingId,
    };
    addReviewEntry(appId, entry);

    const auditEvent = {
      id: `ae-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorRole: currentUser.roleLabel,
      event: entry.actionLabel,
      eventType: 'review',
      resource: findingId ? 'Finding' : 'Application',
      resourceId: findingId || appId,
      outcome: 'Success',
      details: actionComment,
      evidenceRef: '',
    };
    addAuditEvent(appId, auditEvent);

    if (type === 'mark_resolved' && findingId) {
      resolveFinding(appId, findingId, currentUser.name);
    }

    if (type === 'record_decision') {
      updateApplication(appId, { status: 'decision_recorded' });
    }

    if (type === 'ready_for_decision') {
      updateApplication(appId, { status: 'under_review' });
    }

    setShowActionModal(null);
    setActionComment('');
  };

  const filterOptions = [
    { value: 'all', label: 'All Cases', count: reviewItems.length },
    { value: 'high_risk', label: 'High Risk', count: reviewItems.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length },
    { value: 'missing_docs', label: 'Missing Documents', count: reviewItems.filter(a => a.missingDocs > 0).length },
    { value: 'mismatch', label: 'Record Mismatch', count: reviewItems.filter(a => a.findings.some(f => f.category === 'Document Mismatch' && f.reviewStatus === 'pending')).length },
    { value: 'compliance', label: 'Compliance Issues', count: reviewItems.filter(a => a.complianceResults.some(r => r.status === 'deficiency')).length },
    { value: 'inspection', label: 'Inspection Needed', count: reviewItems.filter(a => a.findings.some(f => f.category === 'Infrastructure' && f.reviewStatus === 'pending')).length },
    { value: 'ready', label: 'Ready for Decision', count: reviewItems.filter(a => a.findings.filter(f => f.reviewStatus === 'pending').length === 0 && a.status === 'under_review').length },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Review Queue</h1>
        <p className="page-subtitle">Examine verification findings, manage reviewer actions and track application review progress.</p>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            className={`filter-chip ${filter === opt.value ? 'active' : ''}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
            <span style={{ background: filter === opt.value ? 'var(--color-primary)' : 'var(--color-border)', color: filter === opt.value ? 'white' : 'var(--color-text-secondary)', borderRadius: 'var(--radius-full)', padding: '0 6px', fontSize: 11, fontWeight: 600 }}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '380px 1fr' : '1fr', gap: 20 }}>
        {/* Queue List */}
        <div className="card" style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
          <div className="card-header">
            <span className="card-title">Cases ({reviewItems.length})</span>
          </div>
          <div>
            {reviewItems.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <CheckCircle2 size={32} style={{ color: 'var(--color-success)', margin: '0 auto 12px' }} />
                <div className="empty-state-title">No items in queue</div>
              </div>
            ) : (
              reviewItems.map(app => (
                <div
                  key={app.id}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer',
                    background: selectedAppId === app.id ? 'var(--color-bg-active)' : 'transparent',
                    borderLeft: app.criticalFindings > 0 ? '3px solid var(--color-danger)' : app.pendingFindings > 0 ? '3px solid var(--color-warning)' : '3px solid transparent',
                  }}
                  onClick={() => setSelectedAppId(app.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{app.institutionName}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{app.applicationNumber.split('/').pop()} • {app.categoryLabel}</div>
                    </div>
                    <span className={`badge badge-dot ${app.riskLevel === 'low' ? 'badge-success' : app.riskLevel === 'moderate' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: 10 }}>
                      {app.riskScore}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {app.pendingFindings > 0 && <span className="badge badge-warning" style={{ fontSize: 10 }}>{app.pendingFindings} findings</span>}
                    {app.missingDocs > 0 && <span className="badge badge-danger" style={{ fontSize: 10 }}>{app.missingDocs} deficiencies</span>}
                    {app.assignedReviewer && <span className="badge badge-neutral" style={{ fontSize: 10 }}>{app.assignedReviewer}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Review Workspace */}
        {selectedApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* App Header */}
            <div className="card">
              <div className="card-body" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedApp.institutionName}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{selectedApp.applicationNumber} • {selectedApp.categoryLabel}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/app/applications/${selectedApp.id}`)}>
                      <Eye size={14} /> Full Details
                    </button>
                    <button className="btn btn-accent btn-sm" onClick={() => setShowActionModal({ type: 'ready_for_decision', appId: selectedApp.id })}>
                      <Shield size={14} /> Mark Ready
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowActionModal({ type: 'record_decision', appId: selectedApp.id })}>
                      <CheckCircle2 size={14} /> Record Decision
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  <div style={{ fontSize: 13 }}><span style={{ color: 'var(--color-text-tertiary)' }}>Risk Score:</span> <strong style={{ color: selectedApp.riskScore > 50 ? 'var(--color-danger)' : 'var(--color-success)' }}>{selectedApp.riskScore}</strong></div>
                  <div style={{ fontSize: 13 }}><span style={{ color: 'var(--color-text-tertiary)' }}>Compliance:</span> <strong>{selectedApp.complianceScore}%</strong></div>
                  <div style={{ fontSize: 13 }}><span style={{ color: 'var(--color-text-tertiary)' }}>Progress:</span> <strong>{selectedApp.verificationProgress}%</strong></div>
                  <div style={{ fontSize: 13 }}><span style={{ color: 'var(--color-text-tertiary)' }}>Documents:</span> <strong>{selectedApp.documents.length}</strong></div>
                </div>
              </div>
            </div>

            {/* Findings */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Verification Findings ({selectedApp.findings.length})</span>
              </div>
              <div>
                {selectedApp.findings.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No findings recorded</div>
                ) : (
                  selectedApp.findings.map(f => (
                    <div key={f.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                          {f.severity === 'critical' ? <XCircle size={16} style={{ color: 'var(--color-danger)' }} /> :
                           f.severity === 'high' ? <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} /> :
                           <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{f.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{f.category} • {f.verificationMethod}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className={`badge ${f.severity === 'critical' || f.severity === 'high' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{f.severity.toUpperCase()}</span>
                          <span className={`badge ${f.reviewStatus === 'resolved' ? 'badge-success' : f.reviewStatus === 'examined' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: 10 }}>{f.reviewStatus}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6, padding: '6px 10px', background: 'var(--color-bg)', borderRadius: 6 }}>{f.evidence}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-primary)', marginBottom: 8 }}><strong>Action:</strong> {f.recommendedAction}</div>
                      {f.reviewStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-primary btn-sm" style={{ fontSize: 11, height: 28 }} onClick={() => { resolveFinding(selectedApp.id, f.id, currentUser.name); addAuditEvent(selectedApp.id, { id: `ae-${Date.now()}`, timestamp: new Date().toISOString(), actor: currentUser.name, actorRole: currentUser.roleLabel, event: 'Finding resolved', eventType: 'resolve', resource: 'Finding', resourceId: f.id, outcome: 'Success', details: 'Resolved via review queue', evidenceRef: '' }); }}>
                            <CheckCircle2 size={12} /> Resolve
                          </button>
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: 11, height: 28 }} onClick={() => setShowActionModal({ type: 'comment', findingId: f.id, appId: selectedApp.id })}>
                            <MessageSquare size={12} /> Comment
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, height: 28 }} onClick={() => setShowActionModal({ type: 'request_docs', findingId: f.id, appId: selectedApp.id })}>
                            <Send size={12} /> Request Docs
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Review History */}
            {selectedApp.reviewHistory.length > 0 && (
              <div className="card">
                <div className="card-header"><span className="card-title">Review History</span></div>
                <div className="card-body">
                  <div className="timeline">
                    {selectedApp.reviewHistory.slice().reverse().map(r => (
                      <div key={r.id} className="timeline-item">
                        <div className="timeline-dot active" />
                        <div className="timeline-content">
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.actionLabel}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.comment}</div>
                          <div className="timeline-time">{r.reviewer} • {new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="modal-overlay" onClick={() => setShowActionModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{showActionModal.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              <button className="modal-close" onClick={() => setShowActionModal(null)}><XCircle size={18} /></button>
            </div>
            <div className="modal-body">
              {showActionModal.type === 'record_decision' && (
                <div style={{ padding: 12, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                  <strong>⚠ Demo Decision:</strong> This records a simulated decision for demonstration purposes. In production, only authorized officials can record statutory decisions.
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Comment / Reason <span className="required">*</span></label>
                <textarea className="form-textarea" rows={4} value={actionComment} onChange={e => setActionComment(e.target.value)} placeholder="Provide your comment or reason..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowActionModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={!actionComment.trim()} onClick={() => handleAction(showActionModal.type)}>
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
