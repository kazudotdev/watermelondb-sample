-- name: CreateGroup :one
INSERT INTO app.groups (owner_id, name)
VALUES (@owner_id, @name) RETURNING id;

-- name: GetGroupByOwnerId :many
SELECT *
FROM app.groups
WHERE owner_id = $1;

-- name: GetGroupById :one
SELECT *
FROM app.groups
WHERE id = $1;
