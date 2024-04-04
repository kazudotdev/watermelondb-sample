import { type QueryArrayConfig, type QueryArrayResult } from "pg";

interface Client {
  query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
  release?: (err?: Error | boolean) => void;
}

export default class PostgresWrapper implements Client {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }
  async query(config: QueryArrayConfig): Promise<QueryArrayResult> {
    return this.client.query(config).finally(() => {
      if (this.client.release) {
        this.client.release();
      }
    });
  }
}
