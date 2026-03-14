ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "tech_groups" jsonb DEFAULT '[]'::jsonb NOT NULL;
