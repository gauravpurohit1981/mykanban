
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { tasks, type Task, type InsertTask } from "@shared/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class DbStorage implements IStorage {
  async getAllTasks(): Promise<Task[]> {
    try {
      return await db.select().from(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTask(id: number): Promise<Task | undefined> {
    try {
      const result = await db.select().from(tasks).where(eq(tasks.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(task: InsertTask): Promise<Task> {
    try {
      const result = await db.insert(tasks).values(task).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    try {
      const result = await db.update(tasks)
        .set(taskUpdate)
        .where(eq(tasks.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      const result = await db.delete(tasks)
        .where(eq(tasks.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    try {
      return await db.select()
        .from(tasks)
        .where(eq(tasks.category, category));
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      throw error;
    }
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    try {
      return await db.select()
        .from(tasks)
        .where(eq(tasks.status, status));
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      throw error;
    }
  }

  async getTasksByDueDate(date: Date): Promise<Task[]> {
    try {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      return await db.select()
        .from(tasks)
        .where(eq(tasks.dueDate, targetDate));
    } catch (error) {
      console.error('Error fetching tasks by due date:', error);
      throw error;
    }
  }
}
