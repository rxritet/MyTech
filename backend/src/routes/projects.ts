import { Hono } from "hono";
import { db } from "../db/client";
import { projectTechnologies, projects, technologies } from "../db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import adminAuth from "../middleware/adminAuth";

const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  status: z.enum(["in_progress", "completed", "archived"]).default("in_progress"),
  description: z.string(),
  longDescription: z.string(),
  features: z.array(z.string()),
  github: z.string().optional(),
  demo: z.string().optional(),
  accentColor: z.string(),
  image: z.string().optional(),
  gallery: z.array(z.string()).optional().default([]),
  devTime: z.string(),
  language: z.string(),
  createdAt: z.string(),
  developmentProcess: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional().default([]),
  technologyIds: z.array(z.number().int().positive()).optional().default([]),
});

const projectsRouter = new Hono();

type DbError = {
  code?: string;
  constraint_name?: string;
  detail?: string;
};

function isProjectSlugConflict(error: unknown): boolean {
  const dbError = error as DbError;
  if (dbError?.code !== "23505") {
    return false;
  }

  if (dbError.constraint_name === "projects_slug_unique") {
    return true;
  }

  return dbError.detail?.includes("(slug)=") ?? false;
}

async function getTechnologyLinks(projectIds: number[]) {
  if (projectIds.length === 0) {
    return [] as Array<{ projectId: number; technologyId: number; technologyName: string }>;
  }

  const rows = await db
    .select({
      projectId: projectTechnologies.projectId,
      technologyId: technologies.id,
      technologyName: technologies.name,
    })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
    .where(inArray(projectTechnologies.projectId, projectIds))
    .orderBy(asc(projectTechnologies.order), asc(technologies.id));

  return rows;
}

async function hydrateProjectsWithTechnologies(
  rows: Array<typeof projects.$inferSelect>,
) {
  const links = await getTechnologyLinks(rows.map((row) => row.id));

  const grouped = new Map<number, { names: string[]; ids: number[] }>();
  for (const link of links) {
    const current = grouped.get(link.projectId) ?? { names: [], ids: [] };
    current.names.push(link.technologyName);
    current.ids.push(link.technologyId);
    grouped.set(link.projectId, current);
  }

  return rows.map((row) => {
    const tech = grouped.get(row.id) ?? { names: [], ids: [] };
    return {
      ...row,
      stack: tech.names,
      technologyIds: tech.ids,
    };
  });
}

function uniqueIds(ids: number[]) {
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))];
}

async function syncProjectTechnologies(projectId: number, ids: number[]) {
  const normalized = uniqueIds(ids);

  await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectId));

  if (normalized.length === 0) return;

  await db.insert(projectTechnologies).values(
    normalized.map((technologyId, order) => ({
      projectId,
      technologyId,
      order,
    })),
  );
}

projectsRouter.get("/", async (c) => {
  try {
    const allProjects = await db.select().from(projects).orderBy(projects.id);
    return c.json(await hydrateProjectsWithTechnologies(allProjects));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

projectsRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (rows.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }
  const hydrated = await hydrateProjectsWithTechnologies(rows);
  return c.json(hydrated[0]);
});

projectsRouter.post("/", adminAuth, zValidator("json", projectSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const { technologyIds, ...payload } = data;

    const newProject = await db
      .insert(projects)
      .values({
        ...payload,
        stack: [],
      })
      .returning();

    const created = newProject[0];
    await syncProjectTechnologies(created.id, technologyIds ?? []);

    const hydrated = await hydrateProjectsWithTechnologies([created]);
    return c.json(hydrated[0], 201);
  } catch (error: unknown) {
    if (isProjectSlugConflict(error)) {
      return c.json({ error: "Проект с таким slug уже существует" }, 409);
    }
    return c.json({ error: "Не удалось создать проект" }, 500);
  }
});

async function updateProjectHandler(c: any) {
  try {
    const id = Number.parseInt(c.req.param("id"), 10);
    const data = c.req.valid("json");
    const { technologyIds, ...payload } = data;

    const updatedProject = await db
      .update(projects)
      .set({
        ...payload,
        stack: [],
      })
      .where(eq(projects.id, id))
      .returning();

    if (updatedProject.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    await syncProjectTechnologies(id, technologyIds ?? []);
    const hydrated = await hydrateProjectsWithTechnologies(updatedProject);
    return c.json(hydrated[0]);
  } catch (error: unknown) {
    if (isProjectSlugConflict(error)) {
      return c.json({ error: "Проект с таким slug уже существует" }, 409);
    }
    return c.json({ error: "Не удалось обновить проект" }, 500);
  }
}

projectsRouter.put("/:id", adminAuth, zValidator("json", projectSchema), updateProjectHandler);

projectsRouter.patch("/:id", adminAuth, zValidator("json", projectSchema), updateProjectHandler);

projectsRouter.delete("/:id", adminAuth, async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  const deletedProject = await db.delete(projects).where(eq(projects.id, id)).returning();
  if (deletedProject.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json({ success: true, project: deletedProject[0] });
});

export default projectsRouter;
