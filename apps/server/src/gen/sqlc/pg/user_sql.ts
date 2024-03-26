import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createUserQuery = `-- name: CreateUser :exec
INSERT INTO app.users (id) VALUES ($1) RETURNING id, created_at`;

export interface CreateUserArgs {
    id: string;
}

export interface CreateUserRow {
    id: string;
    createdAt: Date | null;
}

export async function createUser(client: Client, args: CreateUserArgs): Promise<void> {
    await client.query({
        text: createUserQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const getUserQuery = `-- name: GetUser :one
SELECT id, created_at FROM app.users
WHERE id = $1 LIMIT 1`;

export interface GetUserArgs {
    id: string;
}

export interface GetUserRow {
    id: string;
    createdAt: Date | null;
}

export async function getUser(client: Client, args: GetUserArgs): Promise<GetUserRow | null> {
    const result = await client.query({
        text: getUserQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        createdAt: row[1]
    };
}

