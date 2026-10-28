# VeriAI — Intelligent Institutional Verification and Compliance Platform

> **Verify Documents. Validate Institutions. Enable Trusted Decisions.**

Built for **Smart India Hackathon 2026** | Problem Statement **SIH26261** | Organization: **AICTE**, Ministry of Education

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 Overview

VeriAI is an AI-assisted verification platform for institutional application validation, document authentication, and regulatory compliance assessment. It demonstrates how AI can help authorized AICTE officials validate institutional approval applications.

### Key Features

- **Landing Page** — Premium product showcase with capabilities and workflow
- **Overview Dashboard** — KPI cards, charts, processing pipeline, priority alerts
- **Application Management** — Full CRUD, search, filter, sort, pagination
- **Application Detail** — 7-tab workspace with documents, findings, compliance, timeline
- **Document Verification** — Drag-drop upload, SHA-256 hashing, processing animation, OCR
- **Institutional Records** — Searchable expandable cards for 5 demo institutions
- **Compliance Intelligence** — Configurable rule builder with evaluation results
- **Infrastructure Review** — Evidence upload, image preview, assessment workflow
- **Review Queue** — Two-column workspace with findings, actions, decision recording
- **Audit Trail** — Searchable timeline with CSV export
- **Reports & Analytics** — Interactive charts and per-application verification reports
- **Settings** — Theme toggle, role switching, risk weights, notification preferences

### Demo Scenarios

**Demo A — Deccan Institute of Technology (app-001)**
- All documents verified, fields match, low risk score (12)
- Compliance score 96%, decision recorded

**Demo B — Horizon College of Engineering (app-002)**
- Expired NBA certificate, institution name mismatch
- Missing NOC, duplicate file hash, infrastructure concerns
- High risk score (72), multiple pending findings

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router 6 |
| State | Zustand (persisted to localStorage) |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Custom CSS Design System |
| Date Utils | date-fns |

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app with routes
├── main.tsx                   # Entry point
├── index.css                  # Complete design system
├── types.ts                   # TypeScript type definitions
├── data.ts                    # Seed data (5 institutions, 6 apps)
├── store.ts                   # Zustand state management
├── components/
│   └── DashboardLayout.tsx    # Sidebar + Topbar + Outlet
└── pages/
    ├── LandingPage.tsx        # Public landing page
    ├── Overview.tsx            # Dashboard overview
    ├── Applications.tsx        # Application list
    ├── ApplicationDetail.tsx   # Application workspace
    ├── DocumentVerification.tsx # Document upload & analysis
    ├── InstitutionalRecords.tsx # Institution records browser
    ├── ComplianceIntelligence.tsx # Rule builder & results
    ├── InfrastructureReview.tsx # Infrastructure evidence
    ├── ReviewQueue.tsx         # Reviewer workspace
    ├── AuditTrail.tsx          # Event timeline
    ├── Reports.tsx             # Analytics & reports
    └── Settings.tsx            # Configuration & about
```

---

## ⚖️ Implementation vs Simulation Boundaries

### Actually Implemented
- PDF text extraction (basic browser-side)
- SHA-256 file hashing (Web Crypto API)
- Field comparison & mismatch detection
- Date validation & expiry checks
- Duplicate file detection via hash
- Configurable compliance rule evaluation
- Risk score computation from findings
- Full review workflow (resolve, comment, request docs, record decision)
- Audit trail with all events
- CSV export for audit data
- Role-based UI navigation (demo)
- Dark mode
- Persistent state (localStorage)

### Simulated (Demo Data)
- Institutional records (entirely fictional)
- OCR extracted fields (partially simulated based on filename)
- Issuer verification responses
- Demo approval decisions
- Seeded anomaly findings for Demo B

### Not Configured / Unavailable
- Live AICTE portal connectivity
- Restricted institutional database access
- External issuer API integration
- Digital signature trust verification
- Advanced computer vision analysis
- Production authentication & authorization

---

## 🎯 5-Minute SIH Demo Procedure

1. **Landing Page** (30s) — Show hero, capabilities, workflow
2. **Dashboard** (45s) — KPIs, charts, pipeline, priority panel
3. **Demo A: Clean Case** (60s) — Open Deccan Institute app, show verified documents, matching fields, compliance
4. **Demo B: Issues Case** (90s) — Open Horizon College app, show expired cert, name mismatch, missing NOC, duplicate hash
5. **Document Upload** (45s) — Upload a file, watch processing animation, see hash & fields
6. **Review Queue** (45s) — Resolve a finding, add comment, record decision
7. **Reports** (30s) — Generate verification report for an application

---

## ⚠️ Disclaimer

This is a demonstration prototype. All institutional data, documents, and verification results are entirely fictional. This application does not have live AICTE database connectivity. Demo decisions are simulated and have no regulatory authority. AI assists decision-making — final decisions must remain with competent authorities.

---

*Built with ❤️ for SIH 2026*
# VeriAI
# VeriAI
