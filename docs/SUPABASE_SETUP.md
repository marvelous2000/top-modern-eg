# Supabase Database Setup Guide

## Overview
This document provides complete instructions for setting up the Supabase database for the Top Modern luxury marble and granite website.

## Database Schema

### Tables Created
1. **profiles** - User management with role-based access control
2. **products** - Marble and granite product catalog
3. **projects** - Portfolio and case studies
4. **contacts** - CRM and lead management
5. **contact_tracking** - User interaction analytics
6. **form_submissions** - All form data collection
7. **site_settings** - Global site configuration
8. **legal_pages** - Privacy policy, terms, etc.
9. **tracking_pixels** - Analytics pixel management
10. **analytics_events** - Custom event tracking

### Storage Buckets
- **uploads** - For product images, project photos, logos, and all media files

## Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Run Database Schema
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the entire content from `scripts/supabase-schema.sql`
4. Paste and execute the SQL

### Step 3: Configure Storage Bucket
The schema automatically creates the `uploads` bucket with public access for viewing.

**Bucket Configuration:**
- **Name:** uploads
- **Public:** Yes (for public viewing)
- **File Size Limit:** 50MB (recommended)
- **Allowed MIME Types:** image/*, video/*, application/pdf

### Step 4: Environment Variables
Add these to your `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Step 5: Create Admin User
The schema creates a default admin user:
- **Username:** admin
- **Email:** admin@topmodern.com
- **Role:** admin

**Important:** Update the password immediately after first login!

## Data Structure Details

### Products Table
\`\`\`typescript
{
  id: UUID
  name: string
  category: 'marble' | 'granite'
  slug: string
  description: string
  origin: string
  finish: string
  thickness: string
  applications: string[]
  images: string[]
  specifications: Record<string, string>
  status: 'active' | 'draft' | 'archived'
}
\`\`\`

### Projects Table
\`\`\`typescript
{
  id: UUID
  title: string
  category: string
  location: string
  year: string
  client: string
  slug: string
  description: string
  challenge: string
  solution: string
  results: string[]
  materials: string[]
  images: string[]
  testimonial: {
    quote: string
    author: string
    position: string
  }
  status: 'active' | 'draft' | 'archived'
  featured: boolean
}
\`\`\`

### Contacts Table (CRM)
\`\`\`typescript
{
  id: number
  name: string
  email: string
  company: string
  phone: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed'
  source: 'Contact Form' | 'Phone Call' | 'Website' | 'Email' | 'Referral'
  notes: string
  project_type: 'Commercial' | 'Residential' | 'Industrial'
  budget: string
  timeline: string
}
\`\`\`

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

- **Public tables:** Products, Projects, Legal Pages (read-only)
- **Authenticated only:** Contacts, Analytics, Settings management
- **Admin only:** User management, Settings updates

### Storage Security
- Public read access for uploaded media
- Authenticated users can upload files
- Users can only delete their own uploads

## Helper Functions

### Get Active Products
\`\`\`sql
SELECT * FROM get_active_products('marble');
\`\`\`

### Get Active Projects
\`\`\`sql
SELECT * FROM get_active_projects(10);
\`\`\`

## Analytics Views

### Contact Tracking Summary
\`\`\`sql
SELECT * FROM contact_tracking_summary;
\`\`\`

### Form Submissions Summary
\`\`\`sql
SELECT * FROM form_submissions_summary;
\`\`\`

### Products Summary
\`\`\`sql
SELECT * FROM products_summary;
\`\`\`

## File Upload Guidelines

### Recommended Image Sizes
- **Product Images:** 800x800px (square)
- **Project Images:** 1200x800px (landscape)
- **Logos:** 400x200px (transparent PNG)
- **Hero Images:** 1920x1080px

### File Naming Convention
\`\`\`
products/{product-slug}/{image-name}.jpg
projects/{project-slug}/{image-name}.jpg
logos/{logo-type}.png
\`\`\`

## Backup and Maintenance

### Automated Backups
Supabase provides automatic daily backups. Configure retention period in project settings.

### Manual Backup
\`\`\`bash
# Export database
supabase db dump -f backup.sql

# Export storage
supabase storage download uploads --recursive
\`\`\`

## Migration from localStorage

To migrate existing localStorage data to Supabase:

1. Export data from localStorage
2. Transform to match schema
3. Use Supabase client to bulk insert
4. Verify data integrity
5. Update application to use Supabase

## Troubleshooting

### Common Issues

**Issue:** RLS policies blocking access
**Solution:** Check user authentication and role assignments

**Issue:** Storage upload fails
**Solution:** Verify bucket policies and file size limits

**Issue:** Slow queries
**Solution:** Check indexes are created properly

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

For schema-specific questions:
- Review this documentation
- Check the SQL comments in `supabase-schema.sql`
