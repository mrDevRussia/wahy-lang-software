import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWahyFileSchema, interpretationResultSchema } from "@shared/schema";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
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

      // Write code to temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      const tempFile = path.join(tempDir, `temp_${Date.now()}.wahy`);
      await fs.writeFile(tempFile, code, 'utf8');

      // Run Python interpreter
      const pythonScript = path.join(process.cwd(), 'interpreter', 'wahy_interpreter.py');
      
      const python = spawn('python3', [pythonScript, tempFile], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', async (code) => {
        // Clean up temp file
        try {
          await fs.unlink(tempFile);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            res.json(result);
          } catch (e) {
            res.json({ success: true, html: stdout });
          }
        } else {
          // Parse error from stderr
          let errorMessage = stderr;
          let lineNumber;
          
          // Try to extract line number from error
          const lineMatch = stderr.match(/line (\d+)/i);
          if (lineMatch) {
            lineNumber = parseInt(lineMatch[1]);
          }

          res.json({
            success: false,
            error: errorMessage || "Unknown error occurred",
            lineNumber
          });
        }
      });

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

      // Write code to temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      const tempFile = path.join(tempDir, `temp_${Date.now()}.wahy`);
      await fs.writeFile(tempFile, code, 'utf8');

      // Run Python interpreter
      const pythonScript = path.join(process.cwd(), 'interpreter', 'wahy_interpreter.py');
      
      const python = spawn('python3', [pythonScript, tempFile], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', async (code) => {
        // Clean up temp file
        try {
          await fs.unlink(tempFile);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            if (result.success && result.html) {
              res.setHeader('Content-Type', 'text/html');
              res.setHeader('Content-Disposition', `attachment; filename="${filename || 'output.html'}"`);
              res.send(result.html);
            } else {
              res.status(400).json({ error: result.error || "Failed to generate HTML" });
            }
          } catch (e) {
            // If not JSON, assume it's raw HTML
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Disposition', `attachment; filename="${filename || 'output.html'}"`);
            res.send(stdout);
          }
        } else {
          res.status(400).json({ error: stderr || "Failed to interpret code" });
        }
      });

    } catch (error) {
      res.status(500).json({ error: "Failed to generate download" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
