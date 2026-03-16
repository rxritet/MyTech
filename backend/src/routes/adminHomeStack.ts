import { Hono } from "hono";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/client";
import { homeStackCategories, homeStackItems } from "../db/schema";
import adminAuth from "../middleware/adminAuth";

const createCategorySchema = z.object({
  slug: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const createItemSchema = z.object({
  category_id: z.number().int().positive(),
  name: z.string().trim().min(1),
});

const updateOrderSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int(),
    }),
  ),
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int(),
    }),
  ),
});

const adminHomeStackRouter = new Hono();

adminHomeStackRouter.use("*", adminAuth);

adminHomeStackRouter.post(
  "/categories",
  zValidator("json", createCategorySchema),
  async (c) => {
    const data = c.req.valid("json");
    const currentCategories = await db
      .select({ id: homeStackCategories.id })
      .from(homeStackCategories);

    const inserted = await db
      .insert(homeStackCategories)
      .values({
        slug: data.slug,
        label: data.label,
        order: currentCategories.length,
      })
      .returning();

    return c.json(inserted[0], 201);
  },
);

adminHomeStackRouter.delete("/categories/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  if (Number.isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  const deleted = await db
    .delete(homeStackCategories)
    .where(eq(homeStackCategories.id, id))
    .returning();

  if (deleted.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ success: true });
});

adminHomeStackRouter.post(
  "/items",
  zValidator("json", createItemSchema),
  async (c) => {
    const data = c.req.valid("json");

    const [category] = await db
      .select({ id: homeStackCategories.id })
      .from(homeStackCategories)
      .where(eq(homeStackCategories.id, data.category_id))
      .limit(1);

    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }

    const normalizedName = data.name.trim();

    const currentItems = await db
      .select({ id: homeStackItems.id, name: homeStackItems.name })
      .from(homeStackItems)
      .where(eq(homeStackItems.categoryId, data.category_id));

    const duplicateExists = currentItems.some(
      (item) => item.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );
    if (duplicateExists) {
      return c.json({ error: "Duplicate item in category" }, 409);
    }

    const inserted = await db
      .insert(homeStackItems)
      .values({
        categoryId: data.category_id,
        name: normalizedName,
        order: currentItems.length,
      })
      .returning();

    return c.json(
      {
        id: inserted[0].id,
        name: inserted[0].name.trim(),
        order: inserted[0].order,
      },
      201,
    );
  },
);

adminHomeStackRouter.delete("/items/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  if (Number.isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  const deleted = await db
    .delete(homeStackItems)
    .where(eq(homeStackItems.id, id))
    .returning();

  if (deleted.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ success: true });
});

adminHomeStackRouter.put(
  "/order",
  zValidator("json", updateOrderSchema),
  async (c) => {
    const data = c.req.valid("json");

    await Promise.all(
      data.categories.map((category) =>
        db
          .update(homeStackCategories)
          .set({ order: category.order })
          .where(eq(homeStackCategories.id, category.id)),
      ),
    );

    await Promise.all(
      data.items.map((item) =>
        db
          .update(homeStackItems)
          .set({ order: item.order })
          .where(eq(homeStackItems.id, item.id)),
      ),
    );

    const categories = await db
      .select()
      .from(homeStackCategories)
      .orderBy(asc(homeStackCategories.order), asc(homeStackCategories.id));

    const items = await db
      .select()
      .from(homeStackItems)
      .orderBy(asc(homeStackItems.order), asc(homeStackItems.id));

    const groupedItems = new Map<number, Array<typeof homeStackItems.$inferSelect>>();
    for (const item of items) {
      const current = groupedItems.get(item.categoryId) ?? [];
      current.push(item);
      groupedItems.set(item.categoryId, current);
    }

    return c.json(
      categories.map((category) => ({
        ...category,
        items: (groupedItems.get(category.id) ?? [])
          .map((item) => ({
            id: item.id,
            name: item.name.trim(),
            order: item.order,
          }))
          .filter((item) => item.name.length > 0),
      })),
    );
  },
);

export default adminHomeStackRouter;
