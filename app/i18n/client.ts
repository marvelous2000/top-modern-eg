'use client';

import { useTranslations as useTranslationsOriginal } from 'next-intl';

export function useTranslation(...args: Parameters<typeof useTranslationsOriginal>) {
  return useTranslationsOriginal(...args);
}
