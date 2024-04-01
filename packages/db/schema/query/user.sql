-- name: CreateUser :exec
WITH new_user AS ( 
	INSERT INTO app.users(id) VALUES (@id)
	RETURNING id
 ), new_group AS (
	INSERT INTO app.groups(owner_id)
	SELECT id AS owner_id FROM new_user
	RETURNING owner_id, id
) INSERT INTO app.users_groups (user_id, group_id)
SELECT owner_id AS user_id, id as group_id FROM new_group;

-- name: GetUserById :one
SELECT
  u.id,
  u.created_at,
  array_agg(g.id)::UUID[] AS group_ids
FROM app.users u
  INNER JOIN
    app.users_groups ug
  ON
    u.id = ug.user_id
  INNER JOIN
    app.groups g
  ON
    g.id = ug.group_id
WHERE u.id = $1
GROUP BY u.id;
