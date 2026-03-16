import { Hono } from "hono";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/client";
import {
  aboutStack,
  homeStackCategories,
  homeStackItems,
  technologies,
  technologyCategoryEnum,
} from "../db/schema";
import adminAuth from "../middleware/adminAuth";

const categoryValues = technologyCategoryEnum.enumValues;

const updateAboutSchema = z.object({
  items: z.array(
    z.object({
      technologyId: z.number().int().positive(),
      category: z.enum(categoryValues),
      order: z.number().int(),
    }),
  ),
});

const stackRouter = new Hono();

stackRouter.get("/home", async (c) => {
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
      id: category.id,
      slug: category.slug,
      label: category.label,
      order: category.order,
      items: (groupedItems.get(category.id) ?? [])
        .map((item) => ({
          id: item.id,
          name: item.name.trim(),
          order: item.order,
        }))
        .filter((item) => item.name.length > 0),
    })),
  );
});

stackRouter.get("/about", async (c) => {
  const rows = await db
    .select({
      id: aboutStack.id,
      technologyId: technologies.id,
      name: technologies.name,
      category: aboutStack.category,
      badgeUrl: technologies.badgeUrl,
      deviconSlug: technologies.deviconSlug,
      order: aboutStack.order,
    })
    .from(aboutStack)
    .innerJoin(technologies, eq(aboutStack.technologyId, technologies.id))
    .orderBy(asc(aboutStack.category), asc(aboutStack.order), asc(technologies.id));

  return c.json(rows);
});

stackRouter.put(
  "/about",
  adminAuth,
  zValidator("json", updateAboutSchema),
  async (c) => {
    const data = c.req.valid("json");

    await db.delete(aboutStack);

    if (data.items.length > 0) {
      await db.insert(aboutStack).values(
        data.items.map((item) => ({
          technologyId: item.technologyId,
          category: item.category,
          order: item.order,
        })),
      );
    }

    const rows = await db
      .select({
        id: aboutStack.id,
        technologyId: technologies.id,
        name: technologies.name,
        category: aboutStack.category,
        badgeUrl: technologies.badgeUrl,
        deviconSlug: technologies.deviconSlug,
        order: aboutStack.order,
      })
      .from(aboutStack)
      .innerJoin(technologies, eq(aboutStack.technologyId, technologies.id))
      .orderBy(asc(aboutStack.category), asc(aboutStack.order), asc(technologies.id));

    return c.json(rows);
  },
);

export default stackRouter;
