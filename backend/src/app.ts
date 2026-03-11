import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";
import contactRouter from "./routes/contact";
import projectsRouter from "./routes/projects";
import aboutRouter from "./routes/about";

config();

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/contacts", contactRouter);
app.route("/api/projects", projectsRouter);
app.route("/api/about", aboutRouter);

export default app;