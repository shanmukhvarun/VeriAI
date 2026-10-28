// ============================
// VeriAI — Reports & Analytics Page
// ============================

import { useState } from 'react';
import { useStore } from '../store';
import { monthlyTrendData, verificationDistribution, complianceOverview } from '../data';
import {
  BarChart3, Download, Printer, FileText, TrendingUp, PieChart as PieChartIcon,
  AlertTriangle, CheckCircle2, Clock, XCircle, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Reports() {
  const applications = useStore((s) => s.applications);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports'>('analytics');

  // Compute analytics from data
  const totalFindings = applications.reduce((acc, a) => acc + a.findings.length, 0);
  const resolvedFindings = applications.reduce((acc, a) => acc + a.findings.filter(f => f.reviewStatus === 'resolved').length, 0);
  const pendingFindings = totalFindings - resolvedFindings;

  const deficiencyTypes = applications
    .flatMap(a => a.findings.filter(f => f.reviewStatus === 'pending'))
    .reduce<Record<string, number>>((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {});

  const deficiencyData = Object.entries(deficiencyTypes).map(([name, value]) => ({ name, value }));

  const statusCounts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value,
    color: name === 'decision_recorded' ? '#16A34A' : name === 'under_review' ? '#D97706' : name === 'processing' ? '#2563EB' : name === 'submitted' ? '#5145E5' : '#94A3B8'
  }));

  const app = selectedApp ? applications.find(a => a.id === selectedApp) : null;

  const printReport = () => window.print();

  const exportPDF = () => {
    // In production, use a PDF library. For demo, trigger print dialog.
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Interactive visualizations and exportable verification reports computed from application data.</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <BarChart3 size={16} style={{ marginRight: 6, verticalAlign: -3 }} /> Analytics Dashboard
        </button>
        <button className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          <FileText size={16} style={{ marginRight: 6, verticalAlign: -3 }} /> Application Reports
        </button>
      </div>

      {activeTab === 'analytics' && (
        <>
          {/* Summary Cards */}
          <div className="kpi-grid" style={{ marginBottom: 24 }}>
            <div className="kpi-card primary" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{applications.length}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Total Applications</div>
            </div>
            <div className="kpi-card success" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{resolvedFindings}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Resolved Findings</div>
            </div>
            <div className="kpi-card warning" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{pendingFindings}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Pending Findings</div>
            </div>
            <div className="kpi-card accent" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(applications.reduce((a, b) => a + b.complianceScore, 0) / Math.max(applications.filter(a => a.complianceScore > 0).length, 1))}%</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Avg Compliance Score</div>
            </div>
          </div>

          <div className="dashboard-grid dashboard-grid-2 mb-6">
            {/* Processing Volume */}
            <div className="card">
              <div className="card-header"><span className="card-title">Application Processing Volume</span></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)' }} />
                    <Bar dataKey="submitted" fill="#5145E5" radius={[4, 4, 0, 0]} name="Submitted" />
                    <Bar dataKey="verified" fill="#16A34A" radius={[4, 4, 0, 0]} name="Verified" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="card">
              <div className="card-header"><span className="card-title">Application Status Distribution</span></div>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                      {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {statusData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{item.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 'auto' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid dashboard-grid-2 mb-6">
            {/* Common Deficiencies */}
            <div className="card">
              <div className="card-header"><span className="card-title">Common Deficiency Categories</span></div>
              <div className="card-body">
                {deficiencyData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-tertiary)' }}>No pending deficiencies</div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={deficiencyData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                      <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} width={150} />
                      <Tooltip contentStyle={{ borderRadius: 10 }} />
                      <Bar dataKey="value" fill="#DC2626" radius={[0, 4, 4, 0]} name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Compliance Breakdown */}
            <div className="card">
              <div className="card-header"><span className="card-title">Compliance Category Breakdown</span></div>
              <div className="card-body">
                {complianceOverview.map((cat, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{cat.category}</span>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{cat.compliant}% compliant</span>
                    </div>
                    <div className="segmented-progress">
                      <div className="segment" style={{ flex: cat.compliant, background: 'var(--color-success)' }} />
                      <div className="segment" style={{ flex: cat.deficient, background: 'var(--color-danger)' }} />
                      <div className="segment" style={{ flex: cat.pending, background: 'var(--color-warning)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'reports' && (
        <div>
          <div className="filter-bar mb-4">
            <select className="form-select" style={{ width: 400, height: 40 }} value={selectedApp || ''} onChange={e => setSelectedApp(e.target.value || null)}>
              <option value="">Select an application to generate report...</option>
              {applications.map(a => <option key={a.id} value={a.id}>{a.applicationNumber} — {a.institutionName}</option>)}
            </select>
            {app && (
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button className="btn btn-secondary btn-sm" onClick={printReport}><Printer size={14} /> Print</button>
                <button className="btn btn-primary btn-sm" onClick={exportPDF}><Download size={14} /> Export PDF</button>
              </div>
            )}
          </div>

          {app ? (
            <div className="card" id="report-content">
              <div className="card-body" style={{ padding: 32 }}>
                {/* Report Header */}
                <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid var(--color-border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>VeriAI Verification Report</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{app.institutionName}</h2>
                  <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{app.applicationNumber} • {app.categoryLabel}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>

                {/* 1. Application Details */}
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>1. Application & Institution Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 24 }}>
                  {Object.entries(app.institutionDetails).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span><strong>{v}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Status</span><strong>{app.status.replace(/_/g, ' ')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Risk Score</span><strong style={{ color: app.riskScore > 50 ? 'var(--color-danger)' : 'var(--color-success)' }}>{app.riskScore}/100</strong>
                  </div>
                </div>

                {/* 2. Document Inventory */}
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>2. Document Inventory ({app.documents.length})</h3>
                {app.documents.length > 0 ? (
                  <table className="data-table" style={{ marginBottom: 24 }}>
                    <thead><tr><th>Document</th><th>Category</th><th>Issuer</th><th>Status</th><th>Verification</th></tr></thead>
                    <tbody>
                      {app.documents.map(d => (
                        <tr key={d.id}><td style={{ fontSize: 13 }}>{d.name}</td><td style={{ fontSize: 12 }}>{d.categoryLabel}</td><td style={{ fontSize: 12 }}>{d.issuer}</td><td><span className={`badge ${d.status === 'processed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>{d.status}</span></td><td><span className={`badge ${d.verificationResult === 'verified' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 10 }}>{d.verificationResult}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 24 }}>No documents uploaded.</p>}

                {/* 3. Findings */}
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>3. Verification Findings ({app.findings.length})</h3>
                {app.findings.map(f => (
                  <div key={f.id} style={{ padding: '12px 16px', marginBottom: 8, borderRadius: 8, border: '1px solid var(--color-border)', borderLeft: `3px solid ${f.severity === 'critical' || f.severity === 'high' ? 'var(--color-danger)' : 'var(--color-warning)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong style={{ fontSize: 13 }}>{f.title}</strong>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span className={`badge ${f.severity === 'critical' || f.severity === 'high' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{f.severity}</span>
                        <span className={`badge ${f.reviewStatus === 'resolved' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: 10 }}>{f.reviewStatus}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{f.description}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>Evidence: {f.evidence}</div>
                  </div>
                ))}
                {app.findings.length === 0 && <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 24 }}>No findings recorded.</p>}

                {/* 4. Compliance */}
                <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 24, marginBottom: 12 }}>4. Compliance Checklist</h3>
                {app.complianceResults.length > 0 ? (
                  <table className="data-table" style={{ marginBottom: 24 }}>
                    <thead><tr><th>Requirement</th><th>Status</th><th>Evidence</th><th>Remediation</th></tr></thead>
                    <tbody>
                      {app.complianceResults.map(cr => (
                        <tr key={cr.id}>
                          <td style={{ fontSize: 13, fontWeight: 500 }}>{cr.ruleName} {cr.isMandatory ? '(Mandatory)' : ''}</td>
                          <td><span className={`badge ${cr.status === 'compliant' ? 'badge-success' : cr.status === 'deficiency' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{cr.status.replace(/_/g, ' ')}</span></td>
                          <td style={{ fontSize: 12 }}>{cr.evidence}</td>
                          <td style={{ fontSize: 12, color: 'var(--color-primary)' }}>{cr.remediation || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 24 }}>No compliance results yet.</p>}

                {/* 5. Review History */}
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>5. Review History</h3>
                {app.reviewHistory.length > 0 ? app.reviewHistory.map(r => (
                  <div key={r.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                    <strong>{r.actionLabel}</strong> by {r.reviewer} on {new Date(r.timestamp).toLocaleDateString('en-IN')} — {r.comment}
                  </div>
                )) : <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>No review actions recorded.</p>}

                {/* Disclaimer */}
                <div style={{ marginTop: 32, padding: 16, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 10, fontSize: 12 }}>
                  <strong>Disclaimer:</strong> This report is generated from a demonstration prototype. All data, institutions, documents, and verification results are fictional. This report has no regulatory authority. Demo decisions are simulated. Verification sources marked as "Demo" or "Simulated" do not reflect actual issuer verification.
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon"><FileText size={32} /></div>
                <div className="empty-state-title">Select an application</div>
                <div className="empty-state-text">Choose an application from the dropdown to generate a comprehensive verification report.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
