// ============================
// VeriAI — Compliance Intelligence Page
// ============================

import { useState } from 'react';
import { useStore } from '../store';
import type { ComplianceRule, ApplicationCategory } from '../types';
import {
  Brain, Plus, Edit3, CheckCircle2, AlertTriangle, Search,
  ShieldCheck, XCircle, Clock, Filter, Save, X
} from 'lucide-react';

export default function ComplianceIntelligence() {
  const { complianceRules, addComplianceRule, updateComplianceRule, applications } = useStore();
  const [activeTab, setActiveTab] = useState<'rules' | 'results'>('rules');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState<ComplianceRule | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Application Completeness', severity: 'high' as any,
    isMandatory: true, requiredEvidence: '', validationMethod: '', remediation: '',
    applicableCategories: ['eoa'] as ApplicationCategory[],
  });

  const filteredRules = complianceRules.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) return false;
    }
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const categories = [...new Set(complianceRules.map(r => r.category))];

  const allComplianceResults = applications.flatMap(a => a.complianceResults.map(cr => ({ ...cr, appId: a.id, institution: a.institutionName, appNumber: a.applicationNumber })));

  const handleSaveRule = () => {
    if (!formData.name.trim()) return;
    if (editingRule) {
      updateComplianceRule(editingRule.id, formData);
    } else {
      addComplianceRule({
        id: `rule-${Date.now()}`,
        effectiveDate: new Date().toISOString().split('T')[0],
        ...formData,
      });
    }
    setShowAddRule(false);
    setEditingRule(null);
    setFormData({ name: '', description: '', category: 'Application Completeness', severity: 'high', isMandatory: true, requiredEvidence: '', validationMethod: '', remediation: '', applicableCategories: ['eoa'] });
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />;
      case 'deficiency': return <XCircle size={16} style={{ color: 'var(--color-danger)' }} />;
      case 'not_verified': return <Clock size={16} style={{ color: 'var(--color-warning)' }} />;
      default: return <Clock size={16} style={{ color: 'var(--color-text-tertiary)' }} />;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Compliance Intelligence</h1>
          <p className="page-subtitle">Configure regulatory compliance rules and review evaluation results across applications.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowAddRule(true); setEditingRule(null); }}>
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
          <Brain size={16} style={{ marginRight: 6, verticalAlign: -3 }} /> Compliance Rules ({complianceRules.length})
        </button>
        <button className={`tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
          <ShieldCheck size={16} style={{ marginRight: 6, verticalAlign: -3 }} /> Evaluation Results ({allComplianceResults.length})
        </button>
      </div>

      {activeTab === 'rules' && (
        <>
          <div className="filter-bar">
            <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 340 }}>
              <Search />
              <input type="text" className="search-input" placeholder="Search rules..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 220, height: 40 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {filteredRules.map(rule => (
              <div key={rule.id} className="card">
                <div className="card-body" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-tertiary)' }}>{rule.id}</span>
                        <strong style={{ fontSize: 14 }}>{rule.name}</strong>
                        {rule.isMandatory && <span className="badge badge-danger" style={{ fontSize: 10 }}>Mandatory</span>}
                        <span className={`badge ${rule.severity === 'critical' ? 'badge-danger' : rule.severity === 'high' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: 10 }}>{rule.severity.toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{rule.description}</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-tertiary)', flexWrap: 'wrap' }}>
                        <span><strong>Category:</strong> {rule.category}</span>
                        <span><strong>Evidence:</strong> {rule.requiredEvidence}</span>
                        <span><strong>Method:</strong> {rule.validationMethod}</span>
                        <span><strong>Applies to:</strong> {rule.applicableCategories.join(', ')}</span>
                        <span><strong>Effective:</strong> {rule.effectiveDate}</span>
                      </div>
                      {rule.remediation && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-primary)' }}>
                          <strong>Remediation:</strong> {rule.remediation}
                        </div>
                      )}
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      setEditingRule(rule);
                      setFormData({
                        name: rule.name, description: rule.description, category: rule.category,
                        severity: rule.severity, isMandatory: rule.isMandatory, requiredEvidence: rule.requiredEvidence,
                        validationMethod: rule.validationMethod, remediation: rule.remediation, applicableCategories: rule.applicableCategories
                      });
                      setShowAddRule(true);
                    }}>
                      <Edit3 size={14} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'results' && (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Rule</th><th>Application</th><th>Institution</th><th>Status</th><th>Evidence</th><th>Reasoning</th><th>Remediation</th></tr></thead>
              <tbody>
                {allComplianceResults.map(cr => (
                  <tr key={cr.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{cr.ruleName}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{cr.category}</div>
                    </td>
                    <td style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{cr.appNumber.split('/').pop()}</td>
                    <td style={{ fontSize: 13 }}>{cr.institution}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {statusIcon(cr.status)}
                        <span className={`badge ${cr.status === 'compliant' ? 'badge-success' : cr.status === 'deficiency' ? 'badge-danger' : 'badge-warning'}`}>
                          {cr.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, maxWidth: 180 }}>{cr.evidence}</td>
                    <td style={{ fontSize: 12, maxWidth: 180 }}>{cr.reasoning}</td>
                    <td style={{ fontSize: 12, color: cr.remediation ? 'var(--color-primary)' : 'var(--color-text-tertiary)', maxWidth: 180 }}>{cr.remediation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showAddRule && (
        <div className="modal-overlay" onClick={() => setShowAddRule(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editingRule ? 'Edit Compliance Rule' : 'Add Compliance Rule'}</span>
              <button className="modal-close" onClick={() => setShowAddRule(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Rule Name <span className="required">*</span></label><input className="form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Required Evidence</label><input className="form-input" value={formData.requiredEvidence} onChange={e => setFormData(p => ({ ...p, requiredEvidence: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Validation Method</label><input className="form-input" value={formData.validationMethod} onChange={e => setFormData(p => ({ ...p, validationMethod: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select className="form-select" value={formData.severity} onChange={e => setFormData(p => ({ ...p, severity: e.target.value as any }))}>
                    <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option><option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28 }}>
                  <input type="checkbox" checked={formData.isMandatory} onChange={e => setFormData(p => ({ ...p, isMandatory: e.target.checked }))} style={{ width: 18, height: 18 }} />
                  <label className="form-label" style={{ marginBottom: 0 }}>Mandatory Requirement</label>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Remediation Instructions</label><textarea className="form-textarea" value={formData.remediation} onChange={e => setFormData(p => ({ ...p, remediation: e.target.value }))} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddRule(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveRule}><Save size={16} /> {editingRule ? 'Update Rule' : 'Add Rule'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
