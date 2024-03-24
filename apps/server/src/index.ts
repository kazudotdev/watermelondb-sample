import { Hono } from "hono";
import { logger } from "hono/logger";
import webauthn from "./auth/webauthn";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.route("/webauthn", webauthn);

export default app;
