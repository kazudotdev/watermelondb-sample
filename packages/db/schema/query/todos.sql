-- name: Get :exec
--INSERT INTO app.users (id) VALUES (@id) RETURNING *;
--
---- name: GetUser :one
--SELECT * FROM app.users
--WHERE id = $1 LIMIT 1;

-- name: GetTodosChangeList :many
--select json_build_object('created', 
--json_agg(
--  jsonb_build_object(
--    'id', id,
--    'description', description,
--  )
--)) as changes from app.todos where created_at > $1;
