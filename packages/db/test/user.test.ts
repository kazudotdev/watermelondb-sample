import Database from "./database";
import { createUser, getUser } from "../src/sqlc/pg/user_sql";
import fs from "fs";
import { describe, test, beforeAll, afterAll, expect } from "vitest";

describe("users", async () => {
  const db = new Database();
  beforeAll(async () => {
    const schema = fs.readFileSync("./schema/schema.sql", "utf8");
    await db.setup(schema);
  });

  afterAll(async () => {
    await db.stop();
  });

  test("create user", async () => {
    const client = db.client();
    await createUser(client, {
      id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    const user = await getUser(client, {
      id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    expect(user).not.toBeNull();
    expect(user!.id).toBe("7c5bc31c-1702-4109-bc0e-7229f0cf0ff8");
  });
});
