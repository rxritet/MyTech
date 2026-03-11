import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

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
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  stack: text("stack").array().notNull(),
  features: text("features").array().notNull(),
  github: text("github"),
  demo: text("demo"),
  accentColor: text("accent_color").notNull(),
  image: text("image"),
  devTime: text("dev_time").notNull(),
  language: text("language").notNull(),
  createdAt: text("created_at").notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type About = typeof about.$inferSelect;
export type NewAbout = typeof about.$inferInsert;
