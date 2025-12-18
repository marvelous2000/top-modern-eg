export const LOCALES = ['en', 'ar'] as const;

/**
 * Normalize an internal action URL so that relative strings like "projects"
 * become absolute paths and are optionally prefixed with the current locale
 * when a locale can be derived from the current path.
 */
export function normalizeInternalUrl(raw?: string | null, currentPath?: string) {
  if (!raw) return raw;
  // Preserve external or special schemes
  if (/^(https?:)|^(mailto:)|^(tel:)/.test(raw)) return raw;

  // Ensure it starts with a slash
  const candidate = raw.startsWith('/') ? raw : `/${raw}`;

  // If candidate already locale-prefixed, keep it
  const parts = candidate.split('/');
  if (parts[1] && (LOCALES as readonly string[]).includes(parts[1])) return candidate;

  const currentLocale = currentPath ? currentPath.split('/')[1] : undefined;
  if (currentLocale && (LOCALES as readonly string[]).includes(currentLocale)) {
    return `/${currentLocale}${candidate}`;
  }

  return candidate;
}

export default normalizeInternalUrl;
