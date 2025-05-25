import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWahyFileSchema, interpretationResultSchema } from "@shared/schema";
import { interpretWahyCode } from "./wahy-interpreter";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all Wahy files
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getAllWahyFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  // Get specific Wahy file
  app.get("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getWahyFile(id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch file" });
    }
  });

  // Create new Wahy file
  app.post("/api/files", async (req, res) => {
    try {
      const validatedData = insertWahyFileSchema.parse(req.body);
      
      // Check if file with same name exists
      const existing = await storage.getWahyFileByName(validatedData.name);
      if (existing) {
        return res.status(400).json({ error: "File with this name already exists" });
      }
      
      const file = await storage.createWahyFile(validatedData);
      res.status(201).json(file);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid file data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create file" });
    }
  });

  // Update Wahy file
  app.put("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWahyFileSchema.partial().parse(req.body);
      
      const updatedFile = await storage.updateWahyFile(id, validatedData);
      if (!updatedFile) {
        return res.status(404).json({ error: "File not found" });
      }
      
      res.json(updatedFile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid file data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update file" });
    }
  });

  // Delete Wahy file
  app.delete("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWahyFile(id);
      if (!success) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Interpret Wahy code
  app.post("/api/interpret", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: "Code is required" });
      }

      // Use JavaScript interpreter
      const result = interpretWahyCode(code);
      res.json(result);

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Failed to interpret code" 
      });
    }
  });

  // Download HTML file
  app.post("/api/download", async (req, res) => {
    try {
      const { code, filename } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      // Use JavaScript interpreter
      const result = interpretWahyCode(code);
      
      if (result.success && result.html) {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'output.html'}"`);
        res.send(result.html);
      } else {
        res.status(400).json({ error: result.error || "Failed to generate HTML" });
      }

    } catch (error) {
      res.status(500).json({ error: "Failed to generate download" });
    }
  });

  // Download Wahy Desktop
  app.post("/api/download/wahy-desktop", async (req, res) => {
    try {
      const archiver = require('archiver');
      const path = require('path');
      const fs = require('fs');
      
      const wahyDesktopPath = path.join(process.cwd(), 'wahy-desktop');
      
      // التحقق من وجود المجلد
      if (!fs.existsSync(wahyDesktopPath)) {
        return res.status(404).json({ error: 'مجلد wahy-desktop غير موجود' });
      }

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="Wahy-Desktop-Alpha-v1.0.zip"');

      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.on('error', (err) => {
        console.error('Archive error:', err);
        res.status(500).end();
      });

      archive.pipe(res);
      
      // إضافة مجلد wahy-desktop بالكامل مع استثناء الملفات غير المرغوبة
      archive.directory(wahyDesktopPath, false, (entry) => {
        // تجاهل ملفات node_modules وملفات النظام المخفية وملفات التوزيع الكبيرة
        if (entry.name.includes('node_modules') || 
            entry.name.startsWith('.') || 
            entry.name.includes('.log') || 
            entry.name.includes('.tmp') ||
            entry.name.includes('dist/win-unpacked') ||
            entry.name.endsWith('.zip')) {
          return false;
        }
        return entry;
      });

      await archive.finalize();
    } catch (error) {
      console.error("Error creating wahy-desktop archive:", error);
      res.status(500).json({ error: 'خطأ في تحميل البرنامج' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
