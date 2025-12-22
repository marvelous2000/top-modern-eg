# Top Modern Full Repository Analysis TODO

## Project Context
Complete analysis of Netlify deployment issues including build failures, missing dependencies, hydration errors, broken authentication flows, and data cleanup.

## Analysis Scope
Full repository analysis

## Tasks

### 1. Build & Deployment Configuration
- **Type:** configuration_analysis
- **Title:** Build & Deployment Configuration
- **Files to Examine:**
  - netlify.toml
  - package.json
  - package-lock.json (or pnpm-lock.yaml)
  - next.config.js
  - .env.local
  - .env.example
- **Checks:**
  - Verify Netlify redirect rules match function endpoints
  - Check for missing dependencies in package.json vs. imports
  - Validate Node.js version compatibility
  - Check for conflicting build scripts
  - Verify environment variable consistency
- **Expected Patterns:**
  - netlify.toml: redirects for /auth/* and /api/*, functions with node_bundler: esbuild
  - package.json: required deps like @supabase/supabase-js, etc.

### 2. Netlify Functions Analysis
- **Type:** functions_analysis
- **Title:** Netlify Functions Analysis
- **Directory:** netlify/functions
- **Files to Examine:**
  - auth.js
  - create-superadmin.js
  - seed-content.js
  - setup-database.js
- **Checks:**
  - Validate function exports and handler signatures
  - Check for missing action cases in auth.js
  - Verify Supabase client initialization
  - Identify duplicate or conflicting functions
  - Check error handling and CORS configuration
- **Issue Patterns:**
  - auth.js: required actions (signIn, signOut, resetPassword, updatePassword)
  - create-superadmin.js: profile check order, auth user check

### 3. Mock Product Data Cleanup
- **Type:** mock_data_analysis
- **Title:** Mock Product Data Cleanup
- **Description:** Identify and remove hardcoded mock product data from the entire codebase
- **Files to Examine:**
  - scripts/seed-content.js
  - netlify/functions/seed-content.js
  - app/products/page.jsx
  - app/products/[slug]/page.jsx
  - app/admin/products/page.jsx
  - components/ProductCard.jsx
  - components/ProductGrid.jsx
  - lib/products.js
  - data/products.js
  - utils/products.js
- **Checks:**
  - Look for hardcoded product arrays
  - Identify inline mock data in UI components
  - Check for JSON files with sample product data
  - Find any test data in API routes or utilities
  - Look for fixture files containing mock products
- **Cleanup Instructions:**
  - Keep seed scripts but mark as development-only or move mock data to separate fixture files
  - Replace hardcoded product arrays with API/database calls
  - Move test/mock data to __tests__ or __mocks__ directories
  - Ensure no mock data remains in production code paths
- **Replacement Strategy:**
  1. Create proper API endpoints for product data fetching
  2. Update components to fetch from Supabase database
  3. Keep seed data only for development/staging environments
  4. Add environment checks: if (process.env.NODE_ENV === 'development') use mock data

### 4. Authentication Flow Mapping
- **Type:** authentication_flow_analysis
- **Title:** Authentication Flow Mapping
- **Flow Steps:**
  - Login Page → auth.js → Supabase
  - Password Reset → auth.js → Supabase Email
  - Session Management → Middleware → Pages
- **Files to Examine:**
  - app/admin/login/page.jsx
  - app/admin/page.jsx
  - app/admin/update-password/page.jsx
  - middleware.ts
  - app/auth/callback/route.js
- **Checks:**
  - Trace API call paths from UI to functions
  - Verify session cookie handling
  - Check for hydration errors in admin components
  - Validate redirect flows
  - Test password reset endpoint connectivity
- **Connection Test:**
  - Endpoints: /admin/login, /auth/reset-password, /admin/update-password

### 5. CLI Scripts Analysis
- **Type:** script_analysis
- **Title:** CLI Scripts Analysis
- **Directory:** scripts
- **Files to Examine:**
  - create-superadmin.js
  - seed-content.js
  - setup-netlify-db.js
- **Checks:**
  - Identify duplicate functionality with Netlify functions
  - Validate script dependencies
  - Check for logical errors
  - Verify environment variable usage
  - Test script executability
  - Check for hardcoded mock data in seed scripts
- **Recommendations:**
  - Keep: seed-content.js (but refactor to load from external JSON files)
  - Keep: create-superadmin.js (with fixed logic)
  - Remove: setup-netlify-db.js (use Supabase migrations instead)
  - Update: seed-content.js to not contain inline product arrays

### 6. Dependency Chain Analysis
- **Type:** dependency_analysis
- **Title:** Dependency Chain Analysis
- **Method:** import_trace
- **Steps:**
  - Run: npm list --all > dependency_tree.txt
  - Analyze import statements in all .js/.jsx/.ts/.tsx files
  - Check for runtime vs dev dependency mismatches
  - Identify packages requiring special bundling
- **Critical Dependencies:**
  - supabase_chain: @supabase/supabase-js, @supabase/realtime-js, @supabase/auth-js, @supabase/node-fetch
  - netlify_specific: whatwg-url, websocket
  - nextjs_edge_incompatible: @supabase/realtime-js

### 7. Hydration Analysis
- **Type:** hydration_analysis
- **Title:** React Hydration Issue Diagnosis
- **Files to Examine:**
  - app/admin/login/page.jsx
  - app/layout.jsx
  - app/admin/layout.jsx
- **Common Causes:**
  - Browser API calls during render (localStorage, window)
  - Dynamic theming without proper guards
  - Date/time formatting mismatches
  - Third-party UI library SSR issues
  - Async data fetching patterns
- **Diagnostic Steps:**
  1. Check console for specific hydration error messages
  2. Identify first client/server mismatch
  3. Look for conditional rendering based on window/document
  4. Check for dynamic imports without SSR handling

### 8. End-to-End Flow Testing
- **Type:** flow_validation
- **Title:** End-to-End Flow Testing
- **Test Scenarios:**
  - Password Reset Flow: Visit /admin/login → Click 'Forgot Password' → Enter email → Check Network tab → Verify response
  - Build Process: Run npm run build → Check for errors
  - Product Data Flow: Visit /products → Check Network tab for API calls → Verify no hardcoded data

### 9. Report Generation
- **Type:** report_generation
- **Title:** Issue Summary Report
- **Format:** Critical issues, functional issues, optimization issues
- **Output:** repository_analysis_report.md with sections like Executive Summary, Critical Issues, etc.

## Deliverables
- Complete issue inventory with file paths
- List of files containing mock product data
- Priority classification (critical/important/optimization)
- Specific code fixes for each issue
- Mock data cleanup strategy
- Step-by-step remediation plan
- Validation checklist for post-fix testing

## Notes
Mock product data in production code is a security and maintenance risk. It can cause confusion between real and fake data, and may expose development information in production.
