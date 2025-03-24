import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema kept for future authentication implementation
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  priority: text("priority").notNull(), // "low", "medium", "high"
  status: text("status").notNull(), // "pending", "in-progress", "completed"
  category: text("category").notNull(), // "personal", "college"
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

// Enums for validation
export const taskPriorities = ["low", "medium", "high"] as const;
export const taskStatuses = ["pending", "in-progress", "completed"] as const;
export const taskCategories = ["personal", "college"] as const;

// Extended schema with validation
export const taskFormSchema = insertTaskSchema
  .extend({
    priority: z.enum(taskPriorities),
    status: z.enum(taskStatuses),
    category: z.enum(taskCategories),
    dueDate: z.coerce.date(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
