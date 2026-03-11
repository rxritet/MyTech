import { Hono } from "hono";
import { db } from "../db/client";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import adminAuth from "../middleware/adminAuth";

const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  longDescription: z.string(),
  stack: z.array(z.string()),
  features: z.array(z.string()),
  github: z.string().optional(),
  demo: z.string().optional(),
  accentColor: z.string(),
  image: z.string().optional(),
  devTime: z.string(),
  language: z.string(),
  createdAt: z.string(),
});

const projectsRouter = new Hono();

projectsRouter.get("/", async (c) => {
  try {
    const allProjects = await db.select().from(projects).orderBy(projects.id);
    return c.json(allProjects);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

projectsRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const project = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (project.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(project[0]);
});

projectsRouter.post("/", adminAuth, zValidator("json", projectSchema), async (c) => {
  const data = c.req.valid("json");
  const newProject = await db.insert(projects).values(data).returning();
  return c.json(newProject[0], 201);
});

projectsRouter.put("/:id", adminAuth, zValidator("json", projectSchema), async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  const data = c.req.valid("json");
  const updatedProject = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
  if (updatedProject.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(updatedProject[0]);
});

projectsRouter.delete("/:id", adminAuth, async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  const deletedProject = await db.delete(projects).where(eq(projects.id, id)).returning();
  if (deletedProject.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json({ success: true, project: deletedProject[0] });
});

export default projectsRouter;
