import { wahyFiles, type WahyFile, type InsertWahyFile } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getWahyFile(id: number): Promise<WahyFile | undefined>;
  getWahyFileByName(name: string): Promise<WahyFile | undefined>;
  getAllWahyFiles(): Promise<WahyFile[]>;
  createWahyFile(file: InsertWahyFile): Promise<WahyFile>;
  updateWahyFile(id: number, updates: Partial<InsertWahyFile>): Promise<WahyFile | undefined>;
  deleteWahyFile(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getWahyFile(id: number): Promise<WahyFile | undefined> {
    const [file] = await db.select().from(wahyFiles).where(eq(wahyFiles.id, id));
    return file || undefined;
  }

  async getWahyFileByName(name: string): Promise<WahyFile | undefined> {
    const [file] = await db.select().from(wahyFiles).where(eq(wahyFiles.name, name));
    return file || undefined;
  }

  async getAllWahyFiles(): Promise<WahyFile[]> {
    return await db.select().from(wahyFiles).orderBy(desc(wahyFiles.createdAt));
  }

  async createWahyFile(insertFile: InsertWahyFile): Promise<WahyFile> {
    const [file] = await db
      .insert(wahyFiles)
      .values(insertFile)
      .returning();
    return file;
  }

  async updateWahyFile(id: number, updates: Partial<InsertWahyFile>): Promise<WahyFile | undefined> {
    const [file] = await db
      .update(wahyFiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(wahyFiles.id, id))
      .returning();
    return file || undefined;
  }

  async deleteWahyFile(id: number): Promise<boolean> {
    const result = await db.delete(wahyFiles).where(eq(wahyFiles.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
