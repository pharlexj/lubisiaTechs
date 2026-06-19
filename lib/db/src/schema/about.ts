import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const aboutSectionsTable = pgTable("about_sections", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // vision | mission | mandate | core_values
  title: text("title").notNull(),
  content: text("content").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamMembersTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull().default(""),
  photoUrl: text("photo_url"),
  linkedIn: text("linked_in"),
  displayOrder: integer("display_order").notNull().default(0),
  active: integer("active").notNull().default(1), // 1=active, 0=hidden
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const AboutSectionSchema = z.object({
  id: z.number().int(),
  key: z.string(),
  title: z.string(),
  content: z.string(),
  displayOrder: z.number().int(),
  updatedAt: z.string(),
});

export const TeamMemberSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photoUrl: z.string().nullable(),
  linkedIn: z.string().nullable(),
  displayOrder: z.number().int(),
  active: z.number().int(),
  createdAt: z.string(),
});
