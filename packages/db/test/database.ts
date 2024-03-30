import {
  type StartedTestContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
import { Client } from "pg";

class Database {
  private _container?: StartedTestContainer;
  private _client?: Client;

  constructor() {}
  async setup(schema?: string) {
    const postgres = await new GenericContainer("postgres:16-alpine")
      .withWaitStrategy(Wait.forListeningPorts())
      .withEnvironment({
        POSTGRES_PASSWORD: "password",
        POSTGRES_USER: "appuser",
        POSTGRES_DB: "testdb",
      })
      .withExposedPorts(5432)
      .start();
    const client = new Client({
      host: postgres.getHost(),
      port: postgres.getMappedPort(5432),
      database: "testdb",
      user: "appuser",
      password: "password",
    });

    await client.connect();
    await client.query("SELECT 1");

    if (schema) {
      await client.query(schema);
    }

    this._container = postgres;
    this._client = client;

    return client;
  }

  async stop() {
    if (this._client) await this._client.end();
    if (this._container) await this._container.stop();
  }

  /**
   * client
   */
  public client() {
    if (this._client) return this._client;
    else {
      throw new Error("client is not defined");
    }
  }
}

export default Database;
