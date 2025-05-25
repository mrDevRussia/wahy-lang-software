/**
 * Wahy Desktop - License Validator
 * نظام التحقق من التراخيص والحماية المتقدمة
 * 
 * يقوم بالتحقق المستمر من صحة الترخيص وحماية النظام من التلاعب
 */

const WahyCryptoEngine = require('./crypto-engine');
const fs = require('fs');
const path = require('path');

class LicenseValidator {
    constructor() {
        this.cryptoEngine = new WahyCryptoEngine();
        this.validationInterval = null;
        this.isSystemLocked = false;
        this.securityChecks = new Map();
        
        // بدء عمليات التحقق
        this.initializeSecurityChecks();
    }

    /**
     * تهيئة فحوصات الأمان
     */
    initializeSecurityChecks() {
        // التحقق الأولي
        this.performInitialValidation();
        
        // التحقق الدوري (كل 30 ثانية)
        this.validationInterval = setInterval(() => {
            this.performPeriodicValidation();
        }, 30000);
        
        // مراقبة تغييرات الملفات
        this.watchLicenseFile();
    }

    /**
     * التحقق الأولي من النظام
     * @returns {boolean} حالة صحة النظام
     */
    performInitialValidation() {
        try {
            // التحقق من وجود ملف الترخيص
            const licenseExists = this.checkLicenseFileExists();
            if (!licenseExists) {
                // إنشاء ترخيص افتراضي للمجتمع
                this.createDefaultLicense();
            }

            // التحقق من صحة الترخيص
            const isValid = this.cryptoEngine.validateLicense();
            
            if (!isValid) {
                this.lockSystem('initial_validation_failed');
                return false;
            }

            console.log('✅ تم التحقق من صحة الترخيص بنجاح');
            return true;

        } catch (error) {
            console.error('❌ فشل في التحقق الأولي:', error);
            this.lockSystem('initial_validation_error');
            return false;
        }
    }

    /**
     * التحقق الدوري من النظام
     */
    performPeriodicValidation() {
        if (this.isSystemLocked) {
            return;
        }

        try {
            // التحقق من سلامة ملف الترخيص
            const isValid = this.cryptoEngine.validateLicense();
            
            if (!isValid) {
                this.lockSystem('periodic_validation_failed');
                return;
            }

            // التحقق من سلامة ملفات النظام
            this.validateSystemIntegrity();

        } catch (error) {
            console.error('❌ فشل في التحقق الدوري:', error);
            this.lockSystem('periodic_validation_error');
        }
    }

    /**
     * مراقبة تغييرات ملف الترخيص
     */
    watchLicenseFile() {
        try {
            const licensePath = path.join(__dirname, '..', 'wahy.lic');
            
            if (fs.existsSync(licensePath)) {
                fs.watchFile(licensePath, (curr, prev) => {
                    console.log('🔍 تم اكتشاف تغيير في ملف الترخيص');
                    
                    // التحقق الفوري عند التغيير
                    setTimeout(() => {
                        const isValid = this.cryptoEngine.validateLicense();
                        if (!isValid) {
                            this.lockSystem('license_file_tampered');
                        }
                    }, 1000);
                });
            }
        } catch (error) {
            console.error('❌ فشل في مراقبة ملف الترخيص:', error);
        }
    }

    /**
     * التحقق من وجود ملف الترخيص
     * @returns {boolean} وجود الملف
     */
    checkLicenseFileExists() {
        const licensePath = path.join(__dirname, '..', 'wahy.lic');
        return fs.existsSync(licensePath);
    }

    /**
     * إنشاء ترخيص افتراضي للمجتمع
     */
    createDefaultLicense() {
        console.log('📝 إنشاء ترخيص افتراضي للمجتمع...');
        
        const defaultLicenseInfo = {
            key: 'WAHY_COMMUNITY_LICENSE_' + Date.now(),
            owner: 'Community User',
            type: 'community',
            features: [
                'basic_editor',
                'html_generation', 
                'css_styling',
                'javascript_basic',
                'file_save_load',
                'export_html'
            ],
            expiry: null // بدون انتهاء صلاحية للنسخة المجتمعية
        };

        const success = this.cryptoEngine.createLicenseFile(defaultLicenseInfo);
        
        if (!success) {
            this.lockSystem('license_creation_failed');
        }
    }

