SET SEARCH_PATH = app;
DROP POLICY p_todos ON todos;
DROP POLICY p_todos_insert ON todos;
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
