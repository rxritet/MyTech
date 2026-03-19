CREATE TYPE "public"."project_status" AS ENUM('in_progress', 'completed', 'archived');
ALTER TABLE "projects" ADD COLUMN "status" "project_status" DEFAULT 'in_progress' NOT NULL;
