export interface Project {
  id: number;
  name: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  /** Tailwind gradient classes used for the accent top-border, e.g. "from-indigo-500 to-purple-500" */
  accentColor: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "MyTech",
    description:
      "Персональный сайт-визитка с REST API. Bun + Hono на бэкенде, React + Tailwind на фронте, PostgreSQL, Docker Compose.",
    stack: ["Bun", "Hono", "React", "PostgreSQL", "Docker"],
    github: "https://github.com/rxritet/MyTech",
    accentColor: "from-indigo-500 to-purple-500",
  },
  {
    id: 2,
    name: "TaskFlow API",
    description:
      "RESTful API для управления задачами с аутентификацией JWT, ролевой моделью и Swagger-документацией.",
    stack: ["Bun", "Hono", "Drizzle ORM", "PostgreSQL", "JWT"],
    github: "https://github.com/rxritet",
    accentColor: "from-cyan-500 to-blue-500",
  },
  {
    id: 3,
    name: "ShopLight",
    description:
      "Лёгкий интернет-магазин с корзиной, фильтрацией каталога и интеграцией платёжного шлюза.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Node.js"],
    github: "https://github.com/rxritet",
    demo: "https://example.com",
    accentColor: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "DevDeploy",
    description:
      "CLI-утилита для автоматизации деплоя через Docker Compose и GitHub Actions. Поддерживает несколько окружений.",
    stack: ["Go", "Docker", "GitHub Actions", "Bash"],
    github: "https://github.com/rxritet",
    accentColor: "from-orange-500 to-pink-500",
  },
];
