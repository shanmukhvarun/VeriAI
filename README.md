# VeriAI — Intelligent Institutional Verification & Compliance Platform

**Verify Documents. Validate Institutions. Enable Trusted Decisions.**

VeriAI is an AI-assisted institutional verification and compliance platform designed to streamline the review of institutional applications, validate submitted documents, identify discrepancies, and support evidence-based regulatory decisions.

Developed as a prototype for **Smart India Hackathon (SIH) 2026**, under Problem Statement **SIH26261**, associated with AICTE, Ministry of Education.

---

## Overview

Institutional approval and compliance processes involve reviewing multiple documents, validating information, checking regulatory requirements, and identifying inconsistencies. Manual verification can be time-consuming and difficult to track.

VeriAI provides a centralized workspace for managing institutional applications, examining documents, evaluating compliance rules, prioritizing potential risks, and maintaining an audit trail of review activities.

The platform combines document-processing utilities, configurable compliance checks, risk scoring, and reviewer workflows in a single interface.

## Key Features

### 1. Application Management
- View and manage institutional applications.
- Search, filter, sort, and paginate application records.
- Access application details, documents, findings, compliance results, and review history.

### 2. Document Verification
- Upload documents through a drag-and-drop interface.
- Extract basic text from supported PDF documents.
- Generate SHA-256 file hashes for file identification.
- Compare extracted fields to identify potential mismatches.
- Check document dates and certificate expiry.
- Detect duplicate files by comparing their hashes.

### 3. Compliance Intelligence
- Configure and evaluate compliance rules.
- Identify missing information and potential requirement violations.
- View evaluation results to support the review process.

### 4. Risk Assessment
- Calculate risk scores using configured weights and identified findings.
- Highlight applications requiring additional attention.
- Display findings to help reviewers understand potential compliance issues.

### 5. Institutional Records
- Browse searchable institutional records.
- Review institution details and related application information.
- Use demonstration records to explore the verification workflow.

### 6. Review and Decision Workflow
- Access a centralized review queue.
- Examine findings and supporting information.
- Add reviewer comments and resolve findings.
- Request additional documents.
- Record review decisions within the prototype.

### 7. Audit Trail and Reports
- View a timeline of recorded activities.
- Search audit events and export audit data to CSV.
- Explore application-level reports and analytics.

### 8. Dashboard and Settings
- Monitor key metrics, processing status, and priority alerts.
- Explore charts and application summaries.
- Switch between light and dark themes.
- Configure available demo settings and risk weights.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript |
| Build Tool | Vite 5 |
| Routing | React Router 6 |
| State Management | Zustand |
| Data Persistence | Browser localStorage |
| Visualizations | Recharts |
| Icons | Lucide React |
| Styling | Custom CSS design system |
| Date Utilities | date-fns |
| Document Processing | Browser-side PDF text extraction and Web Crypto API |

---

## System Workflow

```text
Institutional Application
          |
          v
    Document Upload
          |
          v
  Text Extraction & Hashing
          |
          v
 Field and Date Validation
          |
          v
 Compliance Rule Evaluation
          |
          v
  Findings & Risk Assessment
          |
          v
     Reviewer Workspace
          |
          v
 Decision Recording & Audit
          |
          v
 Reports and Analytics
```

The workflow represents the platform's intended verification process. Some institution records, extraction results, issuer checks, and demonstration findings are simulated.

## Project Structure

```text
VeriAI/
├── public/
├── src/
│   ├── components/
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── Overview.tsx
│   │   ├── Applications.tsx
│   │   ├── ApplicationDetail.tsx
│   │   ├── DocumentVerification.tsx
│   │   ├── InstitutionalRecords.tsx
│   │   ├── ComplianceIntelligence.tsx
│   │   ├── InfrastructureReview.tsx
│   │   ├── ReviewQueue.tsx
│   │   ├── AuditTrail.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── types.ts
│   ├── data.ts
│   └── store.ts
├── index.html
├── package.json
└── README.md
```

