import {
  type StartedTestContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import { Client } from "pg";
import { createUser, getUser } from "../src/gen/sqlc/pg/user_sql";
import fs from "fs";
import { describe, test, beforeAll, afterAll, expect } from "vitest";

describe("start testcontainers", async () => {
  let postgres: StartedTestContainer;
  let client: Client;
  beforeAll(async () => {
    postgres = await new GenericContainer("postgres:16-alpine")
      .withWaitStrategy(Wait.forListeningPorts())
      .withEnvironment({
        POSTGRES_PASSWORD: "password",
        POSTGRES_USER: "appuser",
        POSTGRES_DB: "testdb",
      })
      .withExposedPorts(5432)
      .start();
    client = new Client({
      host: postgres.getHost(),
      port: postgres.getMappedPort(5432),
      database: "testdb",
      user: "appuser",
      password: "password",
    });

    await client.connect();
    await client.query("SELECT 1");

    const schema = fs.readFileSync("./db/schema.sql", "utf8");

    // migration
    await client.query(schema);
  });

  afterAll(async () => {
    await client.end();
    await postgres.stop();
  });

  test("setup", async () => {
    expect(true).toBe(true);
  });

  test("create user", async () => {
    await createUser(client, { id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8" });
    const user = await getUser(client, {
      id: "7c5bc31c-1702-4109-bc0e-7229f0cf0ff8",
    });
    expect(user).not.toBeNull();
    expect(user!.id).toBe("7c5bc31c-1702-4109-bc0e-7229f0cf0ff8");
  });
});
