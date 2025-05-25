/**
 * Wahy Desktop - Protection Manager
 * مدير الحماية المركزي لنظام وحي
 * 
 * يتحكم في جميع جوانب الحماية والتحقق من التراخيص
 * ويوفر واجهة موحدة لجميع مكونات النظام
 */

const SecurityShield = require('./security-shield');
const LicenseValidator = require('./license-validator');
const WahyCryptoEngine = require('./crypto-engine');
const path = require('path');
const { BrowserWindow } = require('electron');

class ProtectionManager {
    constructor() {
        this.isInitialized = false;
        this.isSystemLocked = false;
        this.mainWindow = null;
        this.lockWindow = null;
        
        // مكونات الحماية
        this.licenseValidator = null;
        this.securityShield = null;
        this.cryptoEngine = null;
        
        // حالة النظام
        this.systemStatus = {
            protection: 'inactive',
            license: 'unknown',
            security: 'unknown',
            lastCheck: null
        };
    }

    /**
     * تهيئة نظام الحماية
     * @param {BrowserWindow} mainWindow النافذة الرئيسية
     * @returns {Promise<boolean>} نجاح التهيئة
     */
    async initialize(mainWindow) {
        try {
            console.log('🛡️ تهيئة نظام الحماية...');
            
            this.mainWindow = mainWindow;
            
            // تهيئة مكونات التشفير
            this.cryptoEngine = new WahyCryptoEngine();
            
            // تهيئة مدقق التراخيص
            this.licenseValidator = new LicenseValidator();
            
            // التحقق الأولي من النظام
            const validationResult = await this.performInitialValidation();
            
            if (!validationResult) {
                await this.lockSystem('initial_validation_failed');
                return false;
            }
            
            // تفعيل الدرع الأمني
            this.securityShield = new SecurityShield();
            
            // تسجيل المستمعين للأحداث
            this.registerEventListeners();
            
            // تحديث حالة النظام
            this.updateSystemStatus();
            
            this.isInitialized = true;
            console.log('✅ تم تفعيل نظام الحماية بنجاح');
            
            return true;
            
        } catch (error) {
            console.error('❌ فشل في تهيئة نظام الحماية:', error);
            await this.lockSystem('initialization_error');
            return false;
        }
    }

    /**
     * التحقق الأولي من النظام
     */
    async performInitialValidation() {
        try {
            // التحقق من وجود الملفات الأساسية
            const filesCheck = this.validateCriticalFiles();
            if (!filesCheck) {
                console.error('❌ فشل فحص الملفات الأساسية');
                return false;
            }

            // التحقق من صحة الترخيص
            const licenseCheck = this.licenseValidator.performInitialValidation();
            if (!licenseCheck) {
                console.error('❌ فشل فحص الترخيص');
                return false;
            }

            // التحقق من بيئة النظام
            const environmentCheck = this.validateEnvironment();
            if (!environmentCheck) {
                console.error('❌ فشل فحص البيئة');
                return false;
            }

            return true;

        } catch (error) {
            console.error('❌ خطأ في التحقق الأولي:', error);
            return false;
        }
    }

    /**
     * التحقق من الملفات الأساسية
     */
    validateCriticalFiles() {
        const fs = require('fs');
        
        const criticalFiles = [
            '../main.js',
            '../preload.js',
            '../renderer.js',
            '../wahy-interpreter.js'
        ];

        for (const file of criticalFiles) {
            const filePath = path.join(__dirname, file);
            
            if (!fs.existsSync(filePath)) {
                console.error(`❌ ملف أساسي مفقود: ${file}`);
                return false;
            }
            
            // فحص حجم الملف
            try {
                const stats = fs.statSync(filePath);
                if (stats.size < 100) {
                    console.error(`❌ ملف صغير جداً (مشبوه): ${file}`);
                    return false;
                }
            } catch (error) {
                console.error(`❌ خطأ في قراءة الملف: ${file}`);
                return false;
            }
        }

        return true;
    }

