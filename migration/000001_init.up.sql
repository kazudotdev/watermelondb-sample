CREATE USER appuser;
CREATE SCHEMA app;
GRANT USAGE ON SCHEMA app TO appuser;
GRANT SELECT ON ALL TABLES IN SCHEMA public to appuser;

SET SEARCH_PATH = app;

CREATE TABLE users (
  id uuid PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
  id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_groups_owner_id FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE users_groups(
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  group_id uuid ,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_todos_owner_id FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_todos_group_id FOREIGN KEY (group_id) REFERENCES groups(id)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app to appuser;


-- permit to select, update, delete if user_id is same
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_todos ON todos FOR ALL TO appuser USING (owner_id = current_setting('app.uid')::UUID);
CREATE POLICY p_todos_insert ON todos FOR INSERT TO appuser WITH CHECK ( true );
