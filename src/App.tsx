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
import ReportsPage from './pages/ReportsPage';
import AuditPage from './pages/AuditPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

import LoginPage from './pages/LoginPage';

// Futuristic Dashboard with glassmorphism and animations
const Dashboard = () => {
  const stats = [
    { label: 'Compliance Score', value: '98%', subtext: 'Excellent', color: 'from-green-400 to-emerald-600', icon: '✓' },
    { label: 'Pending Audits', value: '2', subtext: 'Due this week', color: 'from-blue-400 to-cyan-600', icon: '📋' },
    { label: 'Inventory Alerts', value: '5', subtext: 'Critical items low', color: 'from-orange-400 to-red-600', icon: '⚠' },
    { label: 'AI Insights', value: '12', subtext: 'New detections', color: 'from-purple-400 to-pink-600', icon: '🤖' },
  ];

  return (
    <div className="space-y-8">
      {/* Header with glow effect */}
      <div className="relative">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 animate-gradient">
            ComplianceDaddy™
          </span>
        </h1>
        <p className="text-white/60 text-lg">Your AI-powered compliance command center</p>
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            {/* Icon */}
            <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">
              {stat.label}
            </h3>
            <p className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-white/40 text-sm mt-1">{stat.subtext}</p>
            
            {/* Animated border */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Start Audit', desc: 'Voice-guided compliance check', color: 'from-blue-500 to-cyan-500', icon: '🎤' },
          { title: 'Inventory Count', desc: 'AI-powered stock management', color: 'from-purple-500 to-pink-500', icon: '📸' },
          { title: 'View Reports', desc: 'Analytics and insights', color: 'from-green-500 to-emerald-500', icon: '📊' },
        ].map((action, i) => (
          <button
            key={i}
            className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
            <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10" />
            <div className="relative z-10">
              <div className="text-4xl mb-3 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{action.title}</h3>
              <p className="text-white/60 text-sm">{action.desc}</p>
            </div>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Audit completed', time: '2 hours ago', status: 'success' },
            { action: 'Inventory updated', time: '5 hours ago', status: 'info' },
            { action: 'AI detected 3 issues', time: '1 day ago', status: 'warning' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-green-400 shadow-lg shadow-green-400/50' :
                  item.status === 'warning' ? 'bg-orange-400 shadow-lg shadow-orange-400/50' :
                  'bg-blue-400 shadow-lg shadow-blue-400/50'
                } animate-pulse`} />
                <span className="text-white/80">{item.action}</span>
              </div>
              <span className="text-white/40 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

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
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audits" element={<AuditPage />} />
          <Route 
            path="team" 
            element={<TeamPage />} 
          />
          <Route 
            path="settings" 
            element={<SettingsPage />} 
          />
          <Route path="pricing" element={<PricingPage />} />
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
