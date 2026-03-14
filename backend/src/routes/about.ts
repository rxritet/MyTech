import { Hono } from "hono";
import { db } from "../db/client";
import { about } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import adminAuth from "../middleware/adminAuth";

const aboutRouter = new Hono();

const defaultEducationHref = (name: string) => `https://github.com/rxritet/${encodeURIComponent(name)}`;

function looksLikeMojibake(value: string) {
  return /[ÃÂÐÑâ]/u.test(value);
}

function countMatches(value: string, pattern: RegExp) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  let count = 0;

  while (matcher.exec(value)) {
    count += 1;
  }

  return count;
}

function repairMojibake(value: string) {
  if (!looksLikeMojibake(value)) {
    return value;
  }

  const repaired = Buffer.from(value, "latin1").toString("utf8");
  const originalMarkers = countMatches(value, /[ÃÂÐÑâ]/gu);
  const repairedMarkers = countMatches(repaired, /[ÃÂÐÑâ]/gu);
  const originalCyrillic = countMatches(value, /[\u0400-\u04FF]/gu);
  const repairedCyrillic = countMatches(repaired, /[\u0400-\u04FF]/gu);

  if (repairedMarkers < originalMarkers || repairedCyrillic > originalCyrillic) {
    return repaired;
  }

  return value;
}

function repairValue<T>(value: T): T {
  if (typeof value === "string") {
    return repairMojibake(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => repairValue(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, repairValue(entryValue)]),
    ) as T;
  }

  return value;
}

function normalizeAboutRecord<T extends Record<string, any>>(record: T): T {
  const repairedRecord = repairValue(record);
  const education = Array.isArray(record.education)
    ? repairedRecord.education.map((item: Record<string, any>) => ({
        ...item,
        href: typeof item.href === "string" && item.href.trim() ? item.href : defaultEducationHref(String(item.name ?? "education")),
      }))
    : [];

  const projects = Array.isArray(repairedRecord.projects)
    ? repairedRecord.projects.map((item: Record<string, any>) => ({
        ...item,
        github: typeof item.github === "string" && item.github.trim() ? item.github.trim() : undefined,
      }))
    : [];

  return {
    ...repairedRecord,
    education,
    projects,
  };
}

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
    href: z.string().optional()
  })).optional(),
  hobbies: z.array(z.object({ emoji: z.string(), title: z.string(), desc: z.string() })).optional(),
  techGroups: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    names: z.array(z.string())
  })).optional(),
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
        techGroups: [
          {
            title: "Языки",
            description: "Базовые языки, на которых строю повседневную разработку и учебные проекты.",
            names: ["Go", "Java", "TypeScript", "JavaScript", "Python", "Dart"]
          },
          {
            title: "Backend & БД",
            description: "Серверная логика, API, базы данных и инфраструктура данных.",
            names: ["Hono", "Django", "FastAPI", "PostgreSQL", "SQLite"]
          },
          {
            title: "Frontend & Mobile",
            description: "Интерфейсы, дизайн-система и клиентская часть приложений.",
            names: ["React", "TailwindCSS", "Vite", "Flutter", "HTML5", "CSS3", "Figma"]
          },
          {
            title: "DevOps & Инфра",
            description: "Инструменты поставки, инфраструктура и облачные решения.",
            names: ["Docker", "Vercel", "AWS", "Nginx", "Linux"]
          },
          {
            title: "Инструменты",
            description: "Инструменты разработки, тестирования и повседневной работы.",
            names: ["Git", "GitHub", "VS Code", "Burp Suite", "Antigravity"]
          }
        ],
      } as any).returning();ame: "Frontend-Education", desc: "React, TypeScript, Tailwind", href: "https://github.com/rxritet/Frontend-Education" },
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
      return c.json(normalizeAboutRecord(inserted[0]));
    }
    return c.json(normalizeAboutRecord(rows[0]));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PATCH /api/about - Partially update about record
aboutRouter.patch("/", adminAuth, zValidator("json", aboutSchema), async (c) => {
  try {
    const data = normalizeAboutRecord(c.req.valid("json"));
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
    return c.json(normalizeAboutRecord(updated[0]));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default aboutRouter;
