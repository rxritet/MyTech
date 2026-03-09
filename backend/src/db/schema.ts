import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
