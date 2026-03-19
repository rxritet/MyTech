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