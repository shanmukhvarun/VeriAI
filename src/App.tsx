// ============================
// VeriAI — Main Application
// ============================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import DocumentVerification from './pages/DocumentVerification';
import InstitutionalRecords from './pages/InstitutionalRecords';
import ComplianceIntelligence from './pages/ComplianceIntelligence';
import InfrastructureReview from './pages/InfrastructureReview';
import ReviewQueue from './pages/ReviewQueue';
import AuditTrail from './pages/AuditTrail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="documents" element={<DocumentVerification />} />
          <Route path="records" element={<InstitutionalRecords />} />
          <Route path="compliance" element={<ComplianceIntelligence />} />
          <Route path="infrastructure" element={<InfrastructureReview />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
