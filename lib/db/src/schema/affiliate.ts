import { pgTable, serial, text, boolean, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const affiliateProgramsTable = pgTable("affiliate_programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  baseUrl: text("base_url").notNull(),
  affiliateId: text("affiliate_id").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const affiliateLinksTable = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => affiliateProgramsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  affiliateUrl: text("affiliate_url").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("KES"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  clicks: integer("clicks").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliateProgramSchema = createInsertSchema(affiliateProgramsTable).omit({ id: true, createdAt: true });
export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinksTable).omit({ id: true, clicks: true, createdAt: true });
export type InsertAffiliateProgram = z.infer<typeof insertAffiliateProgramSchema>;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateProgram = typeof affiliateProgramsTable.$inferSelect;
export type AffiliateLink = typeof affiliateLinksTable.$inferSelect;
