-- Creates a PostgreSQL function to execute arbitrary SQL.
-- WARNING: This gives the service role the power to execute any SQL.
-- Ensure that the service role key is kept secret and that this function
-- is only called from trusted server-side environments.
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql;
