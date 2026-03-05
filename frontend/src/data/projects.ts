export interface Project {
  id: number;
  /** URL-safe slug for routing, e.g. "specto" */
  slug: string;
  name: string;
  /** Short card description (3 lines max) */
  description: string;
  /** Full detailed description shown on the detail page */
  longDescription: string;
  stack: string[];
  /** Key features / highlights for the detail page */
  features: string[];
  github?: string;
  demo?: string;
  /** Tailwind gradient classes used for accent top-border */
  accentColor: string;
  /** URL for the project preview image (16:9) */
  image?: string;
  /** Development duration, e.g. "~3 недели" */
  devTime: string;
  /** Primary language reported by GitHub API */
  language: string;
  /** Approx repo created date */
  createdAt: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "specto",
    name: "Specto",
    description:
      "Производительный Go Task Manager с двойной стратегией БД (PostgreSQL + BoltDB), Cobra CLI, OpenTelemetry и автодеплоем через Mage → rsync → systemd.",
    longDescription:
      "Specto — production-ready веб-приложение для управления задачами, написанное на Go 1.25. Цель проекта — отработать на практике чистую архитектуру (domain / service / web слои), tx-in-context паттерн и реальный цикл деплоя без оркестраторов. Бэкенд использует чистый net/http без фреймворков, что даёт полный контроль над роутингом и middleware. В качестве хранилища выбрана двойная стратегия: PostgreSQL для реляционных данных и BoltDB для быстрых embedded-операций. SIMD AVX2-агрегация ускоряет аналитические запросы. Деплой автоматизирован через Mage (аналог Make на Go): один вызов выполняет сборку, rsync-копирование на VPS и перезапуск systemd-юнита.",
    stack: ["Go", "net/http", "PostgreSQL", "BoltDB", "Cobra CLI", "Mage", "OpenTelemetry", "systemd", "rsync"],
    features: [
      "Чистая архитектура: domain / service / web слои",
      "tx-in-context паттерн для транзакционной безопасности",
      "Двойная БД: PostgreSQL + BoltDB",
      "SIMD AVX2-агрегация для аналитических запросов",
      "Cobra CLI для управления миграциями и задачами",
      "OpenTelemetry (slog/otelslog) для трассировки",
      "Автодеплой: Mage → rsync → systemd",
    ],
    github: "https://github.com/rxritet/Specto",
    accentColor: "from-cyan-500 to-blue-500",
    image: "https://placehold.co/640x360/0a1929/22d3ee?text=Specto",
    devTime: "~3 недели",
    language: "Go",
    createdAt: "февраль 2026",
  },
  {
    id: 2,
    slug: "habitduel",
    name: "HabitDuel",
    description:
      "Fullstack Flutter-приложение — конкурентный трекер привычек. Clean Architecture, Riverpod, WebSocket real-time, JWT, лидерборд и 1v1 дуэли с UTC-верификацией.",
    longDescription:
      "HabitDuel — первое полноценное мобильное приложение, написанное на Flutter 3 с бэкендом на Dart Shelf. Приложение реализует концепцию геймификации привычек через дуэли: два пользователя соревнуются, кто лучше выполняет ежедневные цели. В основе — Clean Architecture с разделением на data / domain / presentation слои и state management через Riverpod. WebSocket обеспечивает мгновенные уведомления о ходе дуэли. UTC-верификация защищает от манипуляций с часовым поясом. JWT + refresh-token схема гарантирует безопасную аутентификацию.",
    stack: ["Flutter", "Dart", "Dart Shelf", "PostgreSQL", "WebSocket", "JWT", "Riverpod", "Clean Architecture"],
    features: [
      "1v1 дуэли по привычкам с UTC-верификацией",
      "WebSocket real-time уведомления",
      "JWT + refresh-token аутентификация",
      "Clean Architecture: data / domain / presentation",
      "Riverpod state management",
      "Бейджи и система достижений",
      "Лидерборд с рейтингом пользователей",
    ],
    github: "https://github.com/rxritet/HabitDuel",
    accentColor: "from-emerald-500 to-teal-500",
    image: "https://placehold.co/640x360/0d1f17/34d399?text=HabitDuel",
    devTime: "~4 недели",
    language: "Dart",
    createdAt: "февраль 2026",
  },
  {
    id: 3,
    slug: "spoithub",
    name: "SpoitHub",
    description:
      "Sports SaaS Platform — маркетплейс спортивной экипировки и площадка для мероприятий. React 19, TypeScript strict, Django REST Framework, PostgreSQL, Docker, QR-билеты.",
    longDescription:
      "SpoitHub — командный проект, платформа для спортивных мероприятий и маркетплейс экипировки. Архитектура: Decoupled SPA (React 19 + TypeScript strict) и REST API на Django REST Framework. Фронтенд использует TypeScript strict-режим — никаких any, DTO-валидацию, env-конфиги и runtime-валидацию через Zod. Ролевая модель разграничивает доступ между организаторами, участниками и администраторами. QR-билеты генерируются на бэкенде и верифицируются при входе в реальном времени. Контейнеризация через Docker Compose позволяет поднять весь стек одной командой.",
    stack: ["React 19", "TypeScript", "Tailwind CSS", "Django REST Framework", "PostgreSQL", "Docker", "Zod"],
    features: [
      "Ролевая модель: организатор / участник / администратор",
      "QR-билеты с real-time верификацией",
      "TypeScript strict: без any, DTO + Zod-валидация",
      "Decoupled SPA + REST API архитектура",
      "Маркетплейс спортивной экипировки",
      "Docker Compose для локального стека",
      "Командная разработка (GitHub Organizations)",
    ],
    github: "https://github.com/SpoitHub/delux",
    accentColor: "from-orange-500 to-pink-500",
    image: "https://placehold.co/640x360/1c0f05/fb923c?text=SpoitHub",
    devTime: "~6 недель",
    language: "Python / TypeScript",
    createdAt: "январь 2026",
  },
  {
    id: 4,
    slug: "mytech",
    name: "MyTech",
    description:
      "Персональный сайт-визитка с REST API. Bun + Hono на бэкенде, React + Tailwind на фронте, PostgreSQL, Docker Compose.",
    longDescription:
      "MyTech — этот самый сайт. Fullstack портфолио с собственным REST API. Бэкенд написан на Bun + Hono: минимальный overhead, высокая производительность, встроенный TypeScript. Фронтенд — React 19 + Vite + Tailwind CSS v4. Данные хранятся в PostgreSQL, всё оркестрируется через Docker Compose. Реализован CI/CD через GitHub Actions. Интересный аспект: сайт является живым примером тех технологий, которые в нём описаны.",
    stack: ["Bun", "Hono", "React 19", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker Compose", "GitHub Actions"],
    features: [
      "REST API на Bun + Hono с TypeScript",
      "React 19 + Vite + Tailwind CSS v4",
      "Контактная форма с серверной валидацией",
      "Docker Compose оркестрация",
      "CI/CD через GitHub Actions",
      "Адаптивный дизайн (mobile-first)",
      "Мультистраничная архитектура (React Router)",
    ],
    github: "https://github.com/rxritet/MyTech",
    accentColor: "from-indigo-500 to-purple-500",
    image: "https://placehold.co/640x360/1e293b/818cf8?text=MyTech",
    devTime: "~2 недели",
    language: "TypeScript",
    createdAt: "март 2026",
  },
];
