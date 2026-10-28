// ============================
// VeriAI — Applications Page
// ============================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Plus, Search, Filter, ArrowUpDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

type SortKey = 'applicationNumber' | 'institutionName' | 'submittedDate' | 'riskScore' | 'verificationProgress' | 'status';
type SortDir = 'asc' | 'desc';

export default function Applications() {
  const applications = useStore((s) => s.applications);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('submittedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...applications];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.applicationNumber.toLowerCase().includes(q) ||
        a.institutionName.toLowerCase().includes(q) ||
        a.categoryLabel.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(a => a.category === categoryFilter);
    if (riskFilter !== 'all') result = result.filter(a => a.riskLevel === riskFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'riskScore' || sortKey === 'verificationProgress') {
        cmp = (a[sortKey] as number) - (b[sortKey] as number);
      } else {
        cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [applications, search, statusFilter, categoryFilter, riskFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'processing', label: 'Processing' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'decision_recorded', label: 'Decision Recorded' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'eoa', label: 'Extension of Approval' },
    { value: 'approval_change', label: 'Approval Change' },
    { value: 'programme_change', label: 'Programme Change' },
    { value: 'new_institution', label: 'New Institution' },
  ];

  const riskOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const statusColor = (s: string) => {
    switch (s) {
      case 'decision_recorded': return 'badge-success';
      case 'under_review': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'submitted': return 'badge-primary';
      case 'returned': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">Manage and track institutional approval applications.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/applications/new')}>
          <Plus size={18} /> New Application
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 320 }}>
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="form-select" style={{ width: 180, height: 40 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="form-select" style={{ width: 200, height: 40 }} value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
          {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="form-select" style={{ width: 160, height: 40 }} value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setPage(1); }}>
          {riskOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('applicationNumber')}>
                  Application ID <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('institutionName')}>
                  Institution <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th>Type</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('submittedDate')}>
                  Submitted <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('verificationProgress')}>
                  Progress <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('riskScore')}>
                  Risk <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th>Compliance</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('status')}>
                  Status <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-tertiary)' }}>No applications found</td></tr>
              ) : (
                paginated.map((app) => (
                  <tr key={app.id} className="clickable" onClick={() => navigate(`/app/applications/${app.id}`)}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 }}>
                        {app.applicationNumber.split('/').slice(-1)[0]}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{app.institutionName}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{app.institutionDetails['State'] || ''} • {app.institutionDetails['City'] || ''}</div>
                    </td>
                    <td><span className="badge badge-neutral" style={{ fontSize: 11 }}>{app.categoryLabel}</span></td>
                    <td style={{ fontSize: 13 }}>{app.submittedDate || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className={`progress-fill ${app.verificationProgress >= 80 ? 'success' : app.verificationProgress >= 40 ? 'primary' : 'warning'}`} style={{ width: `${app.verificationProgress}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, width: 32 }}>{app.verificationProgress}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className={`badge badge-dot ${app.riskLevel === 'low' ? 'badge-success' : app.riskLevel === 'moderate' ? 'badge-warning' : 'badge-danger'}`}>
                          {app.riskScore}
                        </span>
                      </div>
                    </td>
                    <td>
                      {app.complianceScore > 0 ? (
                        <span style={{ fontSize: 14, fontWeight: 600, color: app.complianceScore >= 80 ? 'var(--color-success)' : app.complianceScore >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                          {app.complianceScore}%
                        </span>
                      ) : <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge ${statusColor(app.status)}`}>
                        {app.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/app/applications/${app.id}`); }}>
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
