# Admin Login Fix - TODO

This file outlines the steps to diagnose and fix the hydration error and password reset functionality on the admin login page.

## Task 1: Diagnose Hydration Error (COMPLETED)

-   **Action:** Examined `app/admin/login/page.tsx` (originally `.jsx`).
-   **Findings:** Hydration error was due to `settings.logo.background` causing a mismatch between server and client rendering.
-   **Fix:** Implemented `useState` and `useEffect` to set the background image on the client-side, ensuring server-rendered default and client-side update.

## Task 2: Check Password Reset Flow (COMPLETED - Diagnosis)

-   **Action:** Examined `app/admin/login/page.tsx` and `components/admin/reset-password-form.tsx`.
-   **Findings:**
    -   The login page links to `/auth/reset-password`.
    -   `ResetPasswordForm` was originally using `supabase.auth.resetPasswordForEmail` directly, not the Netlify function.
    -   The user's reported error "Valid action required" indicated a call to the Netlify function where `action` was missing or incorrect. This implied the desired flow was via Netlify function.

## Task 3: Fix Hydration Error (COMPLETED)

-   **Action:** Applied fix to `app/admin/login/page.tsx`.
-   **Solution:** Changed `backgroundImage` to use a `bgImage` state variable, initialized with a default and updated from `localStorage` within `useEffect`.

## Task 4: Fix Password Reset Request (COMPLETED)

-   **Action:** Modified `components/admin/reset-password-form.tsx` and `netlify/functions/auth.js`.
-   **Details:**
    -   `reset-password-form.tsx` now uses `fetch('/auth', { method: 'POST', body: JSON.stringify({ action: 'resetPassword', email: email }) })`.
    -   `netlify/functions/auth.js` was updated to include a `case 'resetPassword'` in its switch statement, which calls `supabase.auth.resetPasswordForEmail`.

## Task 5: Validation (PENDING - User Action Required)

-   **Action:** Test the complete flow.
-   **Tests:**
    -   [ ] **Hydration test:** Run the dev server (`npm run dev`) and check the browser console for hydration warnings.
    -   [ ] **Password reset test:**
        1.  Open browser DevTools → Network tab.
        2.  Trigger the forgot password form.
        3.  Verify request shows:
            -   URL: `/auth`
            -   Method: `POST`
            -   Payload: `{"action":"resetPassword","email":"test@example.com"}`
        4.  Check response for success/error.
    -   [ ] **Environment check:** Verify that `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL` are set.
