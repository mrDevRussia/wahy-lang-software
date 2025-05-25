/**
 * Wahy Desktop - Main Process
 * العملية الرئيسية لتطبيق وحي سطح المكتب
 */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createMainWindow() {
  // إنشاء النافذة الرئيسية
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Wahy Desktop - محرر لغة وحي',
    show: false,
    autoHideMenuBar: false
  });

  // تحميل الصفحة الرئيسية
  mainWindow.loadFile('index.html');

  // إظهار النافذة عند اكتمال التحميل
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // فتح أدوات المطور في وضع التطوير
    if (process.argv.includes('--dev')) {
      mainWindow.webContents.openDevTools();
    }
  });

  // إعداد القائمة العربية
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'ملف',
      submenu: [
        {
          label: 'مشروع جديد',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-project');
          }
        },
        {
          label: 'فتح',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'ملفات وحي', extensions: ['wahy'] },
                { name: 'جميع الملفات', extensions: ['*'] }
              ]
            });

            if (!result.canceled && result.filePaths.length > 0) {
              try {
                const content = fs.readFileSync(result.filePaths[0], 'utf8');
                mainWindow.webContents.send('file-opened', {
                  path: result.filePaths[0],
                  content: content,
                  name: path.basename(result.filePaths[0])
                });
              } catch (error) {
                dialog.showErrorBox('خطأ', `فشل في فتح الملف: ${error.message}`);
              }
            }
          }
        },
        {
          label: 'حفظ',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          }
        },
        {
          label: 'حفظ باسم',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu-save-as');
          }
        },
        { type: 'separator' },
        {
          label: 'تصدير HTML',
          click: () => {
            mainWindow.webContents.send('menu-export-html');
          }
        },
        { type: 'separator' },
        {
          label: 'إغلاق',
          accelerator: process.platform === 'darwin' ? 'Cmd+W' : 'Ctrl+W',
          click: () => {
            mainWindow.close();
          }
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
      label: 'تشغيل',
      submenu: [
        {
          label: 'تشغيل الكود',
          accelerator: 'F5',
          click: () => {
            mainWindow.webContents.send('menu-run');
          }
        },
        {
          label: 'مسح النتائج',
          accelerator: 'F6',
          click: () => {
            mainWindow.webContents.send('menu-clear');
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
            mainWindow.webContents.send('menu-help');
          }
        },
        {
          label: 'حول البرنامج',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'حول Wahy Desktop',
              message: 'Wahy Desktop v1.0.0',
              detail: 'محرر لغة البرمجة العربية "وحي"\n\nصُنع بـ ❤️ للمجتمع العربي التقني\n\n© 2024 Wahy Language Team'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// معالجة أحداث IPC
ipcMain.handle('save-file', async (event, content, filePath) => {
  try {
    let targetPath = filePath;
    
    if (!targetPath) {
      const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: 'مشروع-وحي.wahy',
        filters: [
          { name: 'ملفات وحي', extensions: ['wahy'] },
          { name: 'جميع الملفات', extensions: ['*'] }
        ]
      });

      if (result.canceled) {
        return { success: false, canceled: true };
      }
      targetPath = result.filePath;
    }

    fs.writeFileSync(targetPath, content, 'utf8');
    return { 
      success: true, 
      path: targetPath,
      name: path.basename(targetPath)
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
});

ipcMain.handle('export-html', async (event, htmlContent, fileName) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: fileName || 'مشروع-وحي.html',
      filters: [
        { name: 'ملفات HTML', extensions: ['html'] },
        { name: 'جميع الملفات', extensions: ['*'] }
      ]
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    fs.writeFileSync(result.filePath, htmlContent, 'utf8');
    return { 
      success: true, 
      path: result.filePath 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
});

// أحداث التطبيق
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  // يمكن إضافة فحص للملفات غير المحفوظة هنا
});