import Database from "./database";
import { createUser, getUser } from "../src/sqlc/pg/user_sql";
import {
  getUpdatedTodoListSince,
  getCreatedTodoListSince,
  getDeletedTodoListSince,
} from "../src/sqlc/pg/todo_sql";
import fs from "fs";
import { describe, test, beforeAll, afterAll, expect } from "vitest";

describe("start testcontainers", async () => {
  const db = new Database();
  beforeAll(async () => {
    const schema = fs.readFileSync("./schema/schema.sql", "utf8");
    await db.setup(schema);
  });

  afterAll(async () => {
    await db.stop();
  });

  test("pull todos's change list from postgres", async () => {
    // todos に適当なテストデータを入れておく
    const client = db.client();

    const seed = `INSERT INTO app.todos (id, description, owner_id, group_id, created_at, updated_at, deleted_at) VALUES 
  ('c3642d82-fd0d-42c4-9c49-226173302ec1', 'todo1', NULL, NULL, '2024-03-30 01:06:58.147646', '2024-03-30 01:07:05.886609', NULL), 
  ('1b055d91-a3f5-4f57-b28f-3f352eb25499', 'todo2', NULL, NULL, '2024-03-30 01:06:59.198828', '2024-03-30 01:07:06.886609', NULL),
  ('1416a9f9-6c9b-4a7c-aef7-b31e84e75a3e', 'todo3', NULL, NULL, '2024-03-30 01:07:04.149345', '2024-03-30 01:07:04.149345', '2024-03-31 01:07:05.886609'),
  ('c72ab88f-d446-4ee1-b2c6-97d7383291cb', 'todd4', NULL, NULL, '2024-03-30 01:07:05.886609', '2024-03-30 01:07:05.886609', NULL);`;

    await client.query(seed);
    const changes = await getCreatedTodoListSince(client, {
      createdAt: new Date("2024-03-30 01:07:04.149345"),
    });
    expect(changes.length).toBe(2);

    const updated = await getUpdatedTodoListSince(client, {
      updatedAt: new Date("2024-03-30 01:07:04.149345"),
    });
    expect(updated.length).toBe(2);
    expect(updated[0].description).toBe("todo1");
    expect(updated[1].description).toBe("todo2");

    const deleted = await getDeletedTodoListSince(client, {
      deletedAt: new Date("2024-03-30 01:07:04.149345"),
    });
    expect(deleted.length).toBe(1);
    expect(deleted[0].id).toBe("1416a9f9-6c9b-4a7c-aef7-b31e84e75a3e");
  });
});
