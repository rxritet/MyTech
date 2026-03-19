import { Hono } from "hono";
import { db } from "../db/client";
import { workExperience } from "../db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import adminAuth from "../middleware/adminAuth";

const workExperienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().default("Алматы"),
  industry: z.string().optional(),
  employmentType: z.enum([
    "full_time", "part_time", "internship", "freelance", "contract",
  ]).default("internship"),
  format: z.enum(["onsite", "remote", "hybrid"]).default("onsite"),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  endDate: z.string().regex(/^\d{4}-\d{2}$/).optional().nullable(),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

const router = new Hono();

router.get("/", async (c) => {
  try {
    const rows = await db
      .select()
      .from(workExperience)
      .orderBy(asc(workExperience.order), desc(workExperience.id));
    return c.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

router.get("/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  const rows = await db
    .select()
    .from(workExperience)
    .where(eq(workExperience.id, id))
    .limit(1);

  if (rows.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(rows[0]);
});

router.post("/", adminAuth, zValidator("json", workExperienceSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const inserted = await db
      .insert(workExperience)
      .values({
        ...data,
        endDate: data.endDate ?? null,
      })
      .returning();

    return c.json(inserted[0], 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

router.put("/:id", adminAuth, zValidator("json", workExperienceSchema), async (c) => {
  try {
    const id = Number.parseInt(c.req.param("id"), 10);
    const data = c.req.valid("json");

    const updated = await db
      .update(workExperience)
      .set({
        ...data,
        endDate: data.endDate ?? null,
      })
      .where(eq(workExperience.id, id))
      .returning();

    if (updated.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json(updated[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

router.delete("/:id", adminAuth, async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  const deleted = await db
    .delete(workExperience)
    .where(eq(workExperience.id, id))
    .returning();

  if (deleted.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ success: true });
});

export default router;
