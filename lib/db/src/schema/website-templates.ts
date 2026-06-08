import { pgTable, serial, text, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const websiteTemplatesTable = pgTable("website_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Business, E-commerce, Portfolio, NGO, Government
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  previewUrl: text("preview_url"),
  screenshotUrl: text("screenshot_url"),
  features: text("features").notNull().default("[]"), // JSON array stored as text
  techStack: text("tech_stack"),
  deliveryDays: serial("delivery_days"),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWebsiteTemplateSchema = createInsertSchema(websiteTemplatesTable).omit({ id: true, createdAt: true });
export type InsertWebsiteTemplate = z.infer<typeof insertWebsiteTemplateSchema>;
export type WebsiteTemplate = typeof websiteTemplatesTable.$inferSelect;
