import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getCreatedTodosListSinceQuery = `-- name: GetCreatedTodosListSince :many
SELECT id, description, owner_id, group_id, created_at, updated_at
FROM app.todos
WHERE created_at > $1`;

export interface GetCreatedTodosListSinceArgs {
    createdAt: Date | null;
}

export interface GetCreatedTodosListSinceRow {
    id: string;
    description: string | null;
    ownerId: string | null;
    groupId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getCreatedTodosListSince(client: Client, args: GetCreatedTodosListSinceArgs): Promise<GetCreatedTodosListSinceRow[]> {
    const result = await client.query({
        text: getCreatedTodosListSinceQuery,
        values: [args.createdAt],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            description: row[1],
            ownerId: row[2],
            groupId: row[3],
            createdAt: row[4],
            updatedAt: row[5]
        };
    });
}

export const getUpdatedTodoListSinceQuery = `-- name: GetUpdatedTodoListSince :many
SELECT id, description, owner_id, group_id, created_at, updated_at
FROM app.todos
WHERE updated_at > $1 AND created_at < $1`;

export interface GetUpdatedTodoListSinceArgs {
    updatedAt: Date | null;
}

export interface GetUpdatedTodoListSinceRow {
    id: string;
    description: string | null;
    ownerId: string | null;
    groupId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getUpdatedTodoListSince(client: Client, args: GetUpdatedTodoListSinceArgs): Promise<GetUpdatedTodoListSinceRow[]> {
    const result = await client.query({
        text: getUpdatedTodoListSinceQuery,
        values: [args.updatedAt],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            description: row[1],
            ownerId: row[2],
            groupId: row[3],
            createdAt: row[4],
            updatedAt: row[5]
        };
    });
}

