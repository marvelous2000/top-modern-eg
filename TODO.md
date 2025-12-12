# Fix Arabic Content Loading Issue

## Problem
Browser not loading messages when Arabic content is requested. The app has next-intl configured but layouts and pages aren't properly set up to use translations.

## Root Cause
- App has both root layout and locale-specific layouts, causing conflicts
- Locale layout doesn't set up NextIntlClientProvider
- Pages and components are hardcoded in English, not using translation hooks
- Navigation component doesn't use translations

## Plan
1. Remove conflicting root layout.tsx
2. Update [locale]/layout.tsx to properly set up next-intl with NextIntlClientProvider
3. Update app/[locale]/page.tsx to use translation hooks
4. Update Navigation component to use translations
5. Test Arabic locale loading

## Files to Edit
- Remove: app/layout.tsx
- Edit: app/[locale]/layout.tsx
- Edit: app/[locale]/page.tsx
- Edit: components/Navigation.tsx
