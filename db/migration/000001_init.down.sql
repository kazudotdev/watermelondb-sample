REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM appuser;
REVOKE USAGE ON SCHEMA app FROM appuser;
DROP SCHEMA app;
DROP USER appuser;

-- Disable Row Level Security on todos table
-- ALTER TABLE todos DISABLE ROW LEVEL SECURITY;

-- Drop the policy named "p_todos"
-- DROP POLICY IF EXISTS p_todos ON todos;
