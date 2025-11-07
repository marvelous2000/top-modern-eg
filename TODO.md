# Project Improvement Plan & TODO List

This document outlines a plan for improving the TopModern website, including new features, bug fixes, and code quality enhancements.

---

## Tier 1: High Priority User Experience

### 1. Mobile & Responsive Layout Overhaul
- **Goal:** Ensure the entire website is fully responsive and provides an excellent user experience on all devices (mobile, tablet, desktop).
- **Tasks:**
  - [ ] Conduct a full audit of all pages (public and admin) on different screen sizes.
  - [ ] Fix layout-breaking issues, starting with the most critical pages (Home, Products, Admin Dashboard).
  - [ ] Ensure navigation is mobile-friendly, considering a collapsible sidebar for the admin panel.
  - [ ] Test on real devices or using browser developer tools.

### 2. Theme & UI Polish
- **Goal:** Implement and verify a consistent dark/light mode experience and polish the UI.
- **Tasks:**
  - [ ] **Admin Panel Theme:** A theme toggle already exists in the admin navigation. Verify it works correctly across all admin pages and components. Fix any components that do not respect the theme change.
  - [ ] **Public Site Theme Toggle:** Add a theme toggle button to the main website navigation (`components/navigation.tsx` or `components/header.tsx`) so users can switch between light and dark modes.
  - [ ] **UI Consistency:** Review UI elements (buttons, forms, cards) for consistent styling and spacing across the application.

### 3. Logo Size Update (from previous TODO)
- **Goal:** Increase the visibility of the company logo.
- **Tasks:**
  - [x] Update logo size in `components/header.tsx` (e.g., from `h-8` to `h-16`).
  - [x] Update logo size in `components/footer.tsx` (e.g., from `h-8` to `h-16`).
  - [x] Update logo size in `components/admin/admin-navigation.tsx` (e.g., from `h-8` to `h-16`).

---

## Tier 2: Feature Implementation

### 1. Complete Dynamic Pages
- **Goal:** Build out the functionality for the dynamic product and project pages.
- **Tasks:**
  - [ ] **Product Detail Page (`app/products/[slug]/page.tsx`):**
    - [ ] Fetch product data from Supabase based on the `slug`.
    - [ ] Display product images, description, specifications, etc.
    - [ ] Add a "Get a Quote" or "Contact Us" CTA.
  - [ ] **Project Detail Page (`app/projects/[slug]/page.tsx`):**
    - [ ] Fetch project data from Supabase based on the `slug`.
    - [ ] Create a gallery or carousel for project images.
    - [ ] Display project details, materials used, and a description of the work.

### 2. Enhance Admin Dashboard
- **Goal:** Make the admin dashboard more informative and actionable.
- **Tasks:**
  - [ ] **Key Metrics:** Display key statistics at a glance (e.g., new leads this month, total projects, number of products).
  - [ ] **Recent Activity:** Show a feed of recent contact form submissions or leads.
  - [ ] **Charts:** Add charts to visualize trends (e.g., leads over time).

---

## Tier 3: Code Quality & Future-Proofing

### 1. Implement a Testing Strategy
- **Goal:** Ensure code reliability and prevent regressions.
- **Tasks:**
  - [ ] **Setup:** Configure Vitest and React Testing Library for the project.
  - [ ] **Unit Tests:** Write tests for critical utility functions and components (e.g., form validation, `AuthGuard`).
  - [ ] **Integration Tests:** Write tests for key user flows like admin login and the contact form submission.

### 2. SEO & Content
- **Goal:** Improve search engine visibility.
- **Tasks:**
  - [ ] **Dynamic Sitemap:** Generate a `sitemap.xml` file based on products, projects, and static pages.
  - [ ] **Structured Data:** Add JSON-LD schema for the organization, products, and projects to enhance search result appearance.
  - [ ] **Meta Tags:** Ensure all pages have unique, descriptive `<title>` and `<meta name="description">` tags.

### 3. Advanced Admin Features (Future)
- **Goal:** Add more robust management capabilities to the admin panel.
- **Tasks:**
  - [ ] **Role-Based Access Control (RBAC):** Introduce different user roles (e.g., Admin, Editor) with different permissions.
  - [ ] **Audit Trail:** Log important actions taken by admins (e.g., user created, project deleted) for accountability.