# Top Modern - Luxury Marble & Granite Website

A premium B2B website for Top Modern, showcasing luxury marble and granite solutions with a comprehensive admin dashboard.

## 🚀 Features

- **Premium Design**: Luxury marble and granite showcase with elegant UI
- **Admin Dashboard**: Complete CMS for managing products, projects, and contacts
- **Supabase Integration**: Real-time database with authentication and storage
- **Responsive Design**: Mobile-first approach with modern UI components
- **SEO Optimized**: Built with Next.js for optimal performance and SEO
- **Analytics**: Built-in contact tracking and form analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Deployment**: Netlify
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+
- pnpm
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd top-modern
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the database schema:
   ```bash
   # Copy the SQL from scripts/supabase-schema.sql
   # Paste and execute in Supabase SQL Editor
   ```
3. Create admin user:
   ```bash
   node scripts/create-superadmin.js admin@topmodern.com "YourSecurePassword123!" super_admin
   ```
4. Seed initial data:
   ```bash
   node scripts/seed-content.js
   ```

### 4. Development

```bash
pnpm dev
```

### 5. Build for Production

```bash
pnpm build
```

## 🌐 Deployment to Netlify

### Automatic Setup

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy! The `netlify.toml` config will automatically:
   - Run the build
   - Set up the database schema
   - Seed initial data

### Manual Database Setup

If you need to set up the database manually on Netlify:

```bash
# After deployment, run this in Netlify build hook or manually
node scripts/setup-netlify-db.js
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── (public)/          # Public pages
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                   # Utility libraries
│   ├── supabase/         # Database client setup
│   └── actions/          # Server actions
├── scripts/              # Setup and utility scripts
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔐 Admin Access

- **URL**: `/admin`
- **Default Admin**: admin@topmodern.com
- **Default Password**: (Set during setup)

## 📊 Database Schema

### Core Tables
- `profiles` - User management
- `products` - Marble/granite catalog
- `projects` - Portfolio/case studies
- `contacts` - CRM and leads
- `site_settings` - Global configuration

### Analytics Tables
- `contact_tracking` - User interactions
- `form_submissions` - All form data
- `analytics_events` - Custom events

## 🎨 Customization

### Branding
Update `site_settings` table or modify components in:
- `components/header.tsx`
- `components/footer.tsx`
- `app/layout.tsx`

### Content Management
All content is managed through the admin dashboard:
- Products: `/admin?page=products`
- Projects: `/admin?page=projects`
- Contacts: `/admin?page=contacts`

## 🔧 Development Scripts

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Database setup (local)
node scripts/create-superadmin.js
node scripts/seed-content.js

# Database setup (Netlify)
node scripts/setup-netlify-db.js
```

## 📈 Performance

- **Static Generation**: All public pages are statically generated
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Supabase CDN for media assets

## 🔒 Security

- **Row Level Security**: All database tables protected with RLS
- **Authentication**: Supabase Auth with role-based access
- **API Security**: Server-side validation and sanitization
- **Environment Variables**: Sensitive data properly secured

## 📞 Support

For technical issues:
1. Check the documentation in `docs/`
2. Review Supabase logs
3. Check Netlify deployment logs

## 📝 License

Private project - All rights reserved.

---

**Built with ❤️ for Top Modern Luxury Stone Solutions**
