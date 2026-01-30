import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  LogOut, User, Shield, Sun, Moon, Monitor, 
  Mic, MicOff, Brain, BrainCircuit, Sparkles, Zap, Palette,
  CreditCard, Crown, ExternalLink
} from 'lucide-react';
import POSIntegrationSettings from '../components/POSIntegrationSettings';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { 
    theme, setTheme, 
    voiceEnabled, setVoiceEnabled,
    aiFeaturesEnabled, setAiFeaturesEnabled,
    isDarkMode 
  } = useSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Toggle = ({ 
    enabled, 
    onToggle, 
    icon: Icon,
    label,
    description,
    color = 'blue'
  }: { 
    enabled: boolean; 
    onToggle: () => void;
    icon: React.ElementType;
    label: string;
    description: string;
    color?: string;
  }) => (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
          enabled 
            ? `bg-${color}-500/20 text-${color}-400 shadow-lg shadow-${color}-500/20` 
            : 'bg-white/5 text-white/40'
        }`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="font-bold text-white">{label}</p>
          <p className="text-sm text-white/50">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
          enabled ? `bg-${color}-500 shadow-lg shadow-${color}-500/50` : 'bg-white/10'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Section = ({ title, icon: Icon, children, color = 'blue' }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
    color?: string;
  }) => (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden group">
      {/* Glow effect */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-500 via-${color}-400 to-${color}-500 opacity-50`} />
      
      <div className="px-6 py-4 border-b border-white/5 flex items-center">
        <div className={`p-2 rounded-lg mr-3 bg-${color}-500/20 text-${color}-400`}>
          <Icon size={20} />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative mb-8">
        <h1 className="text-4xl font-black text-white mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Settings
          </span>
        </h1>
        <p className="text-white/50">Manage your account and preferences</p>
        <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
      </div>

      {/* POS Integrations */}
      {user?.role === 'owner' && <POSIntegrationSettings />}

      {/* Appearance Section */}
      <Section title="Appearance" icon={Palette} color="purple">
        <p className="text-sm text-white/50 mb-4">Choose your preferred theme</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', icon: Sun, label: 'Light', color: 'from-orange-400 to-yellow-400' },
            { value: 'dark', icon: Moon, label: 'Dark', color: 'from-indigo-400 to-purple-400' },
            { value: 'system', icon: Monitor, label: 'System', color: 'from-blue-400 to-cyan-400' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value as any)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                theme === option.value 
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                  : 'border-white/10 hover:border-white/30 bg-white/5'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <option.icon className="text-white" size={24} />
              </div>
              <p className="text-sm font-bold text-white">{option.label}</p>
              {theme === option.value && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40 mt-4">
          Current mode: <span className="font-bold text-white/60">{isDarkMode ? 'Dark' : 'Light'}</span>
        </p>
      </Section>

      {/* Features Section */}
      <Section title="Features" icon={Zap} color="yellow">
        <div className="divide-y divide-white/5">
          <Toggle
            enabled={voiceEnabled}
            onToggle={() => setVoiceEnabled(!voiceEnabled)}
            icon={voiceEnabled ? Mic : MicOff}
            label="Voice Guidance"
            description="Enable voice-guided audits and inventory counts"
            color="cyan"
          />
          <Toggle
            enabled={aiFeaturesEnabled}
            onToggle={() => setAiFeaturesEnabled(!aiFeaturesEnabled)}
            icon={aiFeaturesEnabled ? BrainCircuit : Brain}
            label="AI Features"
            description="Enable AI photo analysis and smart suggestions"
            color="purple"
          />
        </div>
        {!aiFeaturesEnabled && (
          <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-400">
              <Zap size={14} className="inline mr-2" />
              AI features are disabled. Manual input is still available.
            </p>
          </div>
        )}
      </Section>

      {/* Account Section */}
      <Section title="Account" icon={User} color="blue">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-sm text-white/50 mb-1">Email</p>
              <p className="font-bold text-white">{user?.email}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-white/40">
              <User size={18} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-sm text-white/50 mb-1">Role</p>
              <p className="font-bold text-white capitalize">{user?.role}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
              user?.role === 'owner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              user?.role === 'manager' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
      </Section>

      {/* Subscription Section */}
      <Section title="Subscription" icon={CreditCard} color="purple">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mr-3">
                  <Crown size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">Current Plan</p>
                  <p className="text-sm text-white/50">Professional</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Next billing date</span>
              <span className="text-white">Feb 15, 2026</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/pricing')}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group"
            >
              <ExternalLink size={16} className="mx-auto mb-1 text-white/40 group-hover:text-white/60" />
              <span className="text-sm text-white/80">Change Plan</span>
            </button>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
              <CreditCard size={16} className="mx-auto mb-1 text-white/40 group-hover:text-white/60" />
              <span className="text-sm text-white/80">Billing History</span>
            </button>
          </div>
        </div>
      </Section>

      {/* Security Section */}
      <Section title="Security" icon={Shield} color="green">
        <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left group">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Change Password</p>
              <p className="text-sm text-white/50">Update your account password</p>
            </div>
            <Shield className="text-white/30 group-hover:text-green-400 transition-colors" size={24} />
          </div>
        </button>
      </Section>

      {/* Logout Section */}
      <div className="relative rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-lg border border-red-500/20 overflow-hidden p-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-50" />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">End Session</h2>
            <p className="text-sm text-white/50">Sign out of your account</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
          >
            <LogOut className="mr-2" size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
