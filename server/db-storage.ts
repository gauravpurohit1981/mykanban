
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { tasks, type Task, type InsertTask } from "@shared/schema";
import { eq } from 'drizzle-orm';
import { IStorage } from './storage';

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const result = await this.db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await this.db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await this.db.update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await this.db.delete(tasks).where(eq(tasks.id, id));
    return result.length > 0;
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return await this.db.select().from(tasks).where(eq(tasks.category, category));
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return await this.db.select().from(tasks).where(eq(tasks.status, status));
  }

  async getTasksByDueDate(date: Date): Promise<Task[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await this.db.select().from(tasks)
      .where(sql`${tasks.dueDate} BETWEEN ${startOfDay} AND ${endOfDay}`);
  }
}