*Note: The structure above describes the main files in the current project; supporting configuration and asset files may also be present.*

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- Git installed
- A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/shanmukhvarun/VeriAI.git
cd VeriAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the application

Open the local URL displayed in your terminal, typically:

```text
http://localhost:5173
```

### 5. Create a production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Demonstration Scenarios

The current prototype includes demonstration scenarios to illustrate how the verification workflow operates.

### Scenario A — Deccan Institute of Technology
- Demonstrates a comparatively clean application.
- Shows matching document fields and verified demo results.
- Displays a low risk score and compliance summary.

### Scenario B — Horizon College of Engineering
- Demonstrates an application containing potential issues.
- Includes an expired certificate, an institution-name mismatch, missing documentation, and a duplicate file hash.
- Shows a higher risk score and findings requiring review.

**Important:** These institutions and their associated demonstration results are fictional. They must not be interpreted as real institutional verification outcomes.

---

## Implementation Status

VeriAI is a demonstration prototype. The following distinctions are important when evaluating its capabilities.

### Implemented in the current prototype
- Basic browser-side PDF text extraction.
- SHA-256 file hashing.
- Field comparison and mismatch detection.
- Date validation and expiry checks.
- Duplicate-file detection using hashes.
- Configurable compliance rule evaluation.
- Risk score calculation from findings.
- Review actions, comments, and decision recording.
- Audit event timeline and CSV export.
- Dashboard charts and browser-based state persistence.
- Dark mode and demonstration role-based navigation.

### Simulated or demonstration-based
- Institutional records and institution details.
- Some extracted document fields and OCR-related results.
- Issuer verification responses.
- Seeded anomaly findings and demonstration decisions.

### Not currently configured
- Live AICTE portal or restricted institutional database connectivity.
- External issuer API integrations.
- Digital-signature trust verification.
- Advanced computer-vision-based tampering detection.
- Production-grade authentication and authorization.
- A dedicated backend database for persistent, multi-user operation.

---

## Security and Verification Considerations

- SHA-256 hashes help identify identical file contents; they do not prove that a document is authentic.
- A detected mismatch is a signal for investigation, not conclusive proof of fraud.
- Compliance scores and risk scores support prioritization but should not replace human judgment.
- Production deployment requires secure authentication, access control, server-side validation, protected storage, and appropriate audit safeguards.
- Sensitive institutional documents should only be processed and stored with proper authorization.

## Future Enhancements

Potential improvements include:

- Advanced OCR and structured field extraction.
- Cross-document consistency checking.
- Evidence-backed anomaly detection and explainable risk scoring.
- Document image-forensics techniques for identifying suspicious alterations.
- Integration with authorized institutional registries and issuer verification services.
- Backend APIs and persistent database storage.
- Production-grade authentication and role-based permissions.
- Tamper-evident audit logs and automated testing.

These are proposed enhancements, not claims that the functionality is already available.

---

## Demo Walkthrough

For a short project demonstration:

1. Open the landing page and introduce the problem VeriAI addresses.
2. Explore the dashboard and application overview.
3. Open the clean demonstration application.
4. Examine the application containing seeded compliance issues.
5. Upload a sample document and demonstrate the available extraction and hashing features.
6. Review findings and record a demonstration decision.
7. Open the audit trail and reports section.

## Disclaimer

VeriAI is an academic and hackathon demonstration prototype. Institutional data and seeded verification outcomes are fictional. The application is not connected to live AICTE systems and does not independently establish the authenticity of official documents. It is not a production regulatory system, and its demonstration decisions have no official authority. Real-world use would require validated data sources, security controls, appropriate integrations, and review by authorized personnel.

---

**Developed for Smart India Hackathon 2026**

Repository: [github.com/shanmukhvarun/VeriAI](https://github.com/shanmukhvarun/VeriAI)

*Building more transparent, traceable, and efficient institutional verification workflows.*
