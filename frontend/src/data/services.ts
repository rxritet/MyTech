export interface Service {
  /** Emoji or Lucide icon name (used as a label in ServiceCard) */
  icon: string;
  title: string;
  description: string;
  /** Optional badge text: price range, timeline, type, etc. */
  badge?: string;
}

export const SERVICES: Service[] = [
  {
    icon: "🖥️",
    title: "Сайт под ключ",
    description:
      "Полный цикл разработки: бэкенд + фронтенд + Docker-деплой. Чистый TypeScript-стек, адаптивная вёрстка.",
    badge: "от 7 дней",
  },
  {
    icon: "🔌",
    title: "REST API",
    description:
      "Проектирование и разработка API на Bun + Hono с PostgreSQL и Drizzle ORM. Swagger-документация в комплекте.",
    badge: "от 3 дней",
  },
  {
    icon: "🐳",
    title: "Docker / DevOps",
    description:
      "Контейнеризация приложений, настройка Docker Compose, CI/CD через GitHub Actions. Поддержка нескольких окружений.",
    badge: "от 2 дней",
  },
  {
    icon: "🔍",
    title: "Code Review",
    description:
      "Аудит существующего кода: производительность, безопасность, читаемость. Рекомендации с примерами рефактора.",
    badge: "фикс. стоимость",
  },
];
