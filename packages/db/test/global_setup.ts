import {
  GenericContainer,
  Wait,
  type StartedTestContainer,
} from "testcontainers";
import { Pool } from "pg";
import fs from "fs";

type DatabaseConfig = {
  user: string;
  password?: string;
  database: string;
  host?: string;
  port?: number;
  max?: number;
};

class Connection {
  private pool?: Pool;
  constructor() {}
  client(config: DatabaseConfig) {
    if (!this.pool) {
      this.pool = new Pool(config);
    }
    return this.pool.connect();
  }

  release() {
    if (this.pool) this.pool.end();
  }
}

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

class Database {
  private conn: Connection;
  private container: Container;
  constructor(container: Container) {
    this.conn = new Connection();
    this.container = container;
  }

  async client({ user, password, database }: DatabaseConfig) {
    return await this.conn.client({
      user,
      password,
      database,
      ...this.container.settings,
    });
  }

  async end() {
    this.conn.release();
    await this.container.stop();
  }
}

const container = await new Container().start({
  user: "admin",
  password: "password",
  database: "testdb",
});
const admin = new Database(container);
const user = new Database(container);

export const adminClient = () =>
  admin.client({ user: "admin", password: "password", database: "testdb" });
export const userClient = () =>
  user.client({ user: "appuser", password: "password", database: "testdb" });

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
  await admin.end();
  await user.end();
};
