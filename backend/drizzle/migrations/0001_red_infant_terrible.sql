CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"long_description" text NOT NULL,
	"stack" text[] NOT NULL,
	"features" text[] NOT NULL,
	"github" text,
	"demo" text,
	"accent_color" text NOT NULL,
	"image" text,
	"dev_time" text NOT NULL,
	"language" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
