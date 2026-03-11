import { Hono } from "hono";
import { db } from "../db/client";
import { about } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const aboutRouter = new Hono();

// Auth Middleware
const adminAuth = async (c: any, next: any) => {
  const secret = c.req.header("x-admin-secret");
  const adminSecret = process.env.VITE_ADMIN_SECRET || process.env.ADMIN_SECRET;
  if (!adminSecret || secret !== adminSecret) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};

const aboutSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  tagline: z.string().optional(),
  bio1: z.string().optional(),
  bio2: z.string().optional(),
  quote: z.string().optional(),
  university: z.string().optional(),
  status: z.string().optional(),
  resumeUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  telegramUrl: z.string().optional(),
  email: z.string().optional(),
  focusAreas: z.array(z.object({ title: z.string(), desc: z.string() })).optional(),
  competencies: z.array(z.string()).optional(),
  projects: z.array(z.object({ 
    name: z.string(), 
    desc: z.string(), 
    stack: z.string(),
    github: z.string().optional()
  })).optional(),
  education: z.array(z.object({ 
    name: z.string(), 
    desc: z.string(),
    href: z.string()
  })).optional(),
  hobbies: z.array(z.object({ emoji: z.string(), title: z.string(), desc: z.string() })).optional(),
});

// GET /api/about - Returns main about record (id=1)
aboutRouter.get("/", async (c) => {
  try {
    let rows = await db.select().from(about).limit(1);
    if (rows.length === 0) {
      // Seed default data if empty
      const inserted = await db.insert(about).values({
        name: "Радмир Абраев",
        location: "Алматы",
        tagline: "Backend Developer | Software Engineering Student",
        bio1: "Студент 2-го курса Software Engineering в AlmaU, Алматы. Строю портфолио под первую коммерческую роль с основным фокусом на бэкенде: Go как главный язык, TypeScript на фронтенде, Java как третий стек в работе.",
        bio2: "За последний год прошёл путь от Django и чистого JavaScript до Go, Flutter и полноценных full-stack проектов. Предпочитаю полный цикл разработки: проектирование архитектуры, работу с данными и создание удобных интерфейсов. Сейчас открыт к первым коммерческим ролям и интересным командам.",
        quote: "«Прямой и конкретный. Не люблю воду ни в коде, ни в разговоре. Если берусь за задачу — довожу до результата.»",
        university: "AlmaU (Алматы)",
        status: "Open to work",
        resumeUrl: "/resume.pdf",
        avatarUrl: "https://res.cloudinary.com/dm6maaylh/image/upload/v1773151857/WhatsApp_Image_2026-02-13_at_20.47.57_hcpmqg.jpg",
        githubUrl: "https://github.com/rxritet",
        linkedinUrl: "https://www.linkedin.com/in/radmir-abraev-186b393b0/",
        telegramUrl: "https://t.me/rxritet",
        email: "abraevradmir2@gmail.com",
        focusAreas: [
          { title: "Backend-разработка", desc: "Go как основной язык, проектирование API, чистая архитектура и работа с базами данных" },
          { title: "Full-Stack проекты", desc: "Понимание всего цикла разработки: от фронтенда на React до деплоя через Docker and Nginx" },
          { title: "Мобильная разработка", desc: "Flutter/Dart для кросс-платформенных приложений с выразительным UI" },
          { title: "Веб-безопасность", desc: "Изучение основ: XSS, CSRF, SQL-инъекции, OSINT в рамках университетского курса" },
        ],
        competencies: ["RESTful API дизайн", "Чистая архитектура", "SQL и миграции БД", "Docker & CI/CD", "Адаптивная вёрстка", "Git-workflow", "Тестирование API", "Системный подход"],
        projects: [
          { name: "SpoitHub", desc: "MVP маркетплейса спортивных мероприятий и товаров с CRM-панелью организатора", stack: "Django · React 19 · Vite" },
          { name: "HelpDesk", desc: "Система обратной связи через виджет: админ-панель, фильтрация, JWT-авторизация", stack: "Django · Nuxt 4 · Vue 3" },
          { name: "MyTech", desc: "Личный сайт-визитка с современным дизайном", stack: "React · TypeScript", github: "https://github.com/rxritet/mytech" },
        ],
        education: [
          { name: "GoLang-Education", desc: "Углублённое изучение Go", href: "https://github.com/rxritet/GoLang-Education" },
          { name: "Frontend-Education", desc: "React, TypeScript, Tailwind", href: "https://github.com/rxritet/Frontend-Education" },
          { name: "Advanced-JS-Education", desc: "Продвинутый JavaScript", href: "https://github.com/rxritet/Advanced-JS-Education" },
          { name: "Django-Education", desc: "Python / Django", href: "https://github.com/rxritet/Django-Education" },
          { name: "FastAPI-Education", desc: "FastAPI", href: "https://github.com/rxritet/FastAPI-Education" },
          { name: "Velora", desc: "Первое знакомство с Rust", href: "https://github.com/rxritet/Velora" },
        ],
        hobbies: [
          { emoji: "⚽", title: "Футбол", desc: "Играть и смотреть. Командная игра — лучшая разгрузка" },
          { emoji: "🎵", title: "Музыка", desc: "От lo-fi для фокуса до тяжёлых треков, зависит от задачи" },
          { emoji: "🎮", title: "Игры", desc: "CS2, Ghost of Tsushima, MK, Dota — атмосфера и геймплей" },
        ],
      } as any).returning();
      return c.json(inserted[0]);
    }
    return c.json(rows[0]);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PATCH /api/about - Partially update about record
aboutRouter.patch("/", adminAuth, zValidator("json", aboutSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    // Ensure row exists
    let rows = await db.select().from(about).limit(1);
    let id = 1;
    if (rows.length === 0) {
      const inserted = await db.insert(about).values({} as any).returning();
      id = inserted[0].id;
    } else {
      id = rows[0].id;
    }
    const updated = await db.update(about).set({ ...data, updatedAt: new Date() } as any).where(eq(about.id, id)).returning();
    return c.json(updated[0]);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default aboutRouter;
