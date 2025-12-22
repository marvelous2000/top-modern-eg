-- =====================================================
-- TOP MODERN - Idempotent Supabase Database Setup Script
-- Premium Marble & Granite B2B Website
-- This script can be run multiple times to set up or update the schema
-- without breaking existing data.
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to execute arbitrary SQL (used by setup scripts)
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

-- =====================================================
-- 1. Main Database Setup Orchestrator Function
--    - Calls all sub-setup functions in a safe order
-- =====================================================
CREATE OR REPLACE FUNCTION admin_setup_database()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
AS $$
DECLARE
  result JSONB := '{}'::JSONB;
BEGIN
  -- Log start
  result := jsonb_set(result, '{started_at}', to_jsonb(NOW()));
  
  -- Execute setup steps in logical order
  RAISE NOTICE 'Setting up tables...';
  result := jsonb_set(result, '{tables}', setup_tables());
  
  RAISE NOTICE 'Setting up functions...';
  result := jsonb_set(result, '{functions}', setup_functions());
  
  RAISE NOTICE 'Setting up views...';
  result := jsonb_set(result, '{views}', setup_views());

  RAISE NOTICE 'Setting up triggers...';
  result := jsonb_set(result, '{triggers}', setup_triggers());
  
  RAISE NOTICE 'Setting up RLS policies...';
  result := jsonb_set(result, '{policies}', setup_rls_policies());

  RAISE NOTICE 'Setting up storage buckets...';
  result := jsonb_set(result, '{storage}', setup_storage_buckets());
  
  RAISE NOTICE 'Inserting/updating seed data...';
  result := jsonb_set(result, '{seed_data}', setup_seed_data());
  
  -- Log completion
  result := jsonb_set(result, '{completed_at}', to_jsonb(NOW()));
  result := jsonb_set(result, '{status}', '"success"'::JSONB);
  
  RETURN result;

EXCEPTION WHEN OTHERS THEN
  result := jsonb_set(result, '{error}', to_jsonb(SQLERRM));
  result := jsonb_set(result, '{status}', '"failed"'::JSONB);
  RETURN result;
END;
$$;

-- IMPORTANT: After creating admin_setup_database, you must set its owner to postgres
-- in Supabase to allow it to execute DDL statements (e.g., ALTER TABLE).
-- This can be done with: ALTER FUNCTION admin_setup_database() OWNER TO postgres;

-- =====================================================
-- SUB-FUNCTIONS FOR IDEMPOTENT SCHEMA SETUP
-- (These will be defined in subsequent steps)
-- =====================================================
