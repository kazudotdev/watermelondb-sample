import { type QueryArrayConfig, type QueryArrayResult } from "pg";

interface Client {
  query: (
    queryTextOrConfig: string | QueryArrayConfig,
  ) => Promise<QueryArrayResult>;
  release?: (err?: Error | boolean) => void;
}

export class GuardedClient implements Client {
  private client: Client;
  private userId: string;
  constructor(client: Client, { userId }: { userId: string }) {
    if (!client.release) throw new Error("need to implement release function");
    this.client = client;
    this.userId = userId;
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
        console.log(queryTextOrConfig);
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
