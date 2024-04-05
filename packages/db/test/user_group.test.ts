import { userClient } from "./global_setup";
import { createUser, getUserById } from "../src/sqlc/pg/user_sql";
import {
  createGroup,
  getGroupById,
  getGroupByOwnerId,
} from "../src/sqlc/pg/group_sql";
import { describe, test, expect } from "vitest";

describe("users", async () => {
  test("create user", async () => {
    const conn = await userClient();
    await createUser(conn, {
      id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    const user = await getUserById(conn, {
      id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    expect(user).not.toBeNull();
    user && expect(user.id).toBe("7c5bc31c-1702-4109-bc0e-7229f0cf0ff8");
    user && expect(user.groupIds.length).toBe(1);

    conn.release();
  });

  test("join multiple groups", async () => {
    const testUuid = "ffffffff-eeee-cccc-bbbb-aaaaaaaaaaaa";
    const conn = await userClient();
    await createUser(conn, { id: testUuid });
    const group = await createGroup(conn, {
      ownerId: testUuid,
      name: "group1",
    });
    const groups = await getGroupByOwnerId(conn, {
      ownerId: testUuid,
    });
    const user = await getUserById(conn, { id: testUuid });
    expect(groups.length).toBe(2); // 2 groups, one has been already created when createUser.
    expect(user).not.toBeNull();
    user && expect(user.groupIds.includes(groups[0].id)).toBe(true);
    expect(group).not.toBeNull();
    group && user && expect(user.groupIds.includes(group.id));

    conn.release();
  });
});
