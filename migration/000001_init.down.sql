DROP TABLE app.users;
DROP TABLE app.todos;
DROP TABLE app.users_groups;
DROP TABLE app.groups;

-- Disable Row Level Security on todos table
-- ALTER TABLE todos DISABLE ROW LEVEL SECURITY;

-- Drop the policy named "p_todos"
-- DROP POLICY IF EXISTS p_todos ON todos;
