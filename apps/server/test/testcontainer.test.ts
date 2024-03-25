import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { describe, test, beforeAll, afterAll, expect } from "vitest";

const __dirname = import.meta.dirname;
import * as path from "path";

describe("start testcontainers", async () => {
  let psqlContainer: StartedPostgreSqlContainer;
  beforeAll(async () => {
    psqlContainer = await new PostgreSqlContainer()
      .withCopyFilesToContainer([{
        source: path.resolve("../db/migration/000001_init.up.sql"),
        target: "/docker-entrypoint-initdb.d/init.sql"
      }])
      .withDefaultLogDriver()
      .start();
    const res = await psqlContainer.exec("ls /docker-entrypoint-initdb.d/");
    console.log({ res: res.output });
  });

  afterAll(async () => {
    await psqlContainer.stop();
  });

  test("setup", () => {
    expect(true).toBe(true);
  });
});
