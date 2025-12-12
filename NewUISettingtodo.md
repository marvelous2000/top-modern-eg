# New UI Setting Todo: Implement LuxAdmin Theme on Admin Panel

## Overview
Implement the "LuxAdmin" premium theme on the admin panel only, ensuring no conflicts with the public site. This involves updating Tailwind configuration, global styles, and admin-specific components while preserving existing functionality.

## Todo List
- [ ] Update `tailwind.config.js` to extend colors with LuxAdmin palette (cream, gold, charcoal)
- [ ] Update `app/globals.css` for global font (Inter), scrollbar styling, and base backgrounds for light/dark modes
- [ ] Modify admin layout files (`app/admin/layout.tsx`, `app/admin/dashboard-layout.tsx`) to apply LuxAdmin backgrounds and text colors
- [ ] Update admin sidebar (`components/admin/admin-sidebar.tsx`) with LuxAdmin colors for sidebar, active nav items, etc.
- [ ] Update admin UI components (buttons, inputs, cards) to use LuxAdmin styles (rounded-lg/xl, shadows, focus rings)
- [ ] Ensure theme applies only to admin panel, not public site components
- [ ] Test theme in both light and dark modes within admin panel
- [ ] Verify no functionality changes or conflicts with existing admin features

## Notes
- Focus on visual theming only; do not modify system functionality
- Use conditional classes or admin-specific CSS to isolate theme to admin panel
- Follow design specs: gold accents, cream/charcoal bases, Inter font, custom scrollbar
