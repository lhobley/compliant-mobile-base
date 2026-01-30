import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  voiceEnabled: boolean;
  aiFeaturesEnabled: boolean;
}

interface SettingsContextType extends AppSettings {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setAiFeaturesEnabled: (enabled: boolean) => void;
  isDarkMode: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  voiceEnabled: true,
  aiFeaturesEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compliancedaddy_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('compliancedaddy_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle dark mode
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let dark = false;
      if (settings.theme === 'dark') dark = true;
      else if (settings.theme === 'system') dark = systemDark;
      
      setIsDarkMode(dark);
      
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const setVoiceEnabled = (voiceEnabled: boolean) => {
    setSettings(prev => ({ ...prev, voiceEnabled }));
  };

  const setAiFeaturesEnabled = (aiFeaturesEnabled: boolean) => {
    setSettings(prev => ({ ...prev, aiFeaturesEnabled }));
  };

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setTheme,
      setVoiceEnabled,
      setAiFeaturesEnabled,
      isDarkMode,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
