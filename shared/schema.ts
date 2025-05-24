import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wahyFiles = pgTable("wahy_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWahyFileSchema = createInsertSchema(wahyFiles).pick({
  name: true,
  content: true,
});

export type InsertWahyFile = z.infer<typeof insertWahyFileSchema>;
export type WahyFile = typeof wahyFiles.$inferSelect;

// API response types
export const interpretationResultSchema = z.object({
  success: z.boolean(),
  html: z.string().optional(),
  error: z.string().optional(),
  lineNumber: z.number().optional(),
});

export type InterpretationResult = z.infer<typeof interpretationResultSchema>;
