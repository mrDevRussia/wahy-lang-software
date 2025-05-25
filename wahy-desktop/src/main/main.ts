/**
 * Wahy Desktop - Main Electron Process
 * العملية الرئيسية لتطبيق وحي سطح المكتب
 */

import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { WahyInterpreter } from '../shared/wahy-interpreter';

const isDev = process.env.NODE_ENV === 'development';

class WahyDesktopApp {
  private mainWindow: BrowserWindow | null = null;
  private interpreter: WahyInterpreter;

  constructor() {
    this.interpreter = new WahyInterpreter();
    this.setupApp();
  }

  private setupApp(): void {
    // Handle app ready
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupMenu();
      this.setupIpcHandlers();
    });

    // Handle window-all-closed
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle activate (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1000,
      minHeight: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../renderer/preload.js'),
      },
      icon: path.join(__dirname, '../../assets/icon.png'),
      title: 'Wahy Desktop - محرر لغة وحي',
      titleBarStyle: 'default',
      show: false, // Don't show until ready
    });

    // Load the renderer
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'ملف',
        submenu: [
          {
            label: 'مشروع جديد',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('menu:new-project');
            }
          },
          {
            label: 'فتح مشروع',
            accelerator: 'CmdOrCtrl+O',
            click: () => this.openProject()
          },
          {
            label: 'حفظ',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.mainWindow?.webContents.send('menu:save');
            }
          },
          {
            label: 'حفظ باسم',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => this.saveAsProject()
          },
          { type: 'separator' },
          {
            label: 'تصدير كـ HTML',
            click: () => {
              this.mainWindow?.webContents.send('menu:export-html');
            }
          },
          { type: 'separator' },
          {
            label: 'خروج',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => app.quit()
          }
        ]
      },
      {
        label: 'تحرير',
        submenu: [
          { label: 'تراجع', role: 'undo' },
          { label: 'إعادة', role: 'redo' },
          { type: 'separator' },
          { label: 'قص', role: 'cut' },
          { label: 'نسخ', role: 'copy' },
          { label: 'لصق', role: 'paste' },
          { label: 'تحديد الكل', role: 'selectAll' }
        ]
      },
      {
        label: 'عرض',
        submenu: [
          {
            label: 'الوضع الداكن/الفاتح',
            accelerator: 'CmdOrCtrl+T',
            click: () => {
              this.mainWindow?.webContents.send('menu:toggle-theme');
            }
          },
          { type: 'separator' },
          { label: 'تكبير', role: 'zoomIn' },
          { label: 'تصغير', role: 'zoomOut' },
          { label: 'الحجم الأصلي', role: 'resetZoom' },
          { type: 'separator' },
          { label: 'ملء الشاشة', role: 'togglefullscreen' }
        ]
      },
      {
        label: 'تشغيل',
        submenu: [
          {
            label: 'تشغيل الكود',
            accelerator: 'F5',
            click: () => {
              this.mainWindow?.webContents.send('menu:run-code');
            }
          },
          {
            label: 'تشغيل وعرض',
            accelerator: 'Ctrl+F5',
            click: () => {
              this.mainWindow?.webContents.send('menu:run-and-preview');
            }
          }
        ]
      },
      {
        label: 'مساعدة',
        submenu: [
          {
            label: 'دليل الأوامر',
            click: () => {
              this.mainWindow?.webContents.send('menu:show-commands');
            }
          },
          {
            label: 'أمثلة',
            click: () => {
              this.mainWindow?.webContents.send('menu:show-examples');
            }
          },
          { type: 'separator' },
          {
            label: 'موقع وحي الرسمي',
            click: () => {
              shell.openExternal('https://wahy-lang.com');
            }
          },
          {
            label: 'حول البرنامج',
            click: () => {
              dialog.showMessageBox(this.mainWindow!, {
                type: 'info',
                title: 'حول وحي Desktop',
                message: 'وحي Desktop Alpha v1.0.0',
                detail: 'محرر لغة البرمجة العربية "وحي"\n\nصُنع بـ ❤️ للمجتمع العربي التقني\n\nجميع الحقوق محفوظة © 2024'
              });
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupIpcHandlers(): void {
    // Handle code interpretation
    ipcMain.handle('wahy:interpret-code', async (event, code: string) => {
      try {
        const result = this.interpreter.interpret(code);
        return result;
      } catch (error) {
        return {
          success: false,
          error: `خطأ في التفسير: ${error}`
        };
      }
    });

    // Handle file operations
    ipcMain.handle('wahy:save-file', async (event, content: string, filePath?: string) => {
      try {
        let targetPath = filePath;
        
        if (!targetPath) {
          const result = await dialog.showSaveDialog(this.mainWindow!, {
            title: 'حفظ مشروع وحي',
            defaultPath: 'مشروع-وحي.wahy',
            filters: [
              { name: 'ملفات وحي', extensions: ['wahy'] },
              { name: 'جميع الملفات', extensions: ['*'] }
            ]
          });

          if (result.canceled || !result.filePath) {
            return { success: false, canceled: true };
          }
          
          targetPath = result.filePath;
        }

        await fs.promises.writeFile(targetPath, content, 'utf8');
        return { success: true, filePath: targetPath };
      } catch (error) {
        return { 
          success: false, 
          error: `فشل في حفظ الملف: ${error}` 
        };
      }
    });

    ipcMain.handle('wahy:open-file', async () => {
      try {
        const result = await dialog.showOpenDialog(this.mainWindow!, {
          title: 'فتح مشروع وحي',
          filters: [
            { name: 'ملفات وحي', extensions: ['wahy'] },
            { name: 'جميع الملفات', extensions: ['*'] }
          ],
          properties: ['openFile']
        });

        if (result.canceled || result.filePaths.length === 0) {
          return { success: false, canceled: true };
        }

        const filePath = result.filePaths[0];
        const content = await fs.promises.readFile(filePath, 'utf8');
        
        return { 
          success: true, 
          content, 
          filePath,
          fileName: path.basename(filePath)
        };
      } catch (error) {
        return { 
          success: false, 
          error: `فشل في فتح الملف: ${error}` 
        };
      }
    });

    // Handle HTML export
    ipcMain.handle('wahy:export-html', async (event, htmlContent: string, projectName: string) => {
      try {
        const result = await dialog.showSaveDialog(this.mainWindow!, {
          title: 'تصدير كـ HTML',
          defaultPath: `${projectName}.html`,
          filters: [
            { name: 'ملفات HTML', extensions: ['html'] },
            { name: 'جميع الملفات', extensions: ['*'] }
          ]
        });

        if (result.canceled || !result.filePath) {
          return { success: false, canceled: true };
        }

        await fs.promises.writeFile(result.filePath, htmlContent, 'utf8');
        return { success: true, filePath: result.filePath };
      } catch (error) {
        return { 
          success: false, 
          error: `فشل في تصدير الملف: ${error}` 
        };
      }
    });

    // Handle app info
    ipcMain.handle('wahy:get-app-info', () => {
      return {
        version: app.getVersion(),
        name: app.getName(),
        platform: process.platform
      };
    });
  }

  private async openProject(): Promise<void> {
    this.mainWindow?.webContents.send('menu:open-project');
  }

  private async saveAsProject(): Promise<void> {
    this.mainWindow?.webContents.send('menu:save-as');
  }
}

// Create app instance
new WahyDesktopApp();