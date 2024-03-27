-- name: CreateUser :exec
INSERT INTO app.users (id) VALUES (@id) RETURNING *;

-- name: GetUser :one
SELECT * FROM app.users
WHERE id = $1 LIMIT 1;
