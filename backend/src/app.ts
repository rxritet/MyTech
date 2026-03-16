import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";
import contactRouter from "./routes/contact";
import projectsRouter from "./routes/projects";
import aboutRouter from "./routes/about";
import technologiesRouter from "./routes/technologies";
import stackRouter from "./routes/stack";

config();

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/contacts", contactRouter);
app.route("/api/projects", projectsRouter);
app.route("/api/about", aboutRouter);
app.route("/api/technologies", technologiesRouter);
app.route("/api/stack", stackRouter);

export default app;