/**
 * Wahy Desktop - Crypto Engine
 * محرك التشفير المتقدم لحماية النظام
 * 
 * هذا المحرك يستخدم تشفير AES-256 مع مفاتيح متعددة
 * لحماية بيانات الترخيص والتحقق من سلامة النظام
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// مفاتيح التشفير المدمجة (سيتم تشفيرها لاحقاً)
const MASTER_KEY = 'wahy_2024_protection_system_key_v1_arabic_programming';
const SALT = 'wahy_salt_protection_2024';
const ALGORITHM = 'aes-256-gcm';

class WahyCryptoEngine {
    constructor() {
        this.isSystemValid = false;
        this.licenseData = null;
        this.systemFingerprint = this.generateSystemFingerprint();
    }

    /**
     * توليد بصمة النظام الفريدة
     * @returns {string} بصمة النظام
     */
    generateSystemFingerprint() {
        const os = require('os');
        const systemInfo = {
            platform: os.platform(),
            arch: os.arch(),
            hostname: os.hostname(),
            user: os.userInfo().username,
            totalMem: os.totalmem(),
            cpus: os.cpus().length
        };
        
        const fingerprint = crypto
            .createHash('sha256')
            .update(JSON.stringify(systemInfo) + SALT)
            .digest('hex');
            
        return fingerprint.substring(0, 32);
    }

    /**
     * إنشاء مفتاح تشفير مشتق
     * @param {string} baseKey المفتاح الأساسي
     * @returns {Buffer} المفتاح المشتق
     */
    deriveKey(baseKey) {
        return crypto.pbkdf2Sync(
            baseKey + this.systemFingerprint, 
            SALT, 
            100000, 
            32, 
            'sha256'
        );
    }

    /**
     * تشفير البيانات
     * @param {string} data البيانات المراد تشفيرها
     * @param {string} customKey مفتاح مخصص (اختياري)
     * @returns {string} البيانات المشفرة
     */
    encrypt(data, customKey = MASTER_KEY) {
        try {
            const key = this.deriveKey(customKey);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipherGCM(ALGORITHM, key, iv);
            
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const authTag = cipher.getAuthTag();
            
            return {
                encrypted: encrypted,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex'),
                fingerprint: this.systemFingerprint
            };
        } catch (error) {
            this.triggerSecurityBreach('encryption_failed');
            return null;
        }
    }

    /**
     * فك تشفير البيانات
     * @param {Object} encryptedData البيانات المشفرة
     * @param {string} customKey مفتاح مخصص (اختياري)
     * @returns {string} البيانات المفكوكة
     */
    decrypt(encryptedData, customKey = MASTER_KEY) {
        try {
            // التحقق من بصمة النظام
            if (encryptedData.fingerprint !== this.systemFingerprint) {
                this.triggerSecurityBreach('system_fingerprint_mismatch');
                return null;
            }

            const key = this.deriveKey(customKey);
            const iv = Buffer.from(encryptedData.iv, 'hex');
            const decipher = crypto.createDecipherGCM(ALGORITHM, key, iv);
            
            decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
            
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            this.triggerSecurityBreach('decryption_failed');
            return null;
        }
    }

    /**
     * إنشاء ملف ترخيص مشفر
     * @param {Object} licenseInfo معلومات الترخيص
     * @returns {boolean} نجاح العملية
     */
    createLicenseFile(licenseInfo) {
        try {
            const licenseData = {
                key: licenseInfo.key || 'WAHY_DESKTOP_COMMUNITY_LICENSE',
                owner: licenseInfo.owner || 'Community User',
                type: licenseInfo.type || 'community',
                activation_date: new Date().toISOString(),
                fingerprint: this.systemFingerprint,
                version: '1.0.0',
                features: licenseInfo.features || ['basic_editor', 'html_generation', 'community_support'],
                expiry: licenseInfo.expiry || null,
                checksum: null
            };

            // إنشاء checksum للبيانات
            licenseData.checksum = crypto
                .createHash('sha256')
                .update(JSON.stringify(licenseData) + MASTER_KEY)
                .digest('hex');

            const encryptedLicense = this.encrypt(JSON.stringify(licenseData));
            
            if (!encryptedLicense) {
                return false;
            }

            const licensePath = path.join(__dirname, '..', 'wahy.lic');
            fs.writeFileSync(licensePath, JSON.stringify(encryptedLicense));
            
            return true;
        } catch (error) {
            console.error('فشل في إنشاء ملف الترخيص:', error);
            return false;
        }
    }

    /**
     * التحقق من ملف الترخيص
     * @returns {boolean} صحة الترخيص
     */
    validateLicense() {
        try {
            const licensePath = path.join(__dirname, '..', 'wahy.lic');
            
            // التحقق من وجود الملف
            if (!fs.existsSync(licensePath)) {
                this.triggerSecurityBreach('license_file_missing');
                return false;
            }

            // قراءة وفك تشفير الملف
            const encryptedData = JSON.parse(fs.readFileSync(licensePath, 'utf8'));
            const decryptedData = this.decrypt(encryptedData);
            
            if (!decryptedData) {
                this.triggerSecurityBreach('license_decryption_failed');
                return false;
            }

            const licenseData = JSON.parse(decryptedData);
            
            // التحقق من checksum
            const originalChecksum = licenseData.checksum;
            licenseData.checksum = null;
            
            const calculatedChecksum = crypto
                .createHash('sha256')
                .update(JSON.stringify(licenseData) + MASTER_KEY)
                .digest('hex');
                
            if (originalChecksum !== calculatedChecksum) {
                this.triggerSecurityBreach('license_checksum_invalid');
                return false;
            }

            // التحقق من صحة البيانات
            if (licenseData.fingerprint !== this.systemFingerprint) {
                this.triggerSecurityBreach('license_system_mismatch');
                return false;
            }

            // التحقق من انتهاء الصلاحية
            if (licenseData.expiry && new Date(licenseData.expiry) < new Date()) {
                this.triggerSecurityBreach('license_expired');
                return false;
            }

            this.licenseData = licenseData;
            this.isSystemValid = true;
            return true;
            
        } catch (error) {
            this.triggerSecurityBreach('license_validation_error');
            return false;
        }
    }

    /**
     * تفعيل إجراءات الأمان عند اكتشاف خرق
     * @param {string} reason سبب الخرق
     */
    triggerSecurityBreach(reason) {
        console.log(`🔒 تم اكتشاف خرق أمني: ${reason}`);
        
        // تسجيل الحدث
        this.logSecurityEvent(reason);
        
        // تعطيل النظام
        this.isSystemValid = false;
    }

    /**
     * تسجيل أحداث الأمان
     * @param {string} reason سبب الحدث
     */
    logSecurityEvent(reason) {
        try {
            const logPath = path.join(__dirname, '..', 'security.log');
            const logEntry = {
                timestamp: new Date().toISOString(),
                reason: reason,
                fingerprint: this.systemFingerprint,
                platform: require('os').platform()
            };
            
            fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            // تجاهل أخطاء التسجيل لتجنب تعطيل النظام
        }
    }

    /**
     * الحصول على حالة النظام
     * @returns {Object} حالة النظام
     */
    getSystemStatus() {
        return {
            isValid: this.isSystemValid,
            license: this.licenseData ? {
                type: this.licenseData.type,
                owner: this.licenseData.owner,
                activation_date: this.licenseData.activation_date,
                features: this.licenseData.features
            } : null,
            fingerprint: this.systemFingerprint
        };
    }
}

module.exports = WahyCryptoEngine;