'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, defaultSettings } from '@/lib/types';

interface SettingsContextType {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
  initialSettings: SiteSettings | null;
}

export function SettingsProvider({ children, initialSettings }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || defaultSettings);

  useEffect(() => {
    // This effect ensures that if the server-provided settings change (e.g., on navigation),
    // the state is updated.
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    // This effect listens for live updates from the admin panel.
    const handleSettingsUpdate = (event: CustomEvent<SiteSettings>) => {
      setSettings(event.detail);
      // Also update localStorage so other tabs get the update.
      localStorage.setItem("siteSettings", JSON.stringify(event.detail));
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);

    // Also, try to load from localStorage on initial client mount,
    // in case it's more up-to-date than the server-rendered initialSettings.
    const savedSettings = localStorage.getItem("siteSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
      }
    }

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
