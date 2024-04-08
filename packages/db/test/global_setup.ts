import {
  GenericContainer,
  Wait,
  type StartedTestContainer,
} from "testcontainers";
import { Connection, type DatabaseConfig } from "../src/client";
import fs from "fs";

class Container {
  private real?: StartedTestContainer;
  private port: number = 5432;

  constructor() {}

  public get settings() {
    if (!this.real) throw new Error("database is not ready");
    return {
      host: this.real.getHost(),
      port: this.real.getMappedPort(this.port),
    };
  }

  public async start({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  }: DatabaseConfig) {
    const container = await new GenericContainer("postgres:16-alpine")
      .withEnvironment({
        POSTGRES_PASSWORD: POSTGRES_PASSWORD || "password",
        POSTGRES_USER,
        POSTGRES_DB,
      })
      .withExposedPorts(this.port)
      .withWaitStrategy(Wait.forListeningPorts())
      .withWaitStrategy(
        Wait.forLogMessage(
          /.*database system is ready to accept connections.*/,
          2,
        ),
      )
      .withReuse()
      .start();

    this.real = container;

    return this;
  }

  async stop() {
    if (this.real) this.real.stop();
  }
}

const container = await new Container().start({
  user: "admin",
  password: "password",
  database: "testdb",
});

const adminConn = new Connection();
const userConn = new Connection();

export const adminClient = () =>
  adminConn.client({
    user: "admin",
    password: "password",
    database: "testdb",
    max: 1,
    ...container.settings,
  });
export const userClient = () =>
  userConn.client({
    user: "appuser",
    password: "password",
    database: "testdb",
    max: 1,
    ...container.settings,
  });

export const setup = async () => {
  const client = await adminClient();
  // migration
  console.log("start migration");
  const migrationSchema = fs.readFileSync("./schema/schema.sql", "utf8");
  await client.query("CREATE USER appuser WITH PASSWORD 'password'");
  await client.query(migrationSchema);
  await client.query(
    "GRANT USAGE ON SCHEMA app TO appuser; GRANT SELECT ON ALL TABLES IN SCHEMA public to appuser;",
  );
  await client.query(
    "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app to appuser;",
  );
  console.log("finishi migration");
  client.release();
};

export const teardown = async () => {
  await Promise.all([adminConn.end(), userConn.end()]).then((_) => {
    container.stop();
  });
};
