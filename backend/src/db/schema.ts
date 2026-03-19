import { pgEnum, pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const technologyCategoryEnum = pgEnum("technology_category", [
  "language",
  "backend",
  "frontend",
  "devops",
  "tool",
  "mobile",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "in_progress",
  "completed",
  "archived",
]);

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  status: projectStatusEnum("status").notNull().default("in_progress"),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  stack: text("stack").array().notNull(),
  features: text("features").array().notNull(),
  github: text("github"),
  demo: text("demo"),
  accentColor: text("accent_color").notNull(),
  image: text("image"),
  gallery: jsonb("gallery").notNull().default([]),
  devTime: text("dev_time").notNull(),
  language: text("language").notNull(),
  createdAt: text("created_at").notNull(),
  developmentProcess: jsonb("development_process").notNull().default([]),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: technologyCategoryEnum("category").notNull(),
  badgeUrl: text("badge_url").notNull(),
  deviconSlug: text("devicon_slug"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Technology = typeof technologies.$inferSelect;
export type NewTechnology = typeof technologies.$inferInsert;

export const projectTechnologies = pgTable("project_technologies", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  technologyId: integer("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
  order: integer("order").notNull().default(0),
});

export const homeStack = pgTable("home_stack", {
  id: serial("id").primaryKey(),
  technologyId: integer("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
  order: integer("order").notNull().default(0),
});

export const homeStackCategories = pgTable("home_stack_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  order: integer("order").notNull().default(0),
});

export const homeStackItems = pgTable("home_stack_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => homeStackCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
});

export const aboutStack = pgTable("about_stack", {
  id: serial("id").primaryKey(),
  technologyId: integer("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  order: integer("order").notNull().default(0),
});

export const about = pgTable("about", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Радмир Абраев"),
  location: text("location").notNull().default("Almaty, Kazakhstan"),
  tagline: text("tagline").notNull().default("Full-Stack Developer"),
  bio1: text("bio1").notNull().default(""),
  bio2: text("bio2").notNull().default(""),
  quote: text("quote").notNull().default(""),
  university: text("university").notNull().default("AlmaU"),
  status: text("status").notNull().default("Open to work"),
  resumeUrl: text("resume_url").notNull().default("/resume.pdf"),
  avatarUrl: text("avatar_url").notNull().default(""),
  githubUrl: text("github_url").notNull().default("https://github.com/rxritet"),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  telegramUrl: text("telegram_url").notNull().default(""),
  email: text("email").notNull().default(""),
  focusAreas: jsonb("focus_areas").notNull().default([]),
  competencies: jsonb("competencies").notNull().default([]),
  projects: jsonb("projects").notNull().default([]),
  education: jsonb("education").notNull().default([]),
  hobbies: jsonb("hobbies").notNull().default([]),
  techGroups: jsonb("tech_groups").notNull().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type About = typeof about.$inferSelect;
export type NewAbout = typeof about.$inferInsert;
