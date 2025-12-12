# Mail Configuration and Authentication Flow Implementation Plan

This document outlines the steps to implement the authentication flows (password reset, admin invites) and deploy the application.

## Phase 3: Implement Authentication Flows

### 1. Password Reset Flow

1.  **Create "Forgot Password" Page:**
    *   Create a new page/component at a route like `/admin/reset-password`.
    *   This page will contain a form with a single email input field and a "Send Reset Instructions" button.

2.  **Implement `resetPasswordForEmail` Logic:**
    *   When the form is submitted, call a server action.
    *   This server action will use the Supabase client to call `supabase.auth.resetPasswordForEmail('user@example.com', { redirectTo: 'https://example.com/auth/update-password' })`.
    *   The `redirectTo` URL should point to the "Update Password" page you'll create next.

3.  **Create "Update Password" Page:**
    *   Create a new page/component at the `redirectTo` path (e.g., `/admin/update-password`).
    *   This page will have a form with a "New Password" input field and a "Confirm Password" input field.

4.  **Implement `updateUser` Logic:**
    *   This page component should be a client component to handle the session.
    *   Use a `useEffect` hook to listen for the `PASSWORD_RECOVERY` event from Supabase auth.
    *   When the form is submitted, call a server action that uses the Supabase client to call `supabase.auth.updateUser({ password: new_password })`.
    *   Provide feedback to the user on successful password update and redirect them to the login page.

### 2. Admin Invite Flow

1.  **Create Server-Side Logic for Invites:**
    *   Create a Next.js Route Handler or a Server Action that is protected and only accessible by authenticated admins.
    *   This endpoint will receive an email address to invite.
    *   Implement the `supabase.auth.admin.inviteUserByEmail('user@example.com', { redirectTo: 'https://example.com/auth/set-password' })` call.

2.  **Create UI for Admin to Send Invites:**
    *   In the admin dashboard, create a section (e.g., in a "Users" management page) with a form to enter an email address and a button to "Send Invite".
    *   This form will call the server-side logic you created above.

3.  **Create "Set Password" Page:**
    *   Create a new page/component at the `redirectTo` path for invites (e.g., `/auth/set-password`).
    *   This page will be similar to the "Update Password" page.
    *   It will allow the user who clicked the invite link to set their initial password. The logic will be almost identical to the password update, using `supabase.auth.updateUser()`.

## Phase 4: Deployment and Configuration

### 1. Configure Netlify

1.  **Add Environment Variables:**
    *   In your Netlify project dashboard, go to `Site configuration` > `Environment variables`.
    *   Add `NEXT_PUBLIC_SUPABASE_URL` with your Supabase project URL.
    *   Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase anon public key.
    *   Add `SUPABASE_SERVICE_ROLE_KEY` if you are using admin functions (like inviting users).

2.  **Update Supabase URL Configuration:**
    *   In your Supabase project dashboard, go to `Authentication` > `URL Configuration`.
    *   Set the `Site URL` to your live Netlify site URL (e.g., `https://your-site.netlify.app`).
    *   Add any authentication callback URLs to the `Redirect URLs` list (e.g., `https://your-site.netlify.app/auth/confirm/**`).

### 2. Deploy to Netlify

1.  **Push to Git:**
    *   Ensure your latest code is pushed to your Git repository (GitHub, GitLab, etc.).

2.  **Connect and Deploy:**
    *   In Netlify, create a new site and connect it to your Git repository.
    *   Configure the build settings (usually Next.js is detected automatically).
    *   Trigger a deployment. Netlify will automatically build and deploy your site on every push to the main branch.

### 3. Final Testing

1.  **Test Password Reset:**
    *   Go to your live Netlify site's "Forgot Password" page.
    *   Enter a user's email and request a reset link.
    *   Check the email, click the link, and try to set a new password.
    *   Try to log in with the new password.

2.  **Test Admin Invite:**
    *   Log in as an admin on your live site.
    *   Go to the user management section and invite a new user via email.
    *   Check the invited user's email, click the link, and set a password.
    *   Try to log in as the new user.
