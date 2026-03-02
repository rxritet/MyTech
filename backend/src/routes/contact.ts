import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { contacts } from "../db/schema";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5),
});

const contactRouter = new Hono();

contactRouter.post("/", async (c) => {
  const body = await c.req.json();
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: result.error.flatten() }, 400);
  }
  const [contact] = await db.insert(contacts).values(result.data).returning();
  return c.json(contact, 201);
});

contactRouter.get("/", async (c) => {
  const allContacts = await db.select().from(contacts);
  return c.json(allContacts);
});

export default contactRouter;
