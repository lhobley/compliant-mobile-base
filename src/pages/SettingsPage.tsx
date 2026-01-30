import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  LogOut, User, Shield, Sun, Moon, Monitor, 
  Mic, MicOff, Brain, BrainCircuit 
} from 'lucide-react';

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
    iconOn: IconOn, 
    iconOff: IconOff,
    label,
    description 
  }: { 
    enabled: boolean; 
    onToggle: () => void;
    iconOn: React.ElementType;
    iconOff: React.ElementType;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          {enabled ? <IconOn size={20} /> : <IconOff size={20} />}
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Monitor className="mr-2 text-purple-500" size={20} />
            Appearance
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Choose your preferred theme</p>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === 'light' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className="mx-auto mb-2 text-orange-500" size={24} />
              <p className="text-sm font-medium text-gray-900">Light</p>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className="mx-auto mb-2 text-indigo-500" size={24} />
              <p className="text-sm font-medium text-gray-900">Dark</p>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === 'system' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className="mx-auto mb-2 text-gray-500" size={24} />
              <p className="text-sm font-medium text-gray-900">System</p>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Current mode: <span className="font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="mr-2 text-green-500" size={20} />
            Features
          </h2>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          <Toggle
            enabled={voiceEnabled}
            onToggle={() => setVoiceEnabled(!voiceEnabled)}
            iconOn={Mic}
            iconOff={MicOff}
            label="Voice Guidance"
            description="Enable voice-guided audits and inventory counts"
          />
          <Toggle
            enabled={aiFeaturesEnabled}
            onToggle={() => setAiFeaturesEnabled(!aiFeaturesEnabled)}
            iconOn={BrainCircuit}
            iconOff={Brain}
            label="AI Features"
            description="Enable AI photo analysis and smart suggestions"
          />
        </div>
        {!aiFeaturesEnabled && (
          <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-100">
            <p className="text-sm text-yellow-700">
              AI features are disabled. You can still use manual input for all features.
            </p>
          </div>
        )}
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="mr-2 text-blue-500" size={20} />
            Account
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Role</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="mr-2 text-green-500" size={20} />
            Security
          </h2>
        </div>
        <div className="p-6">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Change Password
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Session</h2>
          <p className="text-sm text-red-600 mb-4">Sign out of your account on this device</p>
          <button 
            onClick={handleLogout}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
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
