import { Hono } from "hono";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/client";
import { aboutStack, homeStack, technologies, technologyCategoryEnum } from "../db/schema";
import adminAuth from "../middleware/adminAuth";

const categoryValues = technologyCategoryEnum.enumValues;

const updateHomeSchema = z.object({
  ids: z.array(z.number().int().positive()),
  order: z.array(z.number().int()),
});

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
  const rows = await db
    .select({
      id: homeStack.id,
      technologyId: technologies.id,
      name: technologies.name,
      category: technologies.category,
      badgeUrl: technologies.badgeUrl,
      order: homeStack.order,
    })
    .from(homeStack)
    .innerJoin(technologies, eq(homeStack.technologyId, technologies.id))
    .orderBy(asc(homeStack.order), asc(technologies.id));

  return c.json(rows);
});

stackRouter.put(
  "/home",
  adminAuth,
  zValidator("json", updateHomeSchema),
  async (c) => {
    const data = c.req.valid("json");

    if (data.ids.length !== data.order.length) {
      return c.json({ error: "ids and order length mismatch" }, 400);
    }

    await db.delete(homeStack);

    if (data.ids.length > 0) {
      await db.insert(homeStack).values(
        data.ids.map((technologyId, index) => ({
          technologyId,
          order: data.order[index],
        })),
      );
    }

    const rows = await db
      .select({
        id: homeStack.id,
        technologyId: technologies.id,
        name: technologies.name,
        category: technologies.category,
        badgeUrl: technologies.badgeUrl,
        order: homeStack.order,
      })
      .from(homeStack)
      .innerJoin(technologies, eq(homeStack.technologyId, technologies.id))
      .orderBy(asc(homeStack.order), asc(technologies.id));

    return c.json(rows);
  },
);

stackRouter.get("/about", async (c) => {
  const rows = await db
    .select({
      id: aboutStack.id,
      technologyId: technologies.id,
      name: technologies.name,
      category: aboutStack.category,
      badgeUrl: technologies.badgeUrl,
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
        order: aboutStack.order,
      })
      .from(aboutStack)
      .innerJoin(technologies, eq(aboutStack.technologyId, technologies.id))
      .orderBy(asc(aboutStack.category), asc(aboutStack.order), asc(technologies.id));

    return c.json(rows);
  },
);

export default stackRouter;
