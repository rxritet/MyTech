import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";
import contactRouter from "./routes/contact";
import projectsRouter from "./routes/projects";
import aboutRouter from "./routes/about";
import technologiesRouter from "./routes/technologies";
import stackRouter from "./routes/stack";
import adminHomeStackRouter from "./routes/adminHomeStack";
import workExperienceRouter from "./routes/workExperience";

config();

const app = new Hono();

app.use("*", cors({ origin: (process.env.ALLOWED_ORIGINS ?? "").split(",").map(s => s.trim()).filter(Boolean) }));

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/contacts", contactRouter);
app.route("/api/projects", projectsRouter);
app.route("/api/about", aboutRouter);
app.route("/api/technologies", technologiesRouter);
app.route("/api/stack", stackRouter);
app.route("/api/admin/stack/home", adminHomeStackRouter);
app.route("/api/work-experience", workExperienceRouter);

export default app;