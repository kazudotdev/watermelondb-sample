-- name: CreateUser :exec
--WITH new_user AS ( 
--	INSERT INTO app.users(id) VALUES (@id)
--	RETURNING id
-- ), new_group AS (
--	INSERT INTO app.groups(owner_id)
--	SELECT id AS owner_id FROM new_user
--	RETURNING owner_id, id
--) INSERT INTO app.users_groups (user_id, group_id)
--SELECT owner_id AS user_id, id as group_id FROM new_group;

-- name: GetUser :one
SELECT * FROM app.users
WHERE id = $1 LIMIT 1;
