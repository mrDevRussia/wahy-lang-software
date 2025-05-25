/**
 * Wahy Desktop - Digital Signature Checker
 * مدقق التوقيع الرقمي المتكامل مع نظام الحماية
 * 
 * يتحقق من سلامة التوقيع الرقمي لملف LICENSE ويمنع التشغيل عند العبث
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SignatureChecker {
    constructor() {
        this.hashAlgorithm = 'sha256';
        this.publicKeyPath = path.join(__dirname, '..', 'keys', 'wahy-public.pem');
        this.licensePath = path.join(__dirname, '..', '..', 'LICENSE');
        this.signaturePath = path.join(__dirname, '..', '..', 'LICENSE.sig');
        
        this.isValid = false;
        this.lastCheckTime = null;
        this.checkCache = new Map();
    }

    /**
     * التحقق الأساسي من وجود الملفات المطلوبة
     */
    _checkRequiredFiles() {
        const missingFiles = [];
        
        if (!fs.existsSync(this.licensePath)) {
            missingFiles.push('LICENSE');
        }
        
        if (!fs.existsSync(this.signaturePath)) {
            missingFiles.push('LICENSE.sig');
        }
        
        if (!fs.existsSync(this.publicKeyPath)) {
            missingFiles.push('wahy-public.pem');
        }
        
        return missingFiles;
    }

    /**
     * قراءة وتحليل ملف التوقيع
     */
    _readSignatureData() {
        try {
            const signatureContent = fs.readFileSync(this.signaturePath, 'utf8');
            const signatureData = JSON.parse(signatureContent);
            
            // التحقق من وجود الحقول المطلوبة
            const requiredFields = ['signature', 'algorithm', 'fileHash', 'timestamp'];
            for (const field of requiredFields) {
                if (!signatureData[field]) {
                    throw new Error(`حقل مطلوب مفقود في ملف التوقيع: ${field}`);
                }
            }
            
            return signatureData;
            
        } catch (error) {
            throw new Error(`فشل في قراءة ملف التوقيع: ${error.message}`);
        }
    }

    /**
     * التحقق من التوقيع الرقمي
     */
    verifyDigitalSignature() {
        try {
            // فحص الملفات المطلوبة
            const missingFiles = this._checkRequiredFiles();
            if (missingFiles.length > 0) {
                return {
                    valid: false,
                    reason: 'missing_files',
                    details: `الملفات المفقودة: ${missingFiles.join(', ')}`,
                    critical: true
                };
            }

            // قراءة ملف LICENSE
            const licenseContent = fs.readFileSync(this.licensePath, 'utf8');
            
            // قراءة بيانات التوقيع
            const signatureData = this._readSignatureData();
            
            // التحقق من hash الملف
            const currentHash = crypto.createHash(this.hashAlgorithm)
                .update(licenseContent)
                .digest('hex');
                
            if (currentHash !== signatureData.fileHash) {
                return {
                    valid: false,
                    reason: 'file_modified',
                    details: 'تم تعديل محتوى ملف LICENSE',
                    critical: true
                };
            }

            // قراءة المفتاح العام
            const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
            
            // التحقق من التوقيع
            const verify = crypto.createVerify(this.hashAlgorithm);
            verify.update(licenseContent);
            verify.end();
            
            const isSignatureValid = verify.verify(publicKey, signatureData.signature, 'base64');
            
            if (!isSignatureValid) {
                return {
                    valid: false,
                    reason: 'invalid_signature',
                    details: 'التوقيع الرقمي غير صحيح',
                    critical: true
                };
            }

            // فحص عمر التوقيع (اختياري)
            const signatureAge = Date.now() - new Date(signatureData.timestamp).getTime();
            const maxAge = 365 * 24 * 60 * 60 * 1000; // سنة واحدة
            
            if (signatureAge > maxAge) {
                console.warn('⚠️ تحذير: التوقيع الرقمي قديم جداً');
            }

            this.isValid = true;
            this.lastCheckTime = new Date().toISOString();
            
            return {
                valid: true,
                reason: 'signature_verified',
                details: 'تم التحقق من التوقيع الرقمي بنجاح',
                signatureInfo: {
                    algorithm: signatureData.algorithm,
                    timestamp: signatureData.timestamp,
                    signer: signatureData.signer || 'Wahy Language Team'
                }
            };

        } catch (error) {
            return {
                valid: false,
                reason: 'verification_error',
                details: `خطأ في التحقق: ${error.message}`,
                critical: true
            };
        }
    }

    /**
     * فحص سريع مع تخزين مؤقت
     */
    quickCheck() {
        try {
            // التحقق من التخزين المؤقت
            const cacheKey = 'quick_signature_check';
            const cachedResult = this.checkCache.get(cacheKey);
            
            if (cachedResult && (Date.now() - cachedResult.timestamp) < 30000) { // 30 ثانية
                return cachedResult.result;
            }

            // فحص سريع للملفات
            const missingFiles = this._checkRequiredFiles();
            const result = missingFiles.length === 0;
            
            // حفظ في التخزين المؤقت
            this.checkCache.set(cacheKey, {
                result: result,
                timestamp: Date.now()
            });
            
            return result;
            
        } catch (error) {
            return false;
        }
    }

    /**
     * إظهار رسالة خطأ وإيقاف النظام
     */
    _terminateWithError(reason, details) {
        console.error('\n🚨 ═══════════════════════════════════════════════════════════════');
        console.error('🔴 خطأ حرج في التوقيع الرقمي');
        console.error('═══════════════════════════════════════════════════════════════');
        console.error(`❌ السبب: ${reason}`);
        console.error(`📝 التفاصيل: ${details}`);
        console.error('');
        console.error('⚠️  تم العبث بملف التراخيص أو التوقيع الرقمي – تم إيقاف المحرك');
        console.error('');
        console.error('🔧 للإصلاح:');
        console.error('   1. تأكد من وجود ملفات LICENSE و LICENSE.sig');
        console.error('   2. لا تقم بتعديل محتوى ملف LICENSE');
        console.error('   3. احصل على نسخة أصلية من المطور');
        console.error('');
        console.error('📞 للدعم: support@wahy-lang.org');
        console.error('═══════════════════════════════════════════════════════════════\n');
        
        // تسجيل الحدث
        this._logSecurityEvent(reason, details);
        
        // إيقاف النظام
        process.exit(1);
    }

    /**
     * تسجيل حدث أمني
     */
    _logSecurityEvent(reason, details) {
        try {
            const logPath = path.join(__dirname, '..', 'signature-violations.log');
            const logEntry = {
                timestamp: new Date().toISOString(),
                event: 'signature_verification_failed',
                reason: reason,
                details: details,
                platform: process.platform,
                nodeVersion: process.version
            };
            
            fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            // تجاهل أخطاء التسجيل لتجنب تعطيل النظام
        }
    }

    /**
     * التحقق الشامل مع إيقاف النظام عند الفشل
     */
    enforceSignatureIntegrity() {
        console.log('🔐 التحقق من التوقيع الرقمي لملف LICENSE...');
        
        const verification = this.verifyDigitalSignature();
        
        if (!verification.valid) {
            if (verification.critical) {
                this._terminateWithError(verification.reason, verification.details);
            } else {
                console.warn(`⚠️ تحذير في التوقيع الرقمي: ${verification.details}`);
            }
        } else {
            console.log('✅ تم التحقق من التوقيع الرقمي بنجاح');
            if (verification.signatureInfo) {
                console.log(`📝 معلومات التوقيع: ${verification.signatureInfo.algorithm}`);
                console.log(`👤 الموقع: ${verification.signatureInfo.signer}`);
            }
        }
        
        return verification.valid;
    }

    /**
     * فحص دوري للتوقيع
     */
    startPeriodicCheck(intervalMinutes = 10) {
        setInterval(() => {
            if (!this.quickCheck()) {
                console.error('🚨 فشل الفحص الدوري للتوقيع الرقمي');
                this.enforceSignatureIntegrity();
            }
        }, intervalMinutes * 60 * 1000);
        
        console.log(`🕰️ بدء الفحص الدوري للتوقيع كل ${intervalMinutes} دقائق`);
    }

    /**
     * الحصول على معلومات التوقيع
     */
    getSignatureInfo() {
        try {
            if (!this.quickCheck()) {
                return { error: 'ملفات التوقيع غير متوفرة' };
            }
            
            const signatureData = this._readSignatureData();
            
            return {
                algorithm: signatureData.algorithm,
                timestamp: signatureData.timestamp,
                signer: signatureData.signer,
                version: signatureData.version,
                valid: this.isValid,
                lastCheck: this.lastCheckTime
            };
            
        } catch (error) {
            return { error: error.message };
        }
    }
}

// تصدير مُحكم
module.exports = SignatureChecker;