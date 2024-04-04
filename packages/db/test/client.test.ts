import Database from "./database";
import PostgresWrapper from "../src/client";
import { createUser, getUserById } from "../src/sqlc/pg/user_sql";
import { describe, test, beforeAll, afterAll, expect } from "vitest";
import fs from "fs";

describe("start testcontainers", async () => {
  const db = new Database();
  beforeAll(async () => {
    const schema = fs.readFileSync("./schema/schema.sql", "utf8");
    await db.setup(schema);
  });

  afterAll(async () => {
    await db.stop();
  });

  test("call client", async () => {
    const wrapperClient = new PostgresWrapper(db.client());
    await createUser(wrapperClient, {
      id: "7c5cc31c-1702-4109-bc0e-7229f0cf0ff8",
    });

    const res = await getUserById(wrapperClient, {
      id: "7c5cc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    expect(res).not.toBeNull();
    expect(res!.id).toBe("7c5cc31c-1702-4109-bc0e-7229f0cf0ff8");
  });
});
