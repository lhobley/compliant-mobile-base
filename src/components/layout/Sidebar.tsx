import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, FileCheck, Package, X, ChevronRight, Users, Settings, Scale, Shield, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, can, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Package, label: 'Inventory AI' },
    { to: '/checklists', icon: ClipboardCheck, label: 'Checklists' },
    { to: '/audits', icon: FileCheck, label: 'Audits' },
  ];

  if (can('manage_team')) {
    navItems.push({ to: '/team', icon: Users, label: 'Team & Staff' });
  }

  if (can('manage_settings')) {
    navItems.push({ to: '/settings', icon: Settings, label: 'Settings' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 z-50 lg:static lg:h-screen lg:translate-x-0 transition-all duration-500 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10" />
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 ring-2 ring-white/20" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                Compliance<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Daddy</span>
              </h1>
              <p className="text-xs text-white/40 flex items-center">
                <Sparkles size={10} className="mr-1 text-yellow-400" />
                AI-Powered
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative mt-6 px-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden
                ${isActive 
                  ? 'text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {({ isActive }) => (
                <>
                  {/* Active background glow */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-90 rounded-xl" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-50 blur-xl" />
                    </>
                  )}
                  
                  {/* Hover glow */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  )}
                  
                  <item.icon size={20} className={`relative z-10 mr-3 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium tracking-wide">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Legal Links */}
          <div className="pt-8 pb-4 px-4">
             <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Legal</p>
             <div className="space-y-2">
               <NavLink to="/legal/privacy" onClick={() => setIsOpen(false)} className="flex items-center text-xs text-white/40 hover:text-white/80 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-all">
                 <Shield size={12} className="mr-2" /> Privacy
               </NavLink>
               <NavLink to="/legal/terms" onClick={() => setIsOpen(false)} className="flex items-center text-xs text-white/40 hover:text-white/80 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-all">
                 <Scale size={12} className="mr-2" /> Terms
               </NavLink>
             </div>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="relative p-4 border-t border-white/10 space-y-3">
          {/* Gradient line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div 
            onClick={() => {
              navigate('/team');
              setIsOpen(false);
            }}
            className="flex items-center p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                user?.role === 'owner' ? 'bg-purple-400' :
                user?.role === 'manager' ? 'bg-blue-400' : 'bg-green-400'
              }`} />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate capitalize">{user?.role}</p>
            </div>
            <ChevronRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all group border border-red-500/20 hover:border-red-500/40"
          >
            <LogOut size={18} className="mr-3 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-bold">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
