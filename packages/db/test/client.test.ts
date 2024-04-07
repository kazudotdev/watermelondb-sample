import { adminClient, userClient } from "./global_setup";
import { GuardedClient } from "../src/client";
import { describe, test, expect } from "vitest";

describe("testcontainers", async () => {
  test("admin", async () => {
    const client = await adminClient();
    const res = await client.query("SELECT * from pg_tables");
    expect(res).not.toBeNull();
    client.release();
  });

  test("user", async () => {
    const client = await userClient();
    const guardClient = new GuardedClient(client, {
      userId: "xxxx",
    });
    const res = await guardClient.query("SELECT 1");
    expect(res).not.toBeNull();
    client.release();
  });

  test("client withDebug mode", async () => {
    const client = await userClient();
    const guard = new GuardedClient(client, { userId: "xxxxx" }).withDebug();
    await guard.query("select * from pg_tables");
  });
});
