import Database from "./database";
import { createUser, getUserById } from "../src/sqlc/pg/user_sql";
import {
  createGroup,
  getGroupById,
  getGroupByOwnerId,
} from "../src/sqlc/pg/group_sql";
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
    const user = await getUserById(client, {
      id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    expect(user).not.toBeNull();
    user && expect(user.id).toBe("7c5bc31c-1702-4109-bc0e-7229f0cf0ff8");
    user && expect(user.groupIds.length).toBe(1);
  });

  test("join multiple groups", async () => {
    const testUuid = "ffffffff-eeee-cccc-bbbb-aaaaaaaaaaaa";
    const client = db.client();
    await createUser(client, { id: testUuid });
    const group = await createGroup(client, {
      ownerId: testUuid,
      name: "group1",
    });
    const groups = await getGroupByOwnerId(client, {
      ownerId: testUuid,
    });
    const user = await getUserById(client, { id: testUuid });
    expect(groups.length).toBe(2); // 2 groups, one has been already created when createUser.
    expect(user).not.toBeNull();
    user && expect(user.groupIds.includes(groups[0].id)).toBe(true);
    expect(group).not.toBeNull();
    group && user && expect(user.groupIds.includes(group.id));
  });
});
