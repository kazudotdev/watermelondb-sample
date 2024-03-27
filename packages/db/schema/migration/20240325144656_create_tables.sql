-- migrate:up
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



-- migrate:down
DROP TABLE app.todos;
DROP TABLE app.users_groups;
DROP TABLE app.groups;
DROP TABLE app.users;

