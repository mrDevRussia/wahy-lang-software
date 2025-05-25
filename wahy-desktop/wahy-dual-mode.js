/**
 * Wahy Dual Mode - التطبيق الرئيسي المحدث
 * تطبيق وحي سطح المكتب مع دعم الأوضاع المتعددة
 */

const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// استيراد مدير الأوضاع ونظام الحماية
const ModeManager = require('./core/mode-manager');
const ModeSelector = require('./core/ui/mode-selector');
const ProtectionManager = require('./system/license-guard/protection-manager');

class WahyDualModeApp {
    constructor() {
        this.mainWindow = null;
        this.modeManager = new ModeManager();
        this.modeSelector = null;
        this.protectionManager = new ProtectionManager();
        this.currentMode = null;
        this.appReady = false;
    }

    /**
     * تهيئة التطبيق
     */
    async initialize() {
        try {
            // التحقق من نظام الحماية أولاً
            console.log('🔒 فحص نظام الحماية...');
            const securityCheck = await this.protectionManager.validateSecurity();
            
            if (!securityCheck.success) {
                console.error('❌ فشل التحقق الأمني:', securityCheck.error);
                this.showSecurityError(securityCheck);
                return false;
            }

            console.log('✅ نظام الحماية يعمل بشكل صحيح');
            console.log(`📊 النقاط الأمنية: ${securityCheck.score}/100`);

            // تهيئة مدير الأوضاع
            console.log('🎯 تهيئة مدير الأوضاع...');
            await this.setupModeManager();

            // إعداد الأحداث
            this.setupEventHandlers();

            console.log('🚀 تم تهيئة Wahy Dual Mode بنجاح');
            return true;

        } catch (error) {
            console.error('❌ خطأ في تهيئة التطبيق:', error);
            this.showStartupError(error);
            return false;
        }
    }

    /**
     * إعداد مدير الأوضاع
     */
    async setupModeManager() {
        // ربط أحداث مدير الأوضاع
        this.modeManager.on('mode-switched', (data) => {
            console.log(`🔄 تم التبديل إلى وضع: ${data.currentMode}`);
            this.currentMode = data.currentMode;
            this.updateWindowTitle();
            this.updateMenu();
            
            // إشعار النافذة بالتغيير
            if (this.mainWindow) {
                this.mainWindow.webContents.send('mode-changed', data);
            }
        });

        this.modeManager.on('mode-switch-error', (data) => {
            console.error('❌ خطأ في تبديل الوضع:', data);
            this.showModeError(data);
        });
    }

    /**
     * إعداد معالجات الأحداث
     */
    setupEventHandlers() {
        // أحداث التطبيق
        app.whenReady().then(async () => {
            await this.createMainWindow();
            this.appReady = true;
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                this.shutdown();
            }
        });

