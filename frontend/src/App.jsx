import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import Tenders from './pages/Tenders';
import DocumentVerification from './pages/DocumentVerification';
import VendorManagement from './pages/VendorManagement';
import RiskAnalysis from './pages/RiskAnalysis';
import Reports from './pages/Reports';
import AuditTrail from './pages/AuditTrail';
import NotificationsPage from './pages/NotificationsPage';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DocumentUploadModal from './components/DocumentUploadModal';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { VerificationProvider } from './context/VerificationContext';

function MainLayout() {
  const [isQuickUploadOpen, setIsQuickUploadOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans select-none animate-fade-up">
      {/* Sidebar Navigation */}
      <Sidebar onOpenUpload={() => setIsQuickUploadOpen(true)} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 animate-fade-up">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/documents" element={<DocumentVerification />} />
            <Route path="/vendors" element={<VendorManagement />} />
            <Route path="/risk" element={<RiskAnalysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Persistent Quick Upload Modal */}
      <DocumentUploadModal
        isOpen={isQuickUploadOpen}
        onClose={() => setIsQuickUploadOpen(false)}
        onUploadComplete={() => {
          setIsQuickUploadOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <VerificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </VerificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