    /**
     * التحقق من سلامة ملفات النظام
     */
    validateSystemIntegrity() {
        const criticalFiles = [
            '../main.js',
            '../preload.js', 
            '../renderer.js',
            './crypto-engine.js'
        ];

        for (const file of criticalFiles) {
            const filePath = path.join(__dirname, file);
            
            if (!fs.existsSync(filePath)) {
                this.lockSystem(`critical_file_missing_${path.basename(file)}`);
                return;
            }
        }
    }

    /**
     * قفل النظام عند اكتشاف خرق
     * @param {string} reason سبب القفل
     */
    lockSystem(reason) {
        console.log(`🔒 تم قفل النظام: ${reason}`);
        
        this.isSystemLocked = true;
        this.cryptoEngine.triggerSecurityBreach(reason);
        
        // إيقاف التحقق الدوري
        if (this.validationInterval) {
            clearInterval(this.validationInterval);
        }

        // إظهار واجهة التعطيل
        this.showLockScreen(reason);
    }

    /**
     * إظهار واجهة تعطيل النظام
     * @param {string} reason سبب التعطيل
     */
    showLockScreen(reason) {
        // سيتم ربط هذا مع واجهة Electron لاحقاً
        const lockMessage = this.getLockMessage(reason);
        console.error('🚫 ' + lockMessage);
        
        // إرسال حدث للواجهة الرئيسية
        if (typeof global !== 'undefined' && global.mainWindow) {
            global.mainWindow.webContents.send('system-locked', {
                reason: reason,
                message: lockMessage
            });
        }
    }

    /**
     * الحصول على رسالة القفل المناسبة
     * @param {string} reason سبب القفل
     * @returns {string} رسالة القفل
     */
    getLockMessage(reason) {
        const messages = {
            'license_file_missing': 'ملف الترخيص غير موجود. تم تعطيل النظام.',
            'license_decryption_failed': 'فشل في قراءة ملف الترخيص. تم اكتشاف تلاعب.',
            'license_checksum_invalid': 'ملف الترخيص تالف أو تم التلاعب به.',
            'license_system_mismatch': 'ملف الترخيص لا يطابق هذا النظام.',
            'license_expired': 'انتهت صلاحية الترخيص.',
            'license_file_tampered': 'تم اكتشاف تغيير غير مصرح به في ملف الترخيص.',
            'critical_file_missing': 'ملف نظام مهم مفقود.',
            'system_fingerprint_mismatch': 'تم اكتشاف محاولة نقل غير مصرح بها.',
            'default': 'تم تعطيل النظام بسبب مشكلة في الأمان.'
        };

        return messages[reason] || messages.default;
    }

    /**
     * التحقق من حالة النظام
     * @returns {Object} حالة النظام
     */
    getSystemStatus() {
        return {
            isLocked: this.isSystemLocked,
            cryptoStatus: this.cryptoEngine.getSystemStatus(),
            licenseExists: this.checkLicenseFileExists(),
            lastCheck: new Date().toISOString()
        };
    }

    /**
     * إعادة تشغيل النظام (للاختبار فقط)
     */
    resetSystem() {
        if (process.env.NODE_ENV === 'development') {
            this.isSystemLocked = false;
            this.performInitialValidation();
            console.log('🔄 تم إعادة تشغيل النظام (وضع التطوير)');
        }
    }

    /**
     * تنظيف الموارد
     */
    cleanup() {
        if (this.validationInterval) {
            clearInterval(this.validationInterval);
        }
        
        // إيقاف مراقبة الملفات
        const licensePath = path.join(__dirname, '..', 'wahy.lic');
        if (fs.existsSync(licensePath)) {
            fs.unwatchFile(licensePath);
        }
    }
}

module.exports = LicenseValidator;