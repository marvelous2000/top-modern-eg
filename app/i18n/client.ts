'use client';

import { useTranslations as useTranslationsOriginal } from 'next-intl';

// This wrapper is simplified to only take the namespace
// and relies on next-intl to infer the locale from context
export function useTranslation(namespace: string) {
  return useTranslationsOriginal(namespace);
}
