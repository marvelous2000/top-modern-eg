-- Create projects table for managing portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  client TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  testimonial JSONB DEFAULT '{"quote": "", "author": "", "position": ""}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Create index on featured for filtering
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active projects
CREATE POLICY "Anyone can view active projects"
  ON projects
  FOR SELECT
  USING (status = 'active' OR auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert projects
CREATE POLICY "Authenticated users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);
