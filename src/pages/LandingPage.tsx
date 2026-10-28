// ============================
// VeriAI — Landing Page
// ============================

import { Link } from 'react-router-dom';
import {
  ShieldCheck, FileSearch, Brain, Building2, ClipboardCheck, BarChart3,
  ArrowRight, Upload, GitCompare, CheckCircle2, Users, AlertTriangle,
  ChevronRight, Zap, Lock, Eye
} from 'lucide-react';

const features = [
  { icon: FileSearch, title: 'Intelligent Application Validation', desc: 'Automated checks on application completeness, mandatory fields, and category-specific requirements with configurable validation rules.' },
  { icon: Eye, title: 'OCR-Powered Document Analysis', desc: 'Extract text and structured data from uploaded documents using OCR, then compare against application fields and institutional records.' },
  { icon: ShieldCheck, title: 'Document Authentication & Anomaly Detection', desc: 'Identify expired certificates, duplicate files, name mismatches, and potential document anomalies with evidence-backed alerts.' },
  { icon: Building2, title: 'Institutional Record Cross-Verification', desc: 'Compare application-submitted values with document-extracted data and available institutional records to surface discrepancies.' },
  { icon: Brain, title: 'Regulatory & Infrastructure Compliance', desc: 'Evaluate configurable compliance rules, assess infrastructure evidence, and generate category-specific compliance checklists.' },
  { icon: BarChart3, title: 'Explainable Reports & Audit Trails', desc: 'Transparent, evidence-linked findings with full audit history, reviewer comments, and exportable compliance reports.' },
];

