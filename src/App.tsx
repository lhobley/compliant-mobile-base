import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/layout/Layout';
import { InventoryHomePage } from './pages/inventory/InventoryHomePage';
import { CategoryDetailPage } from './pages/inventory/CategoryDetailPage';
import ChecklistPage from './pages/ChecklistPage';
import AuditPage from './pages/AuditPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

import LoginPage from './pages/LoginPage';

// Placeholder Dashboard for the main landing
const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">ComplianceDaddy™ Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Compliance Score</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">98%</p>
        <p className="text-sm text-gray-500 mt-1">Excellent</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Pending Audits</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">2</p>
        <p className="text-sm text-gray-500 mt-1">Due this week</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Inventory Alerts</h3>
        <p className="text-3xl font-bold text-red-600 mt-2">5</p>
        <p className="text-sm text-gray-500 mt-1">Critical items low</p>
      </div>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, requiredPermission }: { children: React.ReactNode, requiredPermission?: string }) => {
  const { user, loading, can } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryHomePage />} />
          <Route path="inventory/:sessionId/:categoryId" element={<CategoryDetailPage />} />
          <Route path="checklists" element={<ChecklistPage />} />
          <Route path="audits" element={<AuditPage />} />
          <Route 
            path="team" 
            element={<TeamPage />} 
          />
          <Route 
            path="settings" 
            element={<SettingsPage />} 
          />
          <Route path="legal/privacy" element={<PrivacyPolicy />} />
          <Route path="legal/terms" element={<TermsOfService />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
