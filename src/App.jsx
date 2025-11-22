import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/citizen/Dashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyReports from './pages/citizen/MyReports';
import Profile from './pages/citizen/Profile';
import CommunityValidation from './pages/citizen/CommunityValidation';
import ReportDetails from './pages/citizen/ReportDetails';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import { CivicProvider } from './context/CivicContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

  const handleNavigate = (view, reportId = null) => {
    setCurrentView(view);
    if (reportId) {
      setSelectedReportId(reportId);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (authView === 'signup') {
      return <Signup onNavigate={setAuthView} />;
    }
    return <Login onNavigate={setAuthView} />;
  }

  // Admin Portal
  if (user.role === 'admin') {
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  // Citizen Portal
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'report':
        return <ReportIssue onBack={() => setCurrentView('dashboard')} />;
      case 'my-reports':
        return <MyReports onBack={() => setCurrentView('dashboard')} onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onBack={() => setCurrentView('dashboard')} onNavigate={handleNavigate} />;
      case 'validation':
        return <CommunityValidation onBack={() => setCurrentView('dashboard')} onNavigate={handleNavigate} />;
      case 'report-details':
        return <ReportDetails reportId={selectedReportId} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate}>
      {renderView()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <CivicProvider>
        <AppContent />
      </CivicProvider>
    </AuthProvider>
  );
}

export default App;
