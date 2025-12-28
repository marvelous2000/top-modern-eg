-- Minimal schema for basic admin functionality
-- Create essential tables for products and projects

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  category TEXT CHECK (category IN ('marble', 'granite')),
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  origin TEXT,
  origin_ar TEXT,
  finish TEXT,
  finish_ar TEXT,
  thickness TEXT,
  applications TEXT[],
  applications_ar TEXT[],
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  specifications_ar JSONB DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  results TEXT[],
  results_ar TEXT[],
  materials TEXT[],
  materials_ar TEXT[],
  images TEXT[] DEFAULT '{}',
  testimonial JSONB,
  testimonial_ar JSONB,
  status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (for user management)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'user')) DEFAULT 'user',
  status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  first_name TEXT,
  last_name TEXT,
  avatar TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow authenticated users to read)
CREATE POLICY "Allow authenticated users to read products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to do everything
CREATE POLICY "Allow admins to manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
    )
  );

CREATE POLICY "Allow admins to manage projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
    )
  );

CREATE POLICY "Allow admins to manage profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
    )
  );
