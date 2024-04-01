import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createUserQuery = `-- name: CreateUser :exec
WITH new_user AS ( 
	INSERT INTO app.users(id) VALUES ($1)
	RETURNING id
 ), new_group AS (
	INSERT INTO app.groups(owner_id)
	SELECT id AS owner_id FROM new_user
	RETURNING owner_id, id
) INSERT INTO app.users_groups (user_id, group_id)
SELECT owner_id AS user_id, id as group_id FROM new_group`;

export interface CreateUserArgs {
    id: string;
}

export async function createUser(client: Client, args: CreateUserArgs): Promise<void> {
    await client.query({
        text: createUserQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const getUserByIdQuery = `-- name: GetUserById :one
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
GROUP BY u.id`;

export interface GetUserByIdArgs {
    id: string;
}

export interface GetUserByIdRow {
    id: string;
    createdAt: Date | null;
    groupIds: string[];
}

export async function getUserById(client: Client, args: GetUserByIdArgs): Promise<GetUserByIdRow | null> {
    const result = await client.query({
        text: getUserByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        createdAt: row[1],
        groupIds: row[2]
    };
}

