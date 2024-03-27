-- migrate:up
SET SEARCH_PATH = app;
-- permit to select, update, delete if user_id is same
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_todos ON todos FOR ALL TO appuser USING (owner_id = current_setting('app.uid')::UUID);
CREATE POLICY p_todos_insert ON todos FOR INSERT TO appuser WITH CHECK ( true );


-- migrate:down
SET SEARCH_PATH = app;
DROP POLICY p_todos ON todos;
DROP POLICY p_todos_insert ON todos;
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
