'use client';

import { useTranslations as useTranslationsOriginal } from 'next-intl';

export function useTranslation<TNamespace extends Parameters<typeof useTranslationsOriginal>[0] | undefined = undefined>(
  ...args: Parameters<typeof useTranslationsOriginal<TNamespace>>
) {
  return useTranslationsOriginal<TNamespace>(...args);
}
