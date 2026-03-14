// ─────────────────────────────────────────────────────────────
//  About page data — single source of truth
// ─────────────────────────────────────────────────────────────

export const PROFILE = {
  name: "Радмир Абраев",
  handle: "rxritet",
  title: "Backend Developer | Software Engineering Student",
  university: "AlmaU (Алматы)",
  location: "Алматы",
  status: "Open to work",
  statusSub: "Ищу первую коммерческую роль",
  avatarUrl:
    "https://res.cloudinary.com/dm6maaylh/image/upload/v1773151857/WhatsApp_Image_2026-02-13_at_20.47.57_hcpmqg.jpg",
  resumeUrl: "/resume.pdf",
  resumeName: "Radmir_Abraev_Resume.pdf",
  github: "https://github.com/rxritet",
  linkedin: "https://www.linkedin.com/in/radmir-abraev-186b393b0/",
  telegram: "https://t.me/rxritet",
  email: "abraevradmir2@gmail.com",
};

export const HERO_BIO = {
  p1: "Студент 2-го курса Software Engineering в AlmaU, Алматы. Строю портфолио под первую коммерческую роль с основным фокусом на бэкенде: Go как главный язык, TypeScript на фронтенде, Java как третий стек в работе.",
  p2: "За последний год прошёл путь от Django и чистого JavaScript до Go, Flutter и полноценных full-stack проектов. Предпочитаю полный цикл разработки: проектирование архитектуры, работу с данными и создание удобных интерфейсов. Сейчас открыт к первым коммерческим ролям и интересным командам.",
};

export interface TechItem {
  name: string;
  color: string; // Tailwind classes
}

