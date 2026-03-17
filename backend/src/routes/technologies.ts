import { Hono } from "hono";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/client";
import {
  aboutStack,
  homeStack,
  projectTechnologies,
  technologies,
  technologyCategoryEnum,
} from "../db/schema";
import adminAuth from "../middleware/adminAuth";

const categoryValues = technologyCategoryEnum.enumValues;

const deviconSlugSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const normalized = value.trim().toLowerCase();
    return normalized.length > 0 ? normalized : null;
  },
  z.string().regex(/^[a-z0-9]+$/).nullable(),
);

const badgeUrlSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (!trimmed) return "";

    const srcMatch = /src\s*=\s*["']([^"']+)["']/i.exec(trimmed);
    const candidate = srcMatch?.[1]?.trim() ?? trimmed;

    try {
      const parsed = new URL(candidate);
      if (parsed.hostname.includes("shields.io")) {
        return "";
      }
      return parsed.toString();
    } catch {
      return "";
    }
  },
  z.string().url().or(z.literal("")),
);

const createTechnologySchema = z.object({
  name: z.string().min(1),
  category: z.enum(categoryValues),
  badgeUrl: badgeUrlSchema.optional(),
  deviconSlug: deviconSlugSchema.optional(),
});

const updateTechnologySchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(categoryValues).optional(),
  badgeUrl: badgeUrlSchema.optional(),
  deviconSlug: deviconSlugSchema.optional(),
});

const technologiesRouter = new Hono();

technologiesRouter.get("/", async (c) => {
  const rows = await db.select().from(technologies).orderBy(technologies.id);
  return c.json(rows);
});

technologiesRouter.post(
  "/",
  adminAuth,
  zValidator("json", createTechnologySchema),
  async (c) => {
    const data = c.req.valid("json");
    const inserted = await db
      .insert(technologies)
      .values({
        ...data,
        badgeUrl: data.badgeUrl ?? "",
      })
      .returning();
    return c.json(inserted[0], 201);
  },
);

technologiesRouter.put(
  "/:id",
  adminAuth,
  zValidator("json", updateTechnologySchema),
  async (c) => {
    const id = Number.parseInt(c.req.param("id"), 10);
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const data = c.req.valid("json");
    const updated = await db
      .update(technologies)
      .set(data)
      .where(eq(technologies.id, id))
      .returning();

    if (updated.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json(updated[0]);
  },
);

technologiesRouter.delete("/:id", adminAuth, async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  if (Number.isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  const [projectUsage] = await db
    .select({ value: count() })
    .from(projectTechnologies)
    .where(eq(projectTechnologies.technologyId, id));

  const [homeUsage] = await db
    .select({ value: count() })
    .from(homeStack)
    .where(eq(homeStack.technologyId, id));

  const [aboutUsage] = await db
    .select({ value: count() })
    .from(aboutStack)
    .where(eq(aboutStack.technologyId, id));

  const usedCount = Number(projectUsage.value) + Number(homeUsage.value) + Number(aboutUsage.value);
  if (usedCount > 0) {
    return c.json({ error: "Technology is used and cannot be deleted" }, 409);
  }

  const deleted = await db
    .delete(technologies)
    .where(eq(technologies.id, id))
    .returning();

  if (deleted.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ success: true, technology: deleted[0] });
});

export default technologiesRouter;
