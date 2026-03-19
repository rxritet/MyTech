CREATE TYPE "public"."employment_type" AS ENUM(
  'full_time', 'part_time', 'internship', 'freelance', 'contract'
);
CREATE TYPE "public"."work_format" AS ENUM(
  'onsite', 'remote', 'hybrid'
);
CREATE TABLE "work_experience" (
  "id" serial PRIMARY KEY NOT NULL,
  "company" text NOT NULL,
  "position" text NOT NULL,
  "location" text DEFAULT 'Алматы' NOT NULL,
  "industry" text,
  "employment_type" "employment_type" DEFAULT 'internship' NOT NULL,
  "format" "work_format" DEFAULT 'onsite' NOT NULL,
  "start_date" text NOT NULL,
  "end_date" text,
  "current" boolean DEFAULT false NOT NULL,
  "bullets" text[] DEFAULT '{}' NOT NULL,
  "stack" text[] DEFAULT '{}' NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now()
);

INSERT INTO "work_experience" (
  "company", "position", "location", "industry", "employment_type", "format",
  "start_date", "end_date", "current", "bullets", "stack", "order"
)
VALUES
(
  'Агентство по развитию и регулированию финансового рынка Казахстана',
  'Стажер-разработчик',
  'Алматы',
  'Финансовый сектор',
  'internship',
  'onsite',
  '2025-09',
  '2025-12',
  false,
  ARRAY[
    'Разработал веб-сервис для управления заявками и инцидентами в распределённых командах разработки.',
    'Спроектировал структуру БД и REST API с учётом масштабирования и дальнейшей поддержки.',
    'Реализовал административную панель: изменение статусов, назначение исполнителей, приоритизация.',
    'Разработал встраиваемые виджеты для интеграции функциональности в сайты заказчика.',
    'Настроил деплой и процесс обновления сервиса.'
  ]::text[],
  ARRAY['Django', 'React', 'PostgreSQL', 'Docker']::text[],
  0
),
(
  'Almaty Management University',
  'Практикант в IT-отделе',
  'Алматы',
  'Образование',
  'internship',
  'onsite',
  '2024-02',
  '2024-05',
  false,
  ARRAY[
    'Поддержка ЛВС: ~100 кабинетов, ~200 ПК (принтеры, телефония).',
    'Техподдержка L1–L2: диагностика и устранение неисправностей.',
    'Кабель-менеджмент 40+ кабинетов; инвентаризация ~300 единиц техники.',
    'Техсопровождение 4 мероприятий.'
  ]::text[],
  ARRAY[]::text[],
  1
),
(
  'Almaty Management University',
  'Практикант в отделе коммерциализации проектов',
  'Алматы',
  'Образование',
  'internship',
  'onsite',
  '2023-10',
  '2023-12',
  false,
  ARRAY[
    'Вёл Instagram-аккаунт отдела 2 месяца: планирование и публикация контента.',
    'Разработал сайт отдела на Tilda (12 страниц): структура, контент, формы.',
    'Создавал графические материалы: логотипы и брошюры для коммуникаций.',
    'Участвовал в организации 3 выставок проектов (5–10 проектов на каждой).'
  ]::text[],
  ARRAY['Tilda', 'Figma']::text[],
  2
);