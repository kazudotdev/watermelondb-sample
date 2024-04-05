import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getCreatedTodoListSinceQuery = `-- name: GetCreatedTodoListSince :many
SELECT id, description, owner_id, group_id, created_at, updated_at, deleted_at
FROM app.todos
WHERE created_at > $1`;

export interface GetCreatedTodoListSinceArgs {
    createdAt: Date | null;
}

export interface GetCreatedTodoListSinceRow {
    id: string;
    description: string | null;
    ownerId: string | null;
    groupId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export async function getCreatedTodoListSince(client: Client, args: GetCreatedTodoListSinceArgs): Promise<GetCreatedTodoListSinceRow[]> {
    const result = await client.query({
        text: getCreatedTodoListSinceQuery,
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
            updatedAt: row[5],
            deletedAt: row[6]
        };
    });
}

export const getUpdatedTodoListSinceQuery = `-- name: GetUpdatedTodoListSince :many
SELECT id, description, owner_id, group_id, created_at, updated_at, deleted_at
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
    deletedAt: Date | null;
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
            updatedAt: row[5],
            deletedAt: row[6]
        };
    });
}

export const getDeletedTodoListSinceQuery = `-- name: GetDeletedTodoListSince :many
SELECT id
FROM app.todos
WHERE deleted_at > $1`;

export interface GetDeletedTodoListSinceArgs {
    deletedAt: Date | null;
}

export interface GetDeletedTodoListSinceRow {
    id: string;
}

export async function getDeletedTodoListSince(client: Client, args: GetDeletedTodoListSinceArgs): Promise<GetDeletedTodoListSinceRow[]> {
    const result = await client.query({
        text: getDeletedTodoListSinceQuery,
        values: [args.deletedAt],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0]
        };
    });
}

export const createTodoQuery = `-- name: CreateTodo :one
INSERT INTO app.todos (
  owner_id,
  description
) VALUES ( $1, $2 ) RETURNING id, description, owner_id, group_id, created_at, updated_at, deleted_at`;

export interface CreateTodoArgs {
    ownerId: string | null;
    description: string | null;
}

export interface CreateTodoRow {
    id: string;
    description: string | null;
    ownerId: string | null;
    groupId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export async function createTodo(client: Client, args: CreateTodoArgs): Promise<CreateTodoRow | null> {
    const result = await client.query({
        text: createTodoQuery,
        values: [args.ownerId, args.description],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        description: row[1],
        ownerId: row[2],
        groupId: row[3],
        createdAt: row[4],
        updatedAt: row[5],
        deletedAt: row[6]
    };
}