    /**
     * التحقق من بيئة النظام
     */
    validateEnvironment() {
        const os = require('os');
        
        // فحص النظام
        const platform = os.platform();
        const arch = os.arch();
        const nodeVersion = process.version;
        
        // التحقق من دعم النظام
        const supportedPlatforms = ['win32', 'darwin', 'linux'];
        const supportedArchs = ['x64', 'arm64'];
        
        if (!supportedPlatforms.includes(platform)) {
            console.error(`❌ نظام التشغيل غير مدعوم: ${platform}`);
            return false;
        }
        
        if (!supportedArchs.includes(arch)) {
            console.error(`❌ معمارية النظام غير مدعومة: ${arch}`);
            return false;
        }
        
        // التحقق من إصدار Node.js
        const nodeVersionNumber = parseInt(nodeVersion.slice(1));
        if (nodeVersionNumber < 16) {
            console.error(`❌ إصدار Node.js قديم: ${nodeVersion}`);
            return false;
        }
        
        return true;
    }

    /**
     * تسجيل مستمعي الأحداث
     */
    registerEventListeners() {
        // مستمع لأحداث القفل الأمني
        process.on('wahy-security-lock', (data) => {
            console.log('🔒 تم استقبال حدث قفل أمني:', data);
            this.lockSystem(data.reason);
        });

        // مستمع لأحداث النافذة الرئيسية
        if (this.mainWindow) {
            this.mainWindow.on('closed', () => {
                this.cleanup();
            });
        }

        // مستمع لأحداث إيقاف التطبيق
        process.on('before-quit', () => {
            this.cleanup();
        });
    }

    /**
     * قفل النظام وإظهار واجهة التعطيل
     */
    async lockSystem(reason) {
        if (this.isSystemLocked) {
            return; // النظام مقفل بالفعل
        }

        console.log(`🔒 قفل النظام: ${reason}`);
        
        this.isSystemLocked = true;
        this.systemStatus.protection = 'locked';
        
        // إخفاء النافذة الرئيسية
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.hide();
        }
        
        // إنشاء نافذة القفل
        await this.createLockWindow(reason);
        
