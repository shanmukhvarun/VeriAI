// ============================
// VeriAI — Infrastructure Review Page
// ============================

import { useState, useRef } from 'react';
import { useStore } from '../store';
import {
  HardDrive, Upload, Image, FileText, CheckCircle2, AlertTriangle,
  Eye, Building2, Camera, MapPin, X, Ruler
} from 'lucide-react';

interface InfraEvidence {
  id: string;
  name: string;
  type: string;
  category: string;
  requirement: string;
  preview: string | null;
  assessment: 'sufficient' | 'insufficient' | 'pending' | 'inspection_needed';
  comments: string;
}

export default function InfrastructureReview() {
  const applications = useStore((s) => s.applications);
  const [evidence, setEvidence] = useState<InfraEvidence[]>([
    { id: 'ie-1', name: 'Campus Front View', type: 'Photograph', category: 'Building', requirement: 'Adequate campus area as per norms', preview: null, assessment: 'pending', comments: '' },
    { id: 'ie-2', name: 'Computer Lab Photo', type: 'Photograph', category: 'Laboratory', requirement: 'Minimum 1 terminal per 5 students', preview: null, assessment: 'pending', comments: '' },
    { id: 'ie-3', name: 'Library Floor Plan', type: 'Floor Plan', category: 'Library', requirement: 'Adequate library space with reference materials', preview: null, assessment: 'pending', comments: '' },
    { id: 'ie-4', name: 'Fire Safety Certificate', type: 'Certificate', category: 'Safety', requirement: 'Valid fire safety compliance certificate', preview: null, assessment: 'inspection_needed', comments: 'Certificate expired — needs physical verification' },
  ]);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const infraDocs = applications.flatMap(a => a.documents.filter(d => d.category === 'infrastructure').map(d => ({ ...d, institution: a.institutionName, appId: a.id })));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEvidence(prev => [...prev, {
          id: `ie-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'Photograph' : 'Document',
          category: 'General',
          requirement: 'To be assigned',
          preview: file.type.startsWith('image/') ? ev.target?.result as string : null,
          assessment: 'pending',
          comments: '',
        }]);
      };
      if (file.type.startsWith('image/')) reader.readAsDataURL(file);
      else reader.readAsArrayBuffer(file);
    });
    setShowUpload(false);
  };

  const updateAssessment = (id: string, assessment: InfraEvidence['assessment']) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, assessment } : e));
  };

  const selected = evidence.find(e => e.id === selectedEvidence);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Infrastructure Review</h1>
          <p className="page-subtitle">Review infrastructure evidence, photographs, floor plans and certificates submitted by institutions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} /> Upload Evidence
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
      </div>

      <div style={{ padding: 12, background: 'var(--color-info-bg)', border: '1px solid var(--color-info-border)', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
        <strong>Note:</strong> Infrastructure compliance cannot be fully assessed from documents alone. This interface supports evidence review and flags cases requiring physical inspection. Photographs alone do not establish that an institution satisfies all infrastructure requirements.
      </div>

      {/* Stats */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card success" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{evidence.filter(e => e.assessment === 'sufficient').length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Evidence Sufficient</div>
        </div>
        <div className="kpi-card warning" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{evidence.filter(e => e.assessment === 'pending').length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Pending Review</div>
        </div>
        <div className="kpi-card danger" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{evidence.filter(e => e.assessment === 'insufficient').length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Insufficient</div>
        </div>
        <div className="kpi-card primary" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{evidence.filter(e => e.assessment === 'inspection_needed').length}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Inspection Needed</div>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-2" style={{ alignItems: 'start' }}>
        {/* Evidence List */}
        <div className="card">
          <div className="card-header"><span className="card-title">Evidence Items ({evidence.length})</span></div>
          <div>
            {evidence.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '14px 20px', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer',
                  background: selectedEvidence === item.id ? 'var(--color-bg-active)' : 'transparent'
                }}
                onClick={() => setSelectedEvidence(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.type === 'Photograph' ? <Camera size={18} style={{ color: 'var(--color-primary)' }} /> :
                     item.type === 'Floor Plan' ? <Ruler size={18} style={{ color: 'var(--color-accent)' }} /> :
                     <FileText size={18} style={{ color: 'var(--color-warning)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{item.category} • {item.type}</div>
                  </div>
                  <span className={`badge ${item.assessment === 'sufficient' ? 'badge-success' : item.assessment === 'insufficient' ? 'badge-danger' : item.assessment === 'inspection_needed' ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
                    {item.assessment.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="card" style={{ position: 'sticky', top: 80 }}>
          {selected ? (
            <>
              <div className="card-header">
                <span className="card-title">Evidence Assessment</span>
              </div>
              <div className="card-body">
                {selected.preview && (
                  <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={selected.preview} alt={selected.name} style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ marginBottom: 16 }}>
                  {[
                    { label: 'Evidence Name', value: selected.name },
                    { label: 'Category', value: selected.category },
                    { label: 'Type', value: selected.type },
                    { label: 'Requirement', value: selected.requirement },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                      <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Assessment</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['sufficient', 'insufficient', 'pending', 'inspection_needed'] as const).map(status => (
                      <button
                        key={status}
                        className={`filter-chip ${selected.assessment === status ? 'active' : ''}`}
                        onClick={() => updateAssessment(selected.id, status)}
                      >
                        {status === 'sufficient' ? <CheckCircle2 size={14} /> : status === 'inspection_needed' ? <AlertTriangle size={14} /> : null}
                        {status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>

                {selected.comments && (
                  <div style={{ padding: '10px 14px', background: 'var(--color-warning-bg)', borderRadius: 8, fontSize: 13, marginTop: 12 }}>
                    <strong>Comments:</strong> {selected.comments}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card-body">
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <HardDrive size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 12px' }} />
                <div className="empty-state-title" style={{ fontSize: 14 }}>Select evidence to review</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents from applications */}
      {infraDocs.length > 0 && (
        <div className="card mt-6">
          <div className="card-header"><span className="card-title">Infrastructure Documents from Applications</span></div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Document</th><th>Institution</th><th>Issuer</th><th>Status</th><th>Expiry</th><th>Issues</th></tr></thead>
              <tbody>
                {infraDocs.map(doc => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{doc.name}</td>
                    <td style={{ fontSize: 13 }}>{doc.institution}</td>
                    <td style={{ fontSize: 13 }}>{doc.issuer}</td>
                    <td><span className={`badge ${doc.verificationResult === 'verified' ? 'badge-success' : 'badge-danger'}`}>{doc.verificationResult}</span></td>
                    <td style={{ fontSize: 13 }}>{doc.expiryDate || '—'}</td>
                    <td>{doc.anomalies.length > 0 ? <span className="badge badge-warning">{doc.anomalies.length} issues</span> : <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>None</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
