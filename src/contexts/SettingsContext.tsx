import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';
import { IndexedDBService } from '../services/indexedDB';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  updateGeneralSettings: (settings: Partial<AppSettings['general']>) => Promise<void>;
  updateVerseSettings: (settings: Partial<AppSettings['verse']>) => Promise<void>;
  updatePrayerSettings: (settings: Partial<AppSettings['prayer']>) => Promise<void>;
  updateBackgroundSettings: (settings: Partial<AppSettings['background']>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await IndexedDBService.getSetting('appSettings');
      if (savedSettings) {
        setSettings(savedSettings);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: AppSettings) => {
    await IndexedDBService.saveSetting('appSettings', newSettings);
    setSettings(newSettings);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await saveSettings(updatedSettings);
  };

  const updateGeneralSettings = async (generalSettings: Partial<AppSettings['general']>) => {
    const updatedSettings = {
      ...settings,
      general: { ...settings.general, ...generalSettings },
    };
    await saveSettings(updatedSettings);
  };

  const updateVerseSettings = async (verseSettings: Partial<AppSettings['verse']>) => {
    const updatedSettings = {
      ...settings,
      verse: { ...settings.verse, ...verseSettings },
    };
    await saveSettings(updatedSettings);
  };

  const updatePrayerSettings = async (prayerSettings: Partial<AppSettings['prayer']>) => {
    const updatedSettings = {
      ...settings,
      prayer: { ...settings.prayer, ...prayerSettings },
    };
    await saveSettings(updatedSettings);
  };

  const updateBackgroundSettings = async (backgroundSettings: Partial<AppSettings['background']>) => {
    const updatedSettings = {
      ...settings,
      background: { ...settings.background, ...backgroundSettings },
    };
    await saveSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateGeneralSettings,
        updateVerseSettings,
        updatePrayerSettings,
        updateBackgroundSettings,
      }}
    >
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
