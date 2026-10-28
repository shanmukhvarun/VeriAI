// ============================
// VeriAI — Settings Page
// ============================

import { useState } from 'react';
import { useStore } from '../store';
import { demoUsers } from '../data';
import { riskWeights as defaultWeights } from '../data';
import {
  Settings as SettingsIcon, User, Shield, Bell, Database,
  Moon, Sun, Lock, Key, Users, CheckCircle2, Save, RefreshCw,
  AlertTriangle, Eye, EyeOff, Palette
} from 'lucide-react';

export default function Settings() {
  const { currentUser, setCurrentUser, darkMode, toggleDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [weights, setWeights] = useState({ ...defaultWeights });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'risk', label: 'Risk Configuration', icon: AlertTriangle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'about', label: 'About VeriAI', icon: Shield },
  ];

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure platform preferences, user roles, risk weights and notification settings.</p>
      </div>

      {saved && (
        <div style={{ position: 'fixed', top: 80, right: 32, padding: '12px 20px', background: 'var(--color-success)', color: 'white', borderRadius: 10, boxShadow: 'var(--shadow-lg)', zIndex: 100, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, animation: 'slideDown 0.3s ease' }}>
          <CheckCircle2 size={18} /> Settings saved
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Settings Nav */}
        <div className="card">
          <div style={{ padding: 8 }}>
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ cursor: 'pointer' }}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="card">
          <div className="card-body" style={{ padding: '24px 32px' }}>
            {activeTab === 'general' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>General Settings</h2>

                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className={`btn ${!darkMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => darkMode && toggleDarkMode()}>
                      <Sun size={16} /> Light Mode
                    </button>
                    <button className={`btn ${darkMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => !darkMode && toggleDarkMode()}>
                      <Moon size={16} /> Dark Mode
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 24 }}>
                  <label className="form-label">Current User Profile</label>
                  <div style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="user-avatar" style={{ width: 48, height: 48, fontSize: 16 }}>{currentUser.avatar}</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{currentUser.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{currentUser.roleLabel}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{currentUser.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 24 }}>
                  <label className="form-label">Application Data</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('veriai-store'); window.location.reload(); }}>
                      <RefreshCw size={16} /> Reset to Default Data
                    </button>
                  </div>
                  <div className="form-help">This will reset all applications, findings, and review history to the original demo data.</div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Users & Role Management</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                  Switch between demo roles to see different navigation and action permissions. In production, roles would be managed through secure authentication.
                </p>

                <div style={{ display: 'grid', gap: 12 }}>
                  {demoUsers.map(user => (
                    <div
                      key={user.id}
                      style={{
                        padding: 16, borderRadius: 10, border: `2px solid ${currentUser.id === user.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: currentUser.id === user.id ? 'var(--color-primary-50)' : 'var(--color-bg-card)',
                        cursor: 'pointer', transition: 'all var(--transition-fast)'
                      }}
                      onClick={() => { setCurrentUser(user); showSaved(); }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div className="user-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>{user.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{user.roleLabel}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{user.email}</div>
                        </div>
                        {currentUser.id === user.id && <span className="badge badge-primary">Active</span>}
                        <span className={`badge ${user.role === 'administrator' ? 'badge-danger' : user.role === 'verification_officer' ? 'badge-info' : user.role === 'compliance_reviewer' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: 10 }}>
                          {user.roleLabel}
                        </span>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                        {user.role === 'administrator' && 'Full access: manage rules, users, configurations, and record decisions.'}
                        {user.role === 'verification_officer' && 'Can inspect applications, verify documents, and perform permitted checks.'}
                        {user.role === 'compliance_reviewer' && 'Can assess rule outcomes, document deficiencies, and add review comments.'}
                        {user.role === 'institution_rep' && 'Can create applications, upload documents, and respond to requests.'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Risk Score Configuration</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                  Configure weights for each risk factor. The risk score (0–100) is computed from actual findings using these weights.
                </p>

                <div style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
                  <strong>Formula:</strong> Risk Score = Σ (Finding Count × Weight) capped at 100. Higher scores indicate a greater need for review.
                </div>

                {Object.entries(weights).map(([key, value]) => (
                  <div key={key} className="form-group" style={{ display: 'grid', gridTemplateColumns: '240px 1fr 60px', gap: 16, alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={value}
                      onChange={e => setWeights(w => ({ ...w, [key]: parseInt(e.target.value) }))}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)', textAlign: 'center' }}>{value}</span>
                  </div>
                ))}

                <button className="btn btn-primary mt-4" onClick={showSaved}>
                  <Save size={16} /> Save Weights
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Notification Preferences</h2>
                {[
                  { label: 'Missing required documents', checked: true },
                  { label: 'Expired supporting certificates', checked: true },
                  { label: 'Source verification pending', checked: true },
                  { label: 'Institutional record mismatch', checked: true },
                  { label: 'Potential duplicate documents', checked: true },
                  { label: 'Document anomaly alerts', checked: true },
                  { label: 'Compliance deficiencies', checked: true },
                  { label: 'Infrastructure review needed', checked: false },
                  { label: 'Application awaiting action', checked: true },
                ].map((pref, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <input type="checkbox" defaultChecked={pref.checked} style={{ width: 18, height: 18 }} />
                    <span style={{ fontSize: 14 }}>{pref.label}</span>
                  </div>
                ))}
                <button className="btn btn-primary mt-4" onClick={showSaved}><Save size={16} /> Save Preferences</button>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Security & Access</h2>
                <div style={{ padding: 16, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 10, marginBottom: 24, fontSize: 13 }}>
                  <strong>Demo Mode:</strong> This prototype uses client-side role switching for demonstration. Production deployment requires:
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { title: 'Authentication', desc: 'Secure login with MFA, SSO integration, and session management', status: 'Planned' },
                    { title: 'Server-Side Authorization', desc: 'Role-based access control enforced at API level, not client-side', status: 'Planned' },
                    { title: 'Encrypted Transport', desc: 'TLS 1.3 for all API communications', status: 'Planned' },
                    { title: 'Encrypted Storage', desc: 'AES-256 encryption for sensitive documents and PII', status: 'Planned' },
                    { title: 'Controlled Document Access', desc: 'Signed URLs, access logs, and document watermarking', status: 'Planned' },
                    { title: 'Data Minimization', desc: 'Collect only necessary data, implement retention policies', status: 'Planned' },
                    { title: 'Audit Logging', desc: 'Immutable, tamper-evident audit trail with digital signatures', status: 'Demo' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{item.desc}</div>
                      </div>
                      <span className={`badge ${item.status === 'Demo' ? 'badge-success' : 'badge-neutral'}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>About VeriAI</h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
                  <strong>VeriAI — Intelligent Institutional Verification and Compliance Platform</strong><br />
                  Built for Smart India Hackathon 2026, Problem Statement SIH26261.<br />
                  Organization: All India Council for Technical Education (AICTE), Ministry of Education.
                </p>

                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Implementation vs. Simulation Boundaries</h3>
                <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
                  {[
                    { category: 'Actually Implemented', items: ['PDF text extraction (basic)', 'SHA-256 file hashing', 'Field comparison & mismatch detection', 'Date validation & expiry checks', 'Duplicate file detection', 'Configurable compliance rule evaluation', 'Risk score computation from findings', 'Full CRUD review workflow', 'Audit trail generation', 'CSV export', 'Role-based UI (demo)'], color: 'var(--color-success)' },
                    { category: 'Simulated (Demo Data)', items: ['Institutional records (fictional)', 'OCR extracted fields (partially simulated)', 'Issuer verification responses', 'Demo approval decisions', 'Seeded anomaly findings'], color: 'var(--color-warning)' },
                    { category: 'Not Configured / Unavailable', items: ['Live AICTE portal connectivity', 'Restricted database access', 'External issuer API integration', 'Digital signature verification', 'Computer vision analysis', 'Production authentication'], color: 'var(--color-text-tertiary)' },
                  ].map((section, i) => (
                    <div key={i} style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 10, borderLeft: `3px solid ${section.color}` }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: section.color, marginBottom: 8 }}>{section.category}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {section.items.map((item, j) => (
                          <span key={j} className="badge badge-neutral" style={{ fontSize: 11 }}>{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  <strong>Version:</strong> 1.0.0 (Prototype) • <strong>Stack:</strong> React, TypeScript, Vite, Recharts, Zustand, Lucide • <strong>Theme:</strong> Smart Automation
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