const processSteps = [
  { icon: Upload, title: 'Application Submission', desc: 'Institution submits application with documents' },
  { icon: FileSearch, title: 'Document Extraction', desc: 'OCR and PDF text extraction' },
  { icon: GitCompare, title: 'Record Matching', desc: 'Cross-verify with institutional records' },
  { icon: ClipboardCheck, title: 'Compliance Assessment', desc: 'Evaluate regulatory requirements' },
  { icon: Users, title: 'Human Review', desc: 'Authorized reviewer examines findings' },
  { icon: CheckCircle2, title: 'Final Decision', desc: 'Official decision by competent authority' },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="sidebar-brand-icon">V</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>VeriAI</div>
          </div>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Capabilities</a>
          <a href="#process" className="landing-nav-link">Workflow</a>
          <a href="#about" className="landing-nav-link">About</a>
          <Link to="/app" className="btn btn-primary btn-sm">
            Open Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="animate-in">
          <div className="hero-badge">
            <Zap size={14} /> SIH 2026 • AICTE • Smart Automation
          </div>
          <h1 className="hero-title">
            Institutional Verification,{' '}
            <span className="highlight">Reimagined with AI.</span>
          </h1>
          <p className="hero-description">
            An intelligent verification platform that helps validate institutional applications, authenticate supporting documents, surface compliance gaps and assist authorized reviewers with transparent, evidence-backed insights.
          </p>
          <div className="hero-cta">
            <Link to="/app" className="btn btn-primary btn-xl">
              Explore Live Demo <ArrowRight size={18} />
            </Link>
            <a href="#process" className="btn btn-secondary btn-xl">
              Discover the Workflow
            </a>
          </div>
        </div>

        <div className="hero-visual animate-in animate-in-delay-2">
          <div className="hero-card-main">
            {/* Mini dashboard preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <FileSearch size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Document Verification</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>EoA Certificate 2025-26</div>
              </div>
              <span className="badge badge-success badge-dot" style={{ marginLeft: 'auto' }}>Verified</span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Verification Progress</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>87%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill primary" style={{ width: '87%' }} />
              </div>
            </div>

            {/* Compliance mini */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: '10px 12px', background: 'var(--color-success-bg)', borderRadius: 8, border: '1px solid var(--color-success-border)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-success)' }}>94</div>
                <div style={{ fontSize: 11, color: 'var(--color-success)' }}>Compliance Score</div>
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--color-primary-50)', borderRadius: 8, border: '1px solid var(--color-primary-100)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>12</div>
                <div style={{ fontSize: 11, color: 'var(--color-primary)' }}>Risk Score</div>
              </div>
            </div>

            {/* Evidence panel mini */}
            <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Latest Finding</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontSize: 13 }}>All institution names match across documents</span>
              </div>
            </div>
          </div>

          <div className="hero-card-float top-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Source Verified</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>NAAC Reference: Confirmed</div>
          </div>

          <div className="hero-card-float bottom-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Review Needed</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>2 findings require attention</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="section-label">Capabilities</div>
        <h2 className="section-title">AI-Powered Verification Intelligence</h2>
        <p className="section-subtitle">
          Six integrated capabilities that work together to support transparent, evidence-based institutional verification workflows.
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className={`feature-card animate-in animate-in-delay-${(i % 3) + 1}`}>
              <div className="feature-icon">
                <f.icon size={24} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="process-section">
        <div className="section-label">Workflow</div>
        <h2 className="section-title">End-to-End Verification Pipeline</h2>
        <p className="section-subtitle">
          From application submission to final decision — every step is transparent, traceable, and supported by evidence.
        </p>
        <div className="process-steps">
          {processSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="process-step">
                <div className="process-step-num">
                  <step.icon size={24} />
                </div>
                <div className="process-step-title">{step.title}</div>
                <div className="process-step-desc">{step.desc}</div>
              </div>
              {i < processSteps.length - 1 && (
                <div className="process-arrow" style={{ marginTop: 24, padding: '0 8px' }}>
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <div className="section-label">About VeriAI</div>
        <h2 className="section-title">Built for Smart India Hackathon 2026</h2>
        <p className="section-subtitle" style={{ maxWidth: 720 }}>
          VeriAI addresses AICTE problem statement SIH26261 — AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification. The platform demonstrates how AI can assist authorized officials in validating institutional approval applications while keeping final decisions with competent authorities.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 800, margin: '48px auto 0' }}>
          {[
            { value: '6', label: 'Applications' },
            { value: '5', label: 'Institutions' },
            { value: '10', label: 'Compliance Rules' },
            { value: '100%', label: 'Transparent' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)', letterSpacing: -1 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-disclaimer">
          <AlertTriangle size={16} />
          <span><strong>Prototype Disclaimer:</strong> VeriAI is a demonstration prototype built for SIH 2026. All institutional data, documents, and verification results are fictional. This application does not have live AICTE database connectivity. Demo decisions are simulated and have no regulatory authority.</span>
        </div>
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div className="sidebar-brand-icon" style={{ width: 32, height: 32, fontSize: 14 }}>V</div>
              <span style={{ fontSize: 18, fontWeight: 700 }}>VeriAI</span>
            </div>
            <p className="footer-brand-desc">
              Intelligent Institutional Verification and Compliance Platform. Verify Documents. Validate Institutions. Enable Trusted Decisions.
            </p>
          </div>
          <div>
            <div className="footer-title">Platform</div>
            <Link to="/app" className="footer-link">Dashboard</Link>
            <Link to="/app/applications" className="footer-link">Applications</Link>
            <Link to="/app/documents" className="footer-link">Documents</Link>
            <Link to="/app/compliance" className="footer-link">Compliance</Link>
          </div>
          <div>
            <div className="footer-title">Resources</div>
            <a href="#features" className="footer-link">Capabilities</a>
            <a href="#process" className="footer-link">Workflow</a>
            <a href="#about" className="footer-link">About</a>
          </div>
          <div>
            <div className="footer-title">Legal</div>
            <span className="footer-link">Privacy Policy (Demo)</span>
            <span className="footer-link">Terms of Use (Demo)</span>
            <span className="footer-link">Data Protection (Demo)</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VeriAI — SIH 2026 Prototype. All data is fictional.</span>
          <span>Problem Statement: SIH26261 • Organization: AICTE</span>
        </div>
      </footer>
    </div>
  );
}
