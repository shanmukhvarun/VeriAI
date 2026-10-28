// ============================
// VeriAI — Overview Dashboard
// ============================

import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { monthlyTrendData, verificationDistribution, pipelineData, complianceOverview } from '../data';
import {
  FileText, Clock, AlertTriangle, CheckCircle2, ArrowUpRight,
  ArrowRight, ExternalLink, AlertCircle, XCircle, FileWarning, Building2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function Overview() {
  const applications = useStore((s) => s.applications);
  const navigate = useNavigate();

  const totalApps = applications.length;
  const awaiting = applications.filter(a => ['submitted', 'processing'].includes(a.status)).length;
  const issuesCount = applications.reduce((acc, a) => acc + a.findings.filter(f => f.reviewStatus === 'pending').length, 0);
  const completed = applications.filter(a => a.status === 'decision_recorded').length;

  const kpis = [
    { label: 'Total Applications', value: totalApps, icon: FileText, type: 'primary' as const, desc: 'All applications in the system' },
    { label: 'Awaiting Verification', value: awaiting, icon: Clock, type: 'warning' as const, desc: 'Submitted and processing' },
    { label: 'Issues Requiring Review', value: issuesCount, icon: AlertTriangle, type: 'danger' as const, desc: 'Pending findings across all apps' },
    { label: 'Completed Assessments', value: completed, icon: CheckCircle2, type: 'success' as const, desc: 'Decision recorded' },
  ];

  // Priority attention items from actual findings
  const priorityItems = applications
    .flatMap(a => a.findings.filter(f => f.reviewStatus === 'pending').map(f => ({ ...f, appId: a.id, appNumber: a.applicationNumber, institution: a.institutionName })))
    .sort((a, b) => {
      const sev = { critical: 0, high: 1, moderate: 2, low: 3 };
      return sev[a.severity] - sev[b.severity];
    })
    .slice(0, 7);

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 6);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Verification Overview</h1>
        <p className="page-subtitle">Monitor institutional applications, document checks and compliance findings.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className={`kpi-card ${kpi.type} animate-in animate-in-delay-${i + 1}`}>
            <div className={`kpi-icon ${kpi.type}`}>
              <kpi.icon size={22} />
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{kpi.desc}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="dashboard-grid dashboard-grid-2 mb-6">
        {/* Application Trend */}
        <div className="card animate-in animate-in-delay-1">
          <div className="card-header">
            <span className="card-title">Application Processing Trend</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }} />
                <Line type="monotone" dataKey="submitted" stroke="#5145E5" strokeWidth={2.5} dot={{ r: 4, fill: '#5145E5' }} name="Submitted" />
                <Line type="monotone" dataKey="verified" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4, fill: '#16A34A' }} name="Verified" />
                <Line type="monotone" dataKey="pending" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4, fill: '#D97706' }} name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Distribution */}
        <div className="card animate-in animate-in-delay-2">
          <div className="card-header">
            <span className="card-title">Verification Outcome Distribution</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={verificationDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {verificationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {verificationDistribution.map((item, i) => (
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

      {/* Pipeline + Compliance */}
      <div className="dashboard-grid dashboard-grid-2 mb-6">
        {/* Processing Pipeline */}
        <div className="card animate-in animate-in-delay-1">
          <div className="card-header">
            <span className="card-title">Application Processing Pipeline</span>
          </div>
          <div className="card-body">
            <div className="workflow-steps">
              {pipelineData.map((stage, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="workflow-step">
                    <div className={`workflow-step-icon ${i === 0 ? 'active' : i === pipelineData.length - 1 ? 'completed' : ''}`}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{stage.count}</span>
                    </div>
                    <div className="workflow-step-label">{stage.stage}</div>
                  </div>
                  {i < pipelineData.length - 1 && <div className="workflow-connector" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="card animate-in animate-in-delay-2">
          <div className="card-header">
            <span className="card-title">Compliance Status Overview</span>
          </div>
          <div className="card-body">
            {complianceOverview.map((cat, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{cat.category}</span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>{cat.compliant}%</span>
                </div>
                <div className="segmented-progress">
                  <div className="segment" style={{ flex: cat.compliant, background: 'var(--color-success)' }} />
                  <div className="segment" style={{ flex: cat.deficient, background: 'var(--color-danger)' }} />
                  <div className="segment" style={{ flex: cat.pending, background: 'var(--color-warning)' }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 11, color: 'var(--color-text-tertiary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-success)' }} /> Compliant</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-danger)' }} /> Deficient</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-warning)' }} /> Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Attention + Recent Apps */}
      <div className="dashboard-grid dashboard-grid-2-1 mb-6">
        {/* Recent Applications Table */}
        <div className="card animate-in animate-in-delay-1">
          <div className="card-header">
            <span className="card-title">Recent Applications</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/applications')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Institution</th>
                  <th>Type</th>
                  <th>Progress</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id} className="clickable" onClick={() => navigate(`/app/applications/${app.id}`)}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{app.applicationNumber.split('/').slice(-1)[0]}</td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{app.institutionName}</div>
                    </td>
                    <td><span className="badge badge-neutral">{app.categoryLabel}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className={`progress-fill ${app.verificationProgress >= 80 ? 'success' : app.verificationProgress >= 40 ? 'primary' : 'warning'}`} style={{ width: `${app.verificationProgress}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>{app.verificationProgress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-dot ${app.riskLevel === 'low' ? 'badge-success' : app.riskLevel === 'moderate' ? 'badge-warning' : app.riskLevel === 'high' ? 'badge-danger' : 'badge-danger'}`}>
                        {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${app.status === 'decision_recorded' ? 'badge-success' : app.status === 'under_review' ? 'badge-warning' : app.status === 'processing' ? 'badge-info' : app.status === 'draft' ? 'badge-neutral' : 'badge-primary'}`}>
                        {app.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Attention */}
        <div className="card animate-in animate-in-delay-2">
          <div className="card-header">
            <span className="card-title">⚠ Priority Attention</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {priorityItems.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--color-success)', margin: '0 auto 12px' }} />
                <div className="empty-state-title" style={{ fontSize: 14 }}>No pending issues</div>
              </div>
            ) : (
              priorityItems.map((item) => (
                <div
                  key={item.id}
                  style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                  className="notification-item"
                  onClick={() => navigate(`/app/applications/${item.appId}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ marginTop: 2 }}>
                      {item.severity === 'critical' ? <XCircle size={16} style={{ color: 'var(--color-danger)' }} /> :
                       item.severity === 'high' ? <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} /> :
                       item.severity === 'moderate' ? <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} /> :
                       <FileWarning size={16} style={{ color: 'var(--color-info)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                        {item.institution} • {item.appNumber.split('/').pop()}
                      </div>
                    </div>
                    <span className={`badge ${item.severity === 'critical' || item.severity === 'high' ? 'badge-danger' : item.severity === 'moderate' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: 10 }}>
                      {item.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
