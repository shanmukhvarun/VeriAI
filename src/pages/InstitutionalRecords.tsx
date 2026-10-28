// ============================
// VeriAI — Institutional Records Page
// ============================

import { useState } from 'react';
import { institutions } from '../data';
import { Building2, Search, ExternalLink, MapPin, Calendar, GraduationCap, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export default function InstitutionalRecords() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = institutions.filter(inst =>
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.code.toLowerCase().includes(search.toLowerCase()) ||
    inst.city.toLowerCase().includes(search.toLowerCase()) ||
    inst.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Institutional Records</h1>
        <p className="page-subtitle">Browse and compare institutional records available in the demo data store. These are fictional demonstration records.</p>
      </div>

      <div style={{ padding: 12, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 10, marginBottom: 20, fontSize: 13, display: 'flex', gap: 10 }}>
        <Shield size={16} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
        <span><strong>Demo Data:</strong> These institutional records are entirely fictional. In production, this interface would connect to authorized AICTE systems via configurable source adapters.</span>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 440 }}>
          <Search />
          <input type="text" className="search-input" placeholder="Search by institution name, code, city or state..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map(inst => (
          <div key={inst.id} className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === inst.id ? null : inst.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{inst.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', gap: 12, marginTop: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {inst.city}, {inst.state}</span>
                    <span>Code: {inst.code}</span>
                    <span>{inst.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> Est. {inst.established}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${inst.approvalStatus === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{inst.approvalStatus}</span>
                {expandedId === inst.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {expandedId === inst.id && (
              <div className="card-body">
                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'Address', value: inst.address },
                    { label: 'Last EoA', value: inst.lastEoaYear },
                    { label: 'Approval Status', value: inst.approvalStatus },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Programmes */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GraduationCap size={16} /> Approved Programmes
                  </h3>
                  <table className="data-table">
                    <thead><tr><th>Programme</th><th>Level</th><th>Duration</th><th>Approved Intake</th><th>Current</th><th>Accreditation</th></tr></thead>
                    <tbody>
                      {inst.programmes.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</td>
                          <td><span className="badge badge-neutral">{p.level}</span></td>
                          <td style={{ fontSize: 13 }}>{p.duration}</td>
                          <td style={{ fontSize: 13 }}>{p.approvedIntake}</td>
                          <td style={{ fontSize: 13 }}>{p.currentIntake}</td>
                          <td><span className={`badge ${p.accreditationStatus === 'Accredited' ? 'badge-success' : p.accreditationStatus === 'Expired' ? 'badge-danger' : p.accreditationStatus === 'Applied' ? 'badge-info' : 'badge-neutral'}`}>{p.accreditationStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Accreditations */}
                {inst.accreditations.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={16} /> Accreditation Records
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                      {inst.accreditations.map(acc => (
                        <div key={acc.id} style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <strong style={{ fontSize: 14 }}>{acc.body}</strong>
                            <span className={`badge ${acc.status === 'Valid' ? 'badge-success' : 'badge-danger'}`}>{acc.status}</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Grade: <strong>{acc.grade}</strong></div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>Valid: {acc.validFrom} to {acc.validTo}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contacts */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Contact Information</h3>
                  {inst.contacts.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, fontSize: 13, padding: '8px 0' }}>
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{c.role}</span>
                      <span style={{ color: 'var(--color-primary)' }}>{c.email}</span>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
