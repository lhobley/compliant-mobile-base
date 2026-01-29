import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, FileCheck, Package, X, ChevronRight, Users, Settings, Scale, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, can } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Package, label: 'Inventory AI' },
    { to: '/checklists', icon: ClipboardCheck, label: 'Checklists' },
    { to: '/audits', icon: FileCheck, label: 'Audits' },
  ];

  // Only show Team Management if user has permission
  if (can('manage_team')) {
    navItems.push({ to: '/team', icon: Users, label: 'Team & Staff' });
  }

  // Only show Settings if owner
  if (can('manage_settings')) {
    navItems.push({ to: '/settings', icon: Settings, label: 'Settings' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 shadow-2xl lg:static lg:h-screen lg:shadow-none lg:translate-x-0 transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
            <h1 className="text-xl font-bold tracking-tight">Compliance<span className="text-blue-500">Daddy</span>™</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={`mr-3 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Legal Links (Small Footer in Nav) */}
          <div className="pt-8 pb-4 px-4">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Legal</p>
             <div className="space-y-1">
               <NavLink to="/legal/privacy" onClick={() => setIsOpen(false)} className="flex items-center text-xs text-slate-400 hover:text-white py-1">
                 <Shield size={14} className="mr-2" /> Privacy Policy
               </NavLink>
               <NavLink to="/legal/terms" onClick={() => setIsOpen(false)} className="flex items-center text-xs text-slate-400 hover:text-white py-1">
                 <Scale size={14} className="mr-2" /> Terms of Service
               </NavLink>
             </div>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div 
            onClick={() => {
              navigate('/team');
              setIsOpen(false);
            }}
            className="flex items-center p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-slate-800 group-hover:ring-slate-700">
              {user?.avatar}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${
                  user?.role === 'owner' ? 'bg-purple-500' :
                  user?.role === 'manager' ? 'bg-blue-500' : 'bg-green-500'
                }`}></span>
                <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
