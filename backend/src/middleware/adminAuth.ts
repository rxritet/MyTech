import type { MiddlewareHandler } from "hono";

const adminAuth: MiddlewareHandler = async (c, next) => {
  const secret = c.req.header("x-admin-secret");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};

export default adminAuth;