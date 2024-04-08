import type { QueryArrayConfig, QueryArrayResult } from "pg";
import { Pool } from "pg";

interface Client {
  query: (
    queryTextOrConfig: string | QueryArrayConfig,
  ) => Promise<QueryArrayResult>;
  release?: (err?: Error | boolean) => void;
}

type GuardedClientOptions = {
  userId: string;
  debug?: boolean;
};

export type DatabaseConfig = {
  user: string;
  password?: string;
  database: string;
  host?: string;
  port?: number;
  max?: number;
};

export class Connection {
  private pool?: Pool;
  constructor() {}
  client(config: DatabaseConfig) {
    if (!this.pool) {
      this.pool = new Pool(config);
    }
    return this.pool.connect();
  }

  async end() {
    if (this.pool) await this.pool.end();
  }
}

export class GuardedClient implements Client {
  private client: Client;
  private userId: string;
  private debug: boolean;
  constructor(client: Client, { userId, debug = false }: GuardedClientOptions) {
    if (!client.release) throw new Error("need to implement release function");
    this.debug = debug;
    this.client = client;
    this.userId = userId;
  }
  withDebug(debug = true) {
    this.debug = debug;
    console.log("withDebug", this.debug);
    return this;
  }
  async query(
    queryTextOrConfig: string | QueryArrayConfig,
  ): Promise<QueryArrayResult> {
    return await this.client
      .query("BEGIN")
      .then((_) => {
        return this.client.query(
          `SELECT set_config('app.uid', '${this.userId}', true)`,
        );
      })
      .then(async (_) => {
        this.debug && console.log(queryTextOrConfig);
        return this.client.query(queryTextOrConfig).then(async (r) => {
          await this.client.query("COMMIT");
          return r;
        });
      })
      .catch(async (e) => {
        console.error("Error:", e.toString());
        await this.client.query("ROLLBACK");
        throw e;
      });
  }
}
