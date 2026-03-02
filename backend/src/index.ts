import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";
import contactRouter from "./routes/contact";

config();

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/contacts", contactRouter);

export default {
  port: 3000,
  fetch: app.fetch,
};
