import { type Context } from "hono";
import { env as _env } from "hono/adapter";

type Env = Partial<{
  PASSKEYS_SECRET_KEY: string;
  PASSKEYS_URL: string;
  PASSKEYS_ADMIN_URL: string;
  LIBSQL_URL: string;
  LIBSQL_ADMIN_URL: string;
}>;

export const env = (c: Context) => _env<Env>(c);