        // منع استخدام النظام
        this.disableSystemFunctions();
    }

    /**
     * إنشاء نافذة القفل
     */
    async createLockWindow(reason) {
        try {
            if (this.lockWindow && !this.lockWindow.isDestroyed()) {
                this.lockWindow.focus();
                return;
            }

            this.lockWindow = new BrowserWindow({
                width: 800,
                height: 600,
                resizable: false,
                minimizable: false,
                maximizable: false,
                closable: false,
                alwaysOnTop: true,
                fullscreenable: false,
                skipTaskbar: false,
                title: 'نظام الحماية - وحي',
                icon: path.join(__dirname, '..', 'assets', 'icon.png'),
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    enableRemoteModule: false,
                    webSecurity: true,
                    allowRunningInsecureContent: false,
                    preload: path.join(__dirname, 'lockdown-preload.js')
                }
            });

            // تحميل واجهة القفل
            const lockdownPath = path.join(__dirname, 'lockdown-interface.html');
            await this.lockWindow.loadFile(lockdownPath);

            // إرسال بيانات الخطأ
            this.lockWindow.webContents.once('did-finish-load', () => {
                const errorData = {
                    reason: reason,
                    message: this.getErrorMessage(reason),
                    timestamp: new Date().toISOString()
                };
                
                this.lockWindow.webContents.send('system-locked', errorData);
            });

            // منع إغلاق النافذة
            this.lockWindow.on('close', (event) => {
                event.preventDefault();
            });

            console.log('🔒 تم إنشاء نافذة القفل');

        } catch (error) {
            console.error('❌ فشل في إنشاء نافذة القفل:', error);
        }
    }

    /**
     * الحصول على رسالة الخطأ المناسبة
     */
    getErrorMessage(reason) {
        const messages = {
            'license_file_missing': 'ملف الترخيص غير موجود. تم تعطيل النظام لحماية الملكية الفكرية.',
            'license_decryption_failed': 'فشل في قراءة ملف الترخيص. تم اكتشاف تلاعب في الملفات.',
            'license_checksum_invalid': 'ملف الترخيص تالف أو تم التلاعب به بطريقة غير مصرح بها.',
            'license_system_mismatch': 'ملف الترخيص لا يطابق هذا النظام. محاولة نقل غير مصرح بها.',
            'license_expired': 'انتهت صلاحية الترخيص. يرجى تجديد الترخيص لمتابعة الاستخدام.',
            'critical_file_missing': 'ملف نظام مهم مفقود. تم اكتشاف تلف في التثبيت.',
            'initial_validation_failed': 'فشل التحقق الأولي من النظام. توجد مشاكل في التثبيت.',
            'security_shield_triggered': 'تم تفعيل الدرع الأمني بسبب نشاط مشبوه.',
            'default': 'تم تعطيل النظام بسبب مشكلة في الأمان. يرجى إعادة التثبيت.'
        };

        return messages[reason] || messages.default;
    }

    /**
     * تعطيل وظائف النظام
     */
    disableSystemFunctions() {
        // منع تشغيل مفسر وحي
        global.wahyInterpreterDisabled = true;
        
        // منع حفظ الملفات
        global.fileSaveDisabled = true;
        
        // منع إنشاء مشاريع جديدة
        global.newProjectDisabled = true;
        
        console.log('🚫 تم تعطيل جميع وظائف النظام');
    }

    /**
     * تحديث حالة النظام
     */
    updateSystemStatus() {
        if (this.licenseValidator) {
            const validatorStatus = this.licenseValidator.getSystemStatus();
            this.systemStatus.license = validatorStatus.isLocked ? 'invalid' : 'valid';
        }
        
        if (this.securityShield) {
            this.systemStatus.security = this.securityShield.isShieldActive() ? 'active' : 'inactive';
        }
        
        this.systemStatus.protection = this.isSystemLocked ? 'locked' : 'active';
        this.systemStatus.lastCheck = new Date().toISOString();
    }

    /**
     * الحصول على حالة النظام
     */
    getSystemStatus() {
        this.updateSystemStatus();
        return {
            ...this.systemStatus,
            initialized: this.isInitialized,
            locked: this.isSystemLocked
        };
    }

    /**
     * التحقق من إمكانية تشغيل النظام
     */
    canSystemRun() {
        return this.isInitialized && !this.isSystemLocked;
    }

    /**
     * تنظيف الموارد
     */
    cleanup() {
        console.log('🧹 تنظيف موارد نظام الحماية...');
        
        // تنظيف مدقق التراخيص
        if (this.licenseValidator) {
            this.licenseValidator.cleanup();
        }
        
        // إغلاق نافذة القفل
        if (this.lockWindow && !this.lockWindow.isDestroyed()) {
            this.lockWindow.destroy();
        }
        
        // إزالة المستمعين
        process.removeAllListeners('wahy-security-lock');
        process.removeAllListeners('before-quit');
    }

    /**
     * إعادة تشغيل النظام (للتطوير فقط)
     */
    resetSystem() {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 إعادة تشغيل نظام الحماية (وضع التطوير)');
            
            this.isSystemLocked = false;
            this.systemStatus.protection = 'active';
            
            if (this.lockWindow && !this.lockWindow.isDestroyed()) {
                this.lockWindow.destroy();
            }
            
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
                this.mainWindow.show();
            }
            
            // إعادة تفعيل الوظائف
            global.wahyInterpreterDisabled = false;
            global.fileSaveDisabled = false;
            global.newProjectDisabled = false;
        }
    }
}

module.exports = ProtectionManager;