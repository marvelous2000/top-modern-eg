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

-- Then, create a trigger that calls the function before an insert
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