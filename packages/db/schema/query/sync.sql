-- name: GetCreatedTodoListSince :many
SELECT *
FROM app.todos
WHERE created_at > $1;

-- name: GetUpdatedTodoListSince :many
SELECT *
FROM app.todos
WHERE updated_at > $1 AND created_at < $1;

-- name: GetDeletedTodoListSince :many
SELECT id
FROM app.todos
WHERE deleted_at > $1;

-- select json_build_object('created', 
-- json_agg(
--   jsonb_build_object(
--     'id', id,
--     'description', description
--   )
-- )) as changes from app.todos where created_at > $1;
