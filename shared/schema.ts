import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique(),
  phoneNumber: text("phone_number").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wahyFiles = pgTable("wahy_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull().default(""),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phoneNumber: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  phoneNumber: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Wahy file schemas (updated to include user reference)
export const insertWahyFileSchema = createInsertSchema(wahyFiles).pick({
  name: true,
  content: true,
  userId: true,
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