        app.on('activate', async () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                await this.createMainWindow();
            }
        });

        // أحداث IPC
        this.setupIpcHandlers();
    }

    /**
     * إنشاء النافذة الرئيسية
     */
    async createMainWindow() {
        try {
            this.mainWindow = new BrowserWindow({
                width: 1400,
                height: 900,
                minWidth: 1000,
                minHeight: 700,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    enableRemoteModule: true
                },
                titleBarStyle: 'default',
                icon: path.join(__dirname, 'assets', 'icon.png'),
                show: false // إخفاء النافذة حتى تكتمل التهيئة
            });

            // تحميل واجهة اختيار الوضع
            await this.loadModeSelector();

            // عرض النافذة بعد التحميل
            this.mainWindow.once('ready-to-show', () => {
                this.mainWindow.show();
                console.log('🎨 تم عرض النافذة الرئيسية');
            });

            // معالجة إغلاق النافذة
            this.mainWindow.on('closed', () => {
                this.mainWindow = null;
            });

            // إعداد القائمة
            this.updateMenu();

        } catch (error) {
            console.error('❌ خطأ في إنشاء النافذة:', error);
            throw error;
        }
    }

    /**
     * تحميل واجهة اختيار الوضع
     */
    async loadModeSelector() {
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wahy Dual Mode - اختيار الوضع</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mode-selector {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                    max-width: 800px;
                    width: 90%;
                    text-align: center;
                }
                .logo {
                    font-size: 48px;
                    margin-bottom: 10px;
                }
                h1 {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0 0 10px 0;
                    font-size: 2.5em;
                }
                .subtitle {
                    color: #666;
                    margin-bottom: 40px;
                    font-size: 1.1em;
                }
                .modes-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 40px;
                }
                .mode-card {
                    border: 2px solid #e0e0e0;
                    border-radius: 15px;
                    padding: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: white;
                }
                .mode-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                .mode-card.web-dev:hover {
                    border-color: #3B82F6;
                    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.2);
                }
                .mode-card.cyber:hover {
                    border-color: #EF4444;
                    box-shadow: 0 15px 30px rgba(239, 68, 68, 0.2);
                }
                .mode-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }
                .mode-title {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #333;
                }
                .mode-description {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .mode-features {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 15px;
                }
                .feature {
                    text-align: center;
                    font-size: 0.85em;
                    color: #888;
                }
                .feature-number {
                    display: block;
                    font-weight: bold;
                    font-size: 1.2em;
                    color: #333;
                }
                .start-button {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    border-radius: 50px;
                    font-size: 1.1em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .start-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
                .start-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .selected {
                    border-color: #667eea !important;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
            </style>
        </head>
        <body>
            <div class="mode-selector">
                <div class="logo">🚀</div>
                <h1>Wahy وَحي</h1>
                <p class="subtitle">اختر وضع العمل المناسب لمشروعك</p>
                
                <div class="modes-container">
                    <div class="mode-card web-dev" onclick="selectMode('web-dev')">
                        <div class="mode-icon">🌐</div>
                        <div class="mode-title">تطوير الويب</div>
                        <div class="mode-description">
                            إنشاء وتطوير مواقع الويب باستخدام لغة وحي مع دعم HTML، CSS، وJavaScript
                        </div>
                        <div class="mode-features">
                            <div class="feature">
                                <span class="feature-number">3</span>
                                مفسرات
                            </div>
                            <div class="feature">
                                <span class="feature-number">5+</span>
                                مكتبات
                            </div>
                            <div class="feature">
                                <span class="feature-number">250MB</span>
                                ذاكرة
                            </div>
                        </div>
                    </div>
                    
                    <div class="mode-card cyber" onclick="selectMode('cybersecurity')">
                        <div class="mode-icon">🔒</div>
                        <div class="mode-title">الأمن السيبراني</div>
                        <div class="mode-description">
                            أدوات التحليل الأمني وفحص الشبكات وحماية البيانات باستخدام لغة وحي
                        </div>
                        <div class="mode-features">
                            <div class="feature">
                                <span class="feature-number">4</span>
                                أدوات فحص
                            </div>
                            <div class="feature">
                                <span class="feature-number">6+</span>
                                محللات
                            </div>
                            <div class="feature">
                                <span class="feature-number">300MB</span>
                                ذاكرة
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="start-button" id="start-btn" disabled onclick="startSelectedMode()">
                    اختر وضعاً للبدء
                </button>
            </div>

            <script>
                let selectedMode = null;

                function selectMode(modeId) {
                    selectedMode = modeId;
                    
                    // إزالة التحديد السابق
                    document.querySelectorAll('.mode-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    // تحديد الوضع الجديد
                    document.querySelector('.' + (modeId === 'web-dev' ? 'web-dev' : 'cyber')).classList.add('selected');
                    
                    // تفعيل زر البدء
                    const startBtn = document.getElementById('start-btn');
                    startBtn.disabled = false;
                    startBtn.textContent = 'بدء وضع ' + (modeId === 'web-dev' ? 'تطوير الويب' : 'الأمن السيبراني');
                }

                function startSelectedMode() {
                    if (selectedMode) {
                        // إرسال الاختيار للتطبيق الرئيسي
                        if (window.require) {
                            const { ipcRenderer } = window.require('electron');
                            ipcRenderer.send('start-mode', selectedMode);
                        }
                    }
                }

                // التحقق من آخر وضع مستخدم
                try {
                    const lastMode = localStorage.getItem('wahy-last-mode');
                    if (lastMode) {
                        selectMode(lastMode);
                    }
                } catch (error) {
                    console.log('لم يتم العثور على آخر وضع مستخدم');
                }
            </script>
        </body>
        </html>`;

        // حفظ الملف وتحميله
        const tempHtmlPath = path.join(__dirname, 'temp-mode-selector.html');
        fs.writeFileSync(tempHtmlPath, htmlContent);
        
        await this.mainWindow.loadFile(tempHtmlPath);
        
        // حذف الملف المؤقت
        setTimeout(() => {
            try {
                fs.unlinkSync(tempHtmlPath);
            } catch (error) {
                console.warn('تعذر حذف الملف المؤقت:', error.message);
            }
        }, 1000);
    }

    /**
     * إعداد معالجات IPC
     */
    setupIpcHandlers() {
        // بدء وضع محدد
        ipcMain.handle('start-mode', async (event, modeId) => {
            try {
                await this.modeManager.switchMode(modeId);
                await this.loadModeInterface(modeId);
                return { success: true };
            } catch (error) {
                console.error('❌ خطأ في بدء الوضع:', error);
                return { success: false, error: error.message };
            }
        });

        // معلومات الأداء
        ipcMain.handle('get-performance-stats', () => {
            return this.modeManager.getPerformanceStats();
        });

        // تبديل الوضع
        ipcMain.handle('switch-mode', async (event, modeId) => {
            try {
                await this.modeManager.switchMode(modeId);
                await this.loadModeInterface(modeId);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        // الحصول على الأوضاع المتاحة
        ipcMain.handle('get-available-modes', () => {
            return this.modeManager.getAvailableModes();
        });
    }

    /**
     * تحميل واجهة الوضع
     */
    async loadModeInterface(modeId) {
        const mode = this.modeManager.getCurrentMode();
        if (!mode) {
            throw new Error('لم يتم العثور على الوضع المحدد');
        }

        // تحديد مسار واجهة الوضع
        const interfacePath = path.join(__dirname, 'modes', modeId, 'ui-components', 'main-interface.html');
        
        if (fs.existsSync(interfacePath)) {
            await this.mainWindow.loadFile(interfacePath);
        } else {
            // استخدام الواجهة الافتراضية
            await this.loadDefaultInterface(mode);
        }
        
        console.log(`🎨 تم تحميل واجهة وضع: ${mode.name}`);
    }

    /**
     * تحميل الواجهة الافتراضية
     */
    async loadDefaultInterface(mode) {
        const htmlContent = this.generateDefaultInterface(mode);
        const tempPath = path.join(__dirname, `temp-${mode.id}-interface.html`);
        
        fs.writeFileSync(tempPath, htmlContent);
        await this.mainWindow.loadFile(tempPath);
        
        setTimeout(() => {
            try {
                fs.unlinkSync(tempPath);
            } catch (error) {
                console.warn('تعذر حذف الملف المؤقت:', error.message);
            }
        }, 1000);
    }

    /**
     * إنتاج الواجهة الافتراضية
     */
    generateDefaultInterface(mode) {
        return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wahy ${mode.name}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f5f5f5;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    background: ${mode.color};
                    color: white;
                    padding: 15px 30px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .mode-icon {
                    font-size: 32px;
                }
                .mode-info h1 {
                    margin: 0;
                    font-size: 1.5em;
                }
                .mode-info p {
                    margin: 5px 0 0 0;
                    opacity: 0.9;
                    font-size: 0.9em;
                }
                .content {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    text-align: center;
                }
                .welcome-message {
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    max-width: 600px;
                }
                .welcome-message h2 {
                    color: ${mode.color};
                    margin-top: 0;
                    font-size: 2em;
                }
                .features-list {
                    text-align: right;
                    margin: 30px 0;
                    color: #666;
                }
                .features-list li {
                    margin: 10px 0;
                    padding: 5px 0;
                }
                .status-info {
                    background: #e8f5e8;
                    border: 1px solid #c3e6c3;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                    color: #2e7d2e;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="mode-icon">${mode.icon}</div>
                <div class="mode-info">
                    <h1>وضع ${mode.name}</h1>
                    <p>${mode.description}</p>
                </div>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <h2>مرحباً بك في وضع ${mode.name}</h2>
                    <p>تم تحميل الوضع بنجاح! يمكنك الآن البدء في استخدام جميع الأدوات والمفسرات المتاحة.</p>
                    
                    <div class="features-list">
                        <h3>المميزات المتاحة:</h3>
                        <ul>
                            ${mode.interpreters.map(interpreter => `<li>📝 مفسر ${interpreter}</li>`).join('')}
                            ${mode.libraries.map(library => `<li>📚 مكتبة ${library}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="status-info">
                        <strong>✅ الحالة:</strong> الوضع نشط ومُحمّل بالكامل<br>
                        <strong>💾 الذاكرة:</strong> ${Math.round(mode.memoryLimit / 1024 / 1024)} MB محجوزة<br>
                        <strong>⌨️ الاختصارات:</strong> ${mode.shortcuts.map(s => s.key).join(', ')}
                    </div>
                </div>
            </div>
            
            <script>
                // يمكن إضافة منطق JavaScript هنا لاحقاً
                console.log('تم تحميل وضع ${mode.name} بنجاح');
            </script>
        </body>
        </html>`;
    }

    /**
     * تحديث عنوان النافذة
     */
    updateWindowTitle() {
        if (this.mainWindow && this.currentMode) {
            const mode = this.modeManager.getCurrentMode();
            this.mainWindow.setTitle(`Wahy وَحي - ${mode.name}`);
        }
    }

    /**
     * تحديث القائمة
     */
    updateMenu() {
        const template = [
            {
                label: 'ملف',
                submenu: [
                    { label: 'جديد', accelerator: 'CmdOrCtrl+N', click: () => this.newProject() },
                    { label: 'فتح', accelerator: 'CmdOrCtrl+O', click: () => this.openProject() },
                    { label: 'حفظ', accelerator: 'CmdOrCtrl+S', click: () => this.saveProject() },
                    { type: 'separator' },
                    { label: 'خروج', accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q', click: () => this.shutdown() }
                ]
            },
            {
                label: 'الأوضاع',
                submenu: [
                    { label: 'تبديل الوضع', accelerator: 'CmdOrCtrl+M', click: () => this.showModeSelector() },
                    { type: 'separator' },
                    { label: 'وضع تطوير الويب', click: () => this.switchToMode('web-dev') },
                    { label: 'وضع الأمن السيبراني', click: () => this.switchToMode('cybersecurity') }
                ]
            },
            {
                label: 'عرض',
                submenu: [
                    { label: 'إعادة تحميل', accelerator: 'CmdOrCtrl+R', click: () => this.mainWindow.reload() },
                    { label: 'أدوات المطور', accelerator: 'F12', click: () => this.mainWindow.toggleDevTools() },
                    { type: 'separator' },
                    { label: 'تكبير', accelerator: 'CmdOrCtrl+Plus', click: () => this.zoomIn() },
                    { label: 'تصغير', accelerator: 'CmdOrCtrl+-', click: () => this.zoomOut() },
                    { label: 'حجم عادي', accelerator: 'CmdOrCtrl+0', click: () => this.resetZoom() }
                ]
            },
            {
                label: 'مساعدة',
                submenu: [
                    { label: 'دليل الاستخدام', click: () => this.showHelp() },
                    { label: 'حول البرنامج', click: () => this.showAbout() }
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    /**
     * عرض خطأ الأمان
     */
    showSecurityError(securityResult) {
        dialog.showErrorBox(
            'خطأ في نظام الحماية',
            `فشل التحقق من نظام الحماية:\n\n${securityResult.error}\n\nالنقاط الأمنية: ${securityResult.score}/100\nالحد الأدنى المطلوب: 70 نقطة`
        );
        app.quit();
    }

    /**
     * إغلاق التطبيق
     */
    async shutdown() {
        try {
            console.log('🔄 إغلاق التطبيق...');
            
            // إغلاق مدير الأوضاع
            if (this.modeManager) {
                await this.modeManager.shutdown();
            }
            
            // إغلاق التطبيق
            app.quit();
            
        } catch (error) {
            console.error('❌ خطأ في إغلاق التطبيق:', error);
            app.quit();
        }
    }

    // دوال إضافية للقائمة
    newProject() { console.log('إنشاء مشروع جديد'); }
    openProject() { console.log('فتح مشروع'); }
    saveProject() { console.log('حفظ المشروع'); }
    showModeSelector() { this.loadModeSelector(); }
    async switchToMode(modeId) { 
        try {
            await this.modeManager.switchMode(modeId);
            await this.loadModeInterface(modeId);
        } catch (error) {
            console.error('خطأ في تبديل الوضع:', error);
        }
    }
    zoomIn() { this.mainWindow.webContents.setZoomLevel(this.mainWindow.webContents.getZoomLevel() + 0.5); }
    zoomOut() { this.mainWindow.webContents.setZoomLevel(this.mainWindow.webContents.getZoomLevel() - 0.5); }
    resetZoom() { this.mainWindow.webContents.setZoomLevel(0); }
    showHelp() { console.log('عرض المساعدة'); }
    showAbout() { 
        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'حول Wahy Dual Mode',
            message: 'Wahy وَحي - Dual Mode v2.0',
            detail: 'لغة البرمجة العربية مع دعم أوضاع متعددة\nتطوير الويب والأمن السيبراني\n\nمطور بواسطة فريق وحي'
        });
    }
}

// تشغيل التطبيق
const wahyApp = new WahyDualModeApp();

// التحقق من إمكانية التشغيل
if (app.requestSingleInstanceLock()) {
    wahyApp.initialize().catch(error => {
        console.error('❌ فشل تهيئة التطبيق:', error);
        app.quit();
    });
} else {
    app.quit();
}

module.exports = WahyDualModeApp;