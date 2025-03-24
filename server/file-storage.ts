
import fs from 'fs/promises';
import { Task, InsertTask, IStorage } from './storage';

const DATA_FILE = './data/tasks.json';

export class FileStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
    this.loadData();
  }

  private async loadData() {
    try {
      await fs.mkdir('./data', { recursive: true });
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const tasks = JSON.parse(data);
      this.tasks = new Map(tasks.map((t: Task) => [t.id, t]));
      this.currentId = Math.max(...Array.from(this.tasks.keys()), 0) + 1;
    } catch (error) {
      this.tasks = new Map();
      this.currentId = 1;
    }
  }

  private async saveData() {
    const tasks = Array.from(this.tasks.values());
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    await this.saveData();
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask: Task = { ...existingTask, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    await this.saveData();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const deleted = this.tasks.delete(id);
    if (deleted) await this.saveData();
    return deleted;
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.category === category
    );
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.status === status
    );
  }

  async getTasksByDueDate(date: Date): Promise<Task[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.tasks.values()).filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === targetDate.getTime();
    });
  }
}
