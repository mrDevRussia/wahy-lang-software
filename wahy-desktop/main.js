/**
 * Wahy Desktop - Main Process
 * العملية الرئيسية لتطبيق وحي سطح المكتب
 */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// نظام الحماية المتقدم
const ProtectionManager = require('./system/license-guard/protection-manager');

let mainWindow;
let protectionManager;

async function createMainWindow() {
  // تهيئة نظام الحماية قبل إنشاء النافذة
  protectionManager = new ProtectionManager();
  
  // إنشاء النافذة الرئيسية
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // إخفاء النافذة حتى اكتمال التحقق من الأمان
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

  // التحقق من الأمان وإظهار النافذة
  mainWindow.once('ready-to-show', async () => {
    try {
      console.log('🔐 بدء التحقق الأمني...');
      
      // تهيئة نظام الحماية
      const securityValid = await protectionManager.initialize(mainWindow);
      
      if (!securityValid) {
        console.error('❌ فشل التحقق الأمني - النظام مقفل');
        return; // النافذة الرئيسية لن تظهر، ستظهر نافذة القفل
      }
      
      // التحقق من إمكانية تشغيل النظام
      if (!protectionManager.canSystemRun()) {
        console.error('❌ النظام غير قابل للتشغيل');
        return;
      }
      
      console.log('✅ تم التحقق الأمني بنجاح');
      
      // إظهار النافذة الرئيسية
      mainWindow.show();
      
      // فتح ملف من سطر الأوامر إذا تم تمريره
      const fileToOpen = process.argv.find(arg => arg.endsWith('.wahy'));
      if (fileToOpen && fs.existsSync(fileToOpen)) {
        setTimeout(() => {
          try {
            const content = fs.readFileSync(fileToOpen, 'utf8');
            mainWindow.webContents.send('file-opened', {
              path: fileToOpen,
              content: content,
              name: path.basename(fileToOpen)
            });
          } catch (error) {
            console.error('خطأ في فتح الملف:', error);
          }
        }, 1000);
      }
      
    } catch (error) {
      console.error('❌ خطأ في التحقق الأمني:', error);
      await protectionManager.lockSystem('security_initialization_error');
    }
    
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
    // التحقق من حالة الأمان قبل السماح بحفظ الملف
    if (global.fileSaveDisabled || !protectionManager?.canSystemRun()) {
      return { success: false, error: 'تم تعطيل حفظ الملفات لأسباب أمنية' };
    }
    
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
  // تنظيف نظام الحماية
  if (protectionManager) {
    protectionManager.cleanup();
  }
  
  // يمكن إضافة فحص للملفات غير المحفوظة هنا
});

// معالجات IPC إضافية للأمان
ipcMain.handle('get-system-status', async () => {
  if (!protectionManager) {
    return { error: 'نظام الحماية غير مهيأ' };
  }
  return protectionManager.getSystemStatus();
});

// معالج لإعادة تشغيل النظام (وضع التطوير فقط)
ipcMain.handle('reset-security-system', async () => {
  if (process.env.NODE_ENV === 'development' && protectionManager) {
    protectionManager.resetSystem();
    return { success: true, message: 'تم إعادة تشغيل نظام الحماية' };
  }
  return { success: false, error: 'غير مسموح في وضع الإنتاج' };
});

// معالج لتفسير الكود مع التحقق الأمني
ipcMain.handle('interpret-wahy-code', async (event, code) => {
  try {
    // التحقق من حالة الأمان
    if (global.wahyInterpreterDisabled || !protectionManager?.canSystemRun()) {
      return { 
        success: false, 
        error: 'تم تعطيل مفسر وحي لأسباب أمنية' 
      };
    }

    // تشغيل مفسر وحي الأصلي
    const { interpretWahyCode } = require('./wahy-interpreter');
    return interpretWahyCode(code);
    
  } catch (error) {
    console.error('خطأ في تفسير الكود:', error);
    return { 
      success: false, 
      error: 'خطأ في تفسير الكود: ' + error.message 
    };
  }
});

// تشغيل التطبيق
app.whenReady().then(createMainWindow);