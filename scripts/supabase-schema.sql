-- =====================================================
-- TOP MODERN - Complete Supabase Database Schema
-- Premium Marble & Granite B2B Website
-- =====================================================

CREATE OR REPLACE FUNCTION exec(sql_query text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Backwards-compatible RPC name used by setup scripts
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (User Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer', 'advertiser')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PRODUCTS TABLE (Marble & Granite Catalog)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT,
  category TEXT NOT NULL CHECK (category IN ('marble', 'granite')),
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  origin TEXT,
  origin_ar TEXT,
  finish TEXT,
  finish_ar TEXT,
  thickness TEXT,
  applications TEXT[] DEFAULT '{}', -- Array of application types
  applications_ar TEXT[] DEFAULT '{}',
  images TEXT[], -- Array of image URLs
  specifications JSONB DEFAULT '{}', -- Flexible key-value specifications
  specifications_ar JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- 3. PROJECTS TABLE (Portfolio/Case Studies)
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_ar TEXT,
  category TEXT NOT NULL,
  category_ar TEXT,
  location TEXT,
  location_ar TEXT,
  year TEXT,
  client TEXT,
  client_ar TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  challenge TEXT,
  challenge_ar TEXT,
  solution TEXT,
  solution_ar TEXT,
  results TEXT[] DEFAULT '{}', -- Array of result bullet points
  results_ar TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}', -- Array of materials used
  materials_ar TEXT[] DEFAULT '{}',
  images TEXT[], -- Array of image URLs
  testimonial JSONB, -- {quote, author, position}
  testimonial_ar JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- 4. CONTACTS TABLE (CRM/Lead Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Closed')),
  source TEXT DEFAULT 'Contact Form' CHECK (source IN ('Contact Form', 'Phone Call', 'Website', 'Email', 'Referral')),
  notes TEXT,
  project_type TEXT CHECK (project_type IN ('Commercial', 'Residential', 'Industrial')),
  budget TEXT,
  timeline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- 5. CONTACT_TRACKING TABLE (User Interaction Analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_tracking (
  id SERIAL PRIMARY KEY,
  method TEXT NOT NULL CHECK (method IN ('phone_call', 'email_click', 'whatsapp_click', 'cta_click')),
  details JSONB, -- {number, email, source, etc.}
  user_agent TEXT,
  url TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. FORM_SUBMISSIONS TABLE (All Form Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id SERIAL PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact_form', 'quote_request', 'newsletter', 'consultation')),
  form_data JSONB NOT NULL, -- Flexible form field storage
  user_agent TEXT,
  url TEXT,
  ip_address INET,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- 8. SITE_SETTINGS TABLE (Global Configuration)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('logo.main', '/top-modern-logo-gold.png'),
  ('logo.footer', '/top-modern-logo-gold.png'),
  ('logo.admin', '/top-modern-logo-gold.png'),
  ('logo.background', ''),
  ('contact.phone1', '+20 123 456 7890'),
  ('contact.phone2', '+971 50 123 4567'),
  ('contact.email1', 'info@topmodern.com'),
  ('contact.email2', 'sales@topmodern.com'),
  ('contact.whatsapp', '+201234567890'),
  ('social.facebook', 'https://facebook.com/topmodern'),
  ('social.instagram', 'https://instagram.com/topmodern'),
  ('social.linkedin', 'https://linkedin.com/company/topmodern'),
  ('company.name', 'Top Modern'),
  ('company.description', 'Premium marble and granite solutions'),
  ('company.address', 'MENA Region')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 8. LEGAL_PAGES TABLE (Privacy Policy, Terms, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type TEXT UNIQUE NOT NULL CHECK (page_type IN ('privacy_policy', 'terms_of_service', 'cookie_policy', 'disclaimer')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- 9. TRACKING_PIXELS TABLE (Analytics Pixel Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS tracking_pixels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('facebook', 'google_analytics', 'google_ads', 'linkedin', 'twitter', 'tiktok', 'custom')),
  pixel_id TEXT,
  code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  pages TEXT[], -- Array of page paths where pixel should load
  events TEXT[], -- Array of events to track
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- 10. ANALYTICS_EVENTS TABLE (Custom Event Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  url TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Products indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Projects indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Contacts indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- Contact tracking indexes
CREATE INDEX idx_contact_tracking_method ON contact_tracking(method);
CREATE INDEX idx_contact_tracking_created_at ON contact_tracking(created_at DESC);

-- Form submissions indexes
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at DESC);

-- Analytics events indexes
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_pixels ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies (Public read, authenticated write)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Projects policies (Public read, authenticated write)
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Contacts policies (Authenticated only)
CREATE POLICY "Contacts are viewable by authenticated users" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert contacts" ON contacts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Contact tracking policies (Public insert, authenticated read)
CREATE POLICY "Anyone can insert contact tracking" ON contact_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact tracking" ON contact_tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Form submissions policies (Public insert, authenticated read)
CREATE POLICY "Anyone can submit forms" ON form_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view form submissions" ON form_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Site settings policies (Public read, admin write)
CREATE POLICY "Settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Legal pages policies (Public read, admin write)
CREATE POLICY "Legal pages are viewable by everyone" ON legal_pages
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can manage legal pages" ON legal_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tracking pixels policies (Authenticated only)
CREATE POLICY "Authenticated users can view pixels" ON tracking_pixels
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage pixels" ON tracking_pixels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Analytics events policies (Public insert, authenticated read)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_pages_updated_at BEFORE UPDATE ON legal_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracking_pixels_updated_at BEFORE UPDATE ON tracking_pixels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKET CONFIGURATION
-- =====================================================
-- Note: Run this in Supabase Dashboard SQL Editor or via Supabase CLI

-- Create uploads bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for uploads bucket
CREATE POLICY "Public can view uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update their uploads" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'uploads' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete their uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'uploads' AND
    auth.role() = 'authenticated'
  );

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert default admin user (password should be hashed in production)
INSERT INTO profiles (username, email, first_name, last_name, role, status)
VALUES ('admin', 'admin@topmodern.com', 'Admin', 'User', 'admin', 'active')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View for contact tracking summary
CREATE OR REPLACE VIEW contact_tracking_summary AS
SELECT
  method,
  COUNT(*) as total_interactions,
  DATE_TRUNC('day', created_at) as interaction_date
FROM contact_tracking
GROUP BY method, DATE_TRUNC('day', created_at)
ORDER BY interaction_date DESC;

-- View for form submissions summary
CREATE OR REPLACE VIEW form_submissions_summary AS
SELECT
  form_type,
  status,
  COUNT(*) as total_submissions,
  DATE_TRUNC('day', created_at) as submission_date
FROM form_submissions
GROUP BY form_type, status, DATE_TRUNC('day', created_at)
ORDER BY submission_date DESC;

-- View for active products count
CREATE OR REPLACE VIEW products_summary AS
SELECT
  category,
  status,
  COUNT(*) as total_products
FROM products
GROUP BY category, status;

-- View for active projects count
CREATE OR REPLACE VIEW projects_summary AS
SELECT
  status,
  featured,
  COUNT(*) as total_projects
FROM projects
GROUP BY status, featured;

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to get active products by category
CREATE OR REPLACE FUNCTION get_active_products(product_category TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  slug TEXT,
  description TEXT,
  images TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.category, p.slug, p.description, p.images
  FROM products p
  WHERE p.status = 'active'
    AND (product_category IS NULL OR p.category = product_category)
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get active projects
CREATE OR REPLACE FUNCTION get_active_projects(limit_count INT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  slug TEXT,
  description TEXT,
  images TEXT[],
  featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.title, p.category, p.slug, p.description, p.images, p.featured
  FROM projects p
  WHERE p.status = 'active'
  ORDER BY p.featured DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Schema created successfully!
-- Next steps:
-- 1. Connect Supabase to your project
-- 2. Run this schema in Supabase SQL Editor
-- 3. Configure storage bucket in Supabase Dashboard
-- 4. Update environment variables with Supabase credentials
-- =====================================================

-- Create a table for storing dashboard metrics like total contacts and page views
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID for a single row
  total_contacts BIGINT NOT NULL DEFAULT 0,
  total_page_views BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one row exists in the table. This is a common pattern for global settings.
-- First, create a function to enforce the single row constraint
CREATE OR REPLACE FUNCTION enforce_single_row_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM dashboard_metrics) > 0 THEN
        RAISE EXCEPTION 'Only one row is allowed in the dashboard_metrics table.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Then, create a trigger that calls the. function before an insert
CREATE TRIGGER single_row_metrics_trigger
BEFORE INSERT ON dashboard_metrics
FOR EACH ROW
EXECUTE FUNCTION enforce_single_row_metrics();

-- Insert an initial row if it doesn't exist
INSERT INTO dashboard_metrics (id, total_contacts, total_page_views)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Function to increment page views
CREATE OR REPLACE FUNCTION increment_page_views_function()
RETURNS void AS $$
BEGIN
    UPDATE dashboard_metrics
    SET total_page_views = total_page_views + 1,
        updated_at = NOW()
    WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
END;
$$ LANGUAGE plpgsql;

-- Function to increment total contacts
CREATE OR REPLACE FUNCTION increment_total_contacts_function()
RETURNS void AS $$
BEGIN
    UPDATE dashboard_metrics
    SET total_contacts = total_contacts + 1,
        updated_at = NOW()
    WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
END;
$$ LANGUAGE plpgsql;