export const TECH_STACK: TechItem[] = [
  { name: "Go",             color: "bg-cyan-500/10  text-cyan-400   border-cyan-500/25" },
  { name: "Java",           color: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
  { name: "TypeScript",     color: "bg-blue-500/10  text-blue-400   border-blue-500/25" },
  { name: "JavaScript",     color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/25" },
  { name: "Python",         color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25" },
  { name: "Dart",           color: "bg-sky-500/10   text-sky-400    border-sky-500/25" },
  { name: "Hono",          color: "bg-orange-600/10  text-orange-500  border-orange-600/25" },
  { name: "Django",         color: "bg-green-600/10  text-green-500  border-green-600/25" },
  { name: "FastAPI",       color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
  { name: "Node.js",        color: "bg-green-500/10  text-green-400  border-green-500/25" },
  { name: "PostgreSQL",     color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" },
  { name: "SQLite",         color: "bg-blue-400/10  text-blue-400   border-blue-400/25" },
  { name: "React",          color: "bg-cyan-400/10  text-cyan-300   border-cyan-400/25" },
  { name: "Vue",            color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25" },
  { name: "Nuxt",           color: "bg-green-500/10 text-green-300 border-green-500/25" },
  { name: "TailwindCSS",    color: "bg-teal-500/10  text-teal-400   border-teal-500/25" },
  { name: "Vite",           color: "bg-purple-500/10 text-purple-400 border-purple-500/25" },
  { name: "Flutter",        color: "bg-blue-400/10  text-blue-300   border-blue-400/25" },
  { name: "HTML5",          color: "bg-orange-600/10 text-orange-500 border-orange-600/25" },
  { name: "CSS3",           color: "bg-blue-600/10  text-blue-500   border-blue-600/25" },
  { name: "Figma",          color: "bg-pink-500/10  text-pink-400   border-pink-500/25" },
  { name: "Docker",         color: "bg-cyan-500/10  text-cyan-400   border-cyan-500/25" },
  { name: "Vercel",         color: "bg-zinc-900/10  text-zinc-100   border-zinc-900/25" },
  { name: "JWT",            color: "bg-amber-500/10 text-amber-300 border-amber-500/25" },
  { name: "GitHub Actions", color: "bg-purple-500/10 text-purple-400 border-purple-500/25" },
  { name: "AWS",             color: "bg-orange-400/10 text-orange-400 border-orange-400/25" },
  { name: "Nginx",          color: "bg-green-500/10  text-green-400  border-green-500/25" },
  { name: "Linux",          color: "bg-gray-500/10  text-gray-400   border-gray-500/25" },
  { name: "Git",            color: "bg-orange-500/10 text-orange-500 border-orange-500/25" },
  { name: "GitHub",         color: "bg-gray-400/10  text-gray-100   border-gray-400/25" },
  { name: "VS Code",        color: "bg-blue-500/10  text-blue-400   border-blue-500/25" },
  { name: "Burp Suite",     color: "bg-orange-700/10 text-orange-600 border-orange-700/25" },
  { name: "Antigravity",    color: "bg-purple-400/10 text-purple-300 border-purple-400/25" },
];

export interface FocusArea {
  iconKey: "server" | "layers" | "smartphone" | "shield";
  title: string;
  desc: string;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    iconKey: "server",
    title: "Backend-разработка",
    desc: "Go как основной язык, проектирование API, чистая архитектура и работа с базами данных",
  },
  {
    iconKey: "layers",
    title: "Full-Stack проекты",
    desc: "Понимание всего цикла разработки: от фронтенда на React до деплоя через Docker и Nginx",
  },
  {
    iconKey: "smartphone",
    title: "Мобильная разработка",
    desc: "Flutter/Dart для кросс-платформенных приложений с выразительным UI",
  },
  {
    iconKey: "shield",
    title: "Веб-безопасность",
    desc: "Изучение основ: XSS, CSRF, SQL-инъекции, OSINT в рамках университетского курса",
  },
];

export const COMPETENCIES: string[] = [
  "RESTful API дизайн",
  "Чистая архитектура",
  "SQL и миграции БД",
  "Docker & CI/CD",
  "Адаптивная вёрстка",
  "Git-workflow",
  "Тестирование API",
  "Системный подход",
];

export interface Project {
  name: string;
  desc: string;
  stack: string;
  github?: string;
  status: string;
}

export const PROJECTS: Project[] = [
  {
    name: "SpoitHub",
    desc: "MVP маркетплейса спортивных мероприятий и товаров с CRM-панелью организатора",
    stack: "Django · React 19 · Vite",
    status: "MVP",
  },
  {
    name: "HelpDesk",
    desc: "Система обратной связи через виджет: админ-панель, фильтрация, JWT-авторизация",
    stack: "Django · Nuxt 4 · Vue 3",
    status: "MVP",
  },
  {
    name: "MyTech",
    desc: "Личный сайт-визитка с современным дизайном",
    stack: "React · TypeScript",
    github: "https://github.com/rxritet/mytech",
    status: "Запущен",
  },
];

export interface EduRepo {
  name: string;
  desc: string;
  href: string;
}

export const EDUCATION_REPOS: EduRepo[] = [
  { name: "GoLang-Education",    desc: "Углублённое изучение Go",            href: "https://github.com/rxritet/GoLang-Education" },
  { name: "Frontend-Education",  desc: "React, TypeScript, Tailwind",        href: "https://github.com/rxritet/Frontend-Education" },
  { name: "Advanced-JS-Education", desc: "Продвинутый JavaScript",           href: "https://github.com/rxritet/Advanced-JS-Education" },
  { name: "Django-Education",    desc: "Python / Django",                   href: "https://github.com/rxritet/Django-Education" },
  { name: "FastAPI-Education",   desc: "FastAPI",                            href: "https://github.com/rxritet/FastAPI-Education" },
  { name: "Velora",              desc: "Первое знакомство с Rust",           href: "https://github.com/rxritet/Velora" },
];

export interface Hobby {
  emoji: string;
  title: string;
  desc: string;
}

export const HOBBIES: Hobby[] = [
  { emoji: "⚽", title: "Футбол",  desc: "Играть и смотреть. Командная игра — лучшая разгрузка" },
  { emoji: "🎵", title: "Музыка",  desc: "От lo-fi для фокуса до тяжёлых треков, зависит от задачи" },
  { emoji: "🎮", title: "Игры",    desc: "CS2, Ghost of Tsushima, MK, Dota — атмосфера и геймплей" },
];

export const QUOTE =
  "«Прямой и конкретный. Не люблю воду ни в коде, ни в разговоре. Если берусь за задачу — довожу до результата.»";
