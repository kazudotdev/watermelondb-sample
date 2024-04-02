import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createGroupQuery = `-- name: CreateGroup :exec
INSERT INTO app.groups (owner_id, name)
VALUES ($1, $2) RETURNING id`;

export interface CreateGroupArgs {
    ownerId: string;
    name: string | null;
}

export interface CreateGroupRow {
    id: string;
}

export async function createGroup(client: Client, args: CreateGroupArgs): Promise<void> {
    await client.query({
        text: createGroupQuery,
        values: [args.ownerId, args.name],
        rowMode: "array"
    });
}

export const getGroupByOwnerIdQuery = `-- name: GetGroupByOwnerId :many
SELECT id, owner_id, name, created_at
FROM app.groups
WHERE owner_id = $1`;

export interface GetGroupByOwnerIdArgs {
    ownerId: string;
}

export interface GetGroupByOwnerIdRow {
    id: string;
    ownerId: string;
    name: string | null;
    createdAt: Date | null;
}

export async function getGroupByOwnerId(client: Client, args: GetGroupByOwnerIdArgs): Promise<GetGroupByOwnerIdRow[]> {
    const result = await client.query({
        text: getGroupByOwnerIdQuery,
        values: [args.ownerId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            ownerId: row[1],
            name: row[2],
            createdAt: row[3]
        };
    });
}

export const getGroupByIdQuery = `-- name: GetGroupById :one
SELECT id, owner_id, name, created_at
FROM app.groups
WHERE id = $1`;

export interface GetGroupByIdArgs {
    id: string;
}

export interface GetGroupByIdRow {
    id: string;
    ownerId: string;
    name: string | null;
    createdAt: Date | null;
}

export async function getGroupById(client: Client, args: GetGroupByIdArgs): Promise<GetGroupByIdRow | null> {
    const result = await client.query({
        text: getGroupByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        ownerId: row[1],
        name: row[2],
        createdAt: row[3]
    };
}

