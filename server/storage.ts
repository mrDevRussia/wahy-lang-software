import { wahyFiles, type WahyFile, type InsertWahyFile } from "@shared/schema";

export interface IStorage {
  getWahyFile(id: number): Promise<WahyFile | undefined>;
  getWahyFileByName(name: string): Promise<WahyFile | undefined>;
  getAllWahyFiles(): Promise<WahyFile[]>;
  createWahyFile(file: InsertWahyFile): Promise<WahyFile>;
  updateWahyFile(id: number, updates: Partial<InsertWahyFile>): Promise<WahyFile | undefined>;
  deleteWahyFile(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private wahyFiles: Map<number, WahyFile>;
  private currentId: number;

  constructor() {
    this.wahyFiles = new Map();
    this.currentId = 1;
    
    // Add default example file
    this.createWahyFile({
      name: "مثال_أول.wahy",
      content: `افتح صفحة "موقعي الأول"

أضف عنوان "مرحباً بالعالم"
أضف فقرة "هذا مثال على استخدام لغة وحي لإنشاء صفحات الويب باللغة العربية"

غيّر لون_الخلفية إلى "lightblue"
غيّر لون_النص إلى "darkblue"

ابدأ قائمة
أضف عنصر "البساطة في الاستخدام"
أضف عنصر "دعم اللغة العربية"
أضف عنصر "سهولة التعلم"
أنهِ قائمة

أضف فقرة "يمكنك إضافة المزيد من المحتوى هنا"
أضف رابط "زيارة موقع GitHub" "https://github.com"

أغلق صفحة`
    });
  }

  async getWahyFile(id: number): Promise<WahyFile | undefined> {
    return this.wahyFiles.get(id);
  }

  async getWahyFileByName(name: string): Promise<WahyFile | undefined> {
    return Array.from(this.wahyFiles.values()).find(
      (file) => file.name === name,
    );
  }

  async getAllWahyFiles(): Promise<WahyFile[]> {
    return Array.from(this.wahyFiles.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createWahyFile(insertFile: InsertWahyFile): Promise<WahyFile> {
    const id = this.currentId++;
    const now = new Date();
    const file: WahyFile = { 
      ...insertFile, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.wahyFiles.set(id, file);
    return file;
  }

  async updateWahyFile(id: number, updates: Partial<InsertWahyFile>): Promise<WahyFile | undefined> {
    const existing = this.wahyFiles.get(id);
    if (!existing) return undefined;
    
    const updated: WahyFile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.wahyFiles.set(id, updated);
    return updated;
  }

  async deleteWahyFile(id: number): Promise<boolean> {
    return this.wahyFiles.delete(id);
  }
}

export const storage = new MemStorage();
