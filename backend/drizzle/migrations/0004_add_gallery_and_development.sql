CREATE TABLE IF NOT EXISTS "projects_migration_004" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "long_description" text NOT NULL,
  "stack" text[] NOT NULL,
  "features" text[] NOT NULL,
  "github" text,
  "demo" text,
  "accent_color" text NOT NULL,
  "image" text,
  "gallery" jsonb NOT NULL DEFAULT '[]',
  "dev_time" text NOT NULL,
  "language" text NOT NULL,
  "created_at" text NOT NULL,
  "development_process" jsonb NOT NULL DEFAULT '[]'
);

-- Migrate data from old table if it exists
INSERT INTO "projects_migration_004" 
SELECT id, slug, name, description, long_description, stack, features, github, demo, accent_color, image, '[]', dev_time, language, created_at, '[]' 
FROM "projects" 
ON CONFLICT DO NOTHING;

-- Drop old table and rename new one
DROP TABLE IF EXISTS "projects";
ALTER TABLE "projects_migration_004" RENAME TO "projects";
