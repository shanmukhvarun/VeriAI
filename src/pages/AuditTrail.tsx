// ============================
// VeriAI — Audit Trail Page
// ============================

import { useState, useMemo } from 'react';
import { useStore } from '../store';
import {
  History, Search, Filter, Download, Calendar, User, FileText,
  CheckCircle2, AlertTriangle, Upload, Eye, Shield, Clock,
  ChevronDown
} from 'lucide-react';

export default function AuditTrail() {
  const applications = useStore((s) => s.applications);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');

  const allEvents = useMemo(() => {
    return applications
      .flatMap(a => a.auditTrail.map(e => ({ ...e, appId: a.id, institution: a.institutionName, appNumber: a.applicationNumber })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [applications]);

  const actors = [...new Set(allEvents.map(e => e.actor))];
  const eventTypes = [...new Set(allEvents.map(e => e.eventType))];

  const filtered = allEvents.filter(e => {
    if (search) {
      const q = search.toLowerCase();
      if (!e.event.toLowerCase().includes(q) && !e.details.toLowerCase().includes(q) && !e.institution.toLowerCase().includes(q) && !e.actor.toLowerCase().includes(q)) return false;
    }
    if (typeFilter !== 'all' && e.eventType !== typeFilter) return false;
    if (actorFilter !== 'all' && e.actor !== actorFilter) return false;
    return true;
  });

  const eventIcon = (type: string) => {
    switch (type) {
      case 'create': return <FileText size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'upload': return <Upload size={16} style={{ color: 'var(--color-accent)' }} />;
      case 'submit': return <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />;
      case 'process': return <Clock size={16} style={{ color: 'var(--color-info)' }} />;
      case 'verify': return <Shield size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'anomaly': return <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} />;
      case 'assess': return <Eye size={16} style={{ color: 'var(--color-warning)' }} />;
      case 'review': return <User size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'decision': return <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />;
      case 'resolve': return <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />;
      case 'comment': return <FileText size={16} style={{ color: 'var(--color-info)' }} />;
      default: return <History size={16} style={{ color: 'var(--color-text-tertiary)' }} />;
    }
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Event', 'Type', 'Resource', 'Outcome', 'Details', 'Institution', 'Application'];
    const rows = filtered.map(e => [
      e.timestamp, e.actor, e.actorRole, e.event, e.eventType, e.resource,
      e.outcome, e.details.replace(/,/g, ';'), e.institution, e.appNumber
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veriai-audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">Complete, searchable record of all verification events and reviewer actions. This is a demonstration audit log.</p>
        </div>
        <button className="btn btn-secondary" onClick={exportCSV}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 360 }}>
          <Search />
          <input type="text" className="search-input" placeholder="Search events, actors, institutions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 180, height: 40 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Event Types</option>
          {eventTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select className="form-select" style={{ width: 200, height: 40 }} value={actorFilter} onChange={e => setActorFilter(e.target.value)}>
          <option value="all">All Actors</option>
          {actors.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginLeft: 8 }}>{filtered.length} events</span>
      </div>

      {/* Events */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: 60 }}>
              <History size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 12px' }} />
              <div className="empty-state-title">No events found</div>
            </div>
          ) : (
            <div className="timeline" style={{ padding: '20px 24px' }}>
              {filtered.map(event => (
                <div key={event.id} className="timeline-item">
                  <div className={`timeline-dot ${event.eventType === 'decision' || event.eventType === 'resolve' ? 'success' : event.eventType === 'anomaly' ? 'danger' : event.eventType === 'review' || event.eventType === 'comment' ? 'warning' : 'active'}`} />
                  <div className="timeline-content" style={{ paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {eventIcon(event.eventType)}
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{event.event}</span>
                      {event.outcome && (
                        <span className={`badge ${event.outcome.includes('Success') ? 'badge-success' : event.outcome.includes('Alert') || event.outcome.includes('Issues') || event.outcome.includes('Deficien') ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
                          {event.outcome}
                        </span>
                      )}
                    </div>
                    {event.details && <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{event.details}</div>}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} /> {event.actor} ({event.actorRole})</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {new Date(event.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={12} /> {event.institution}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{event.resource}: {event.resourceId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
