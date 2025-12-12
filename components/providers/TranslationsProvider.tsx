'use client';

import React, { createContext, useContext } from 'react';

type Translations = Record<string, any>;

interface TranslationsContextType {
  locale: string;
  messages: Translations;
  t: (key: string) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

interface TranslationsProviderProps {
  locale: string;
  messages: Translations;
  children: React.ReactNode;
}

export function TranslationsProvider({ locale, messages, children }: TranslationsProviderProps) {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationsContext.Provider value={{ locale, messages, t }}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
}
