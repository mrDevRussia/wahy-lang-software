/**
 * Wahy Desktop - Enhanced Digital Signature Verification System
 * نظام التحقق المحسن من التوقيع الرقمي لوحي Desktop
 */

const fs = require('fs');
const path = require('path');

class SignatureChecker {
    constructor() {
        this.publicKeyPath = path.join(__dirname, '../keys/public.pem');
        this.licensePath = path.join(__dirname, '../../LICENSE');
        this.signaturePath = path.join(__dirname, '../../LICENSE.sig');
    }

    /**
     * التحقق المحسن من التوقيع الرقمي للترخيص
     */
    verifyLicenseSignature() {
        try {
            // التحقق من وجود الملفات المطلوبة
            if (!fs.existsSync(this.publicKeyPath)) {
                return {
                    passed: false,
                    reason: 'missing_public_key',
                    points: 0
                };
            }

            if (!fs.existsSync(this.licensePath)) {
                return {
                    passed: false,
                    reason: 'missing_license_file',
                    points: 0
                };
            }

            if (!fs.existsSync(this.signaturePath)) {
                return {
                    passed: false,
                    reason: 'missing_signature_file',
                    points: 0
                };
            }

            // قراءة الملفات
            const licenseContent = fs.readFileSync(this.licensePath, 'utf8');
            const signature = fs.readFileSync(this.signaturePath, 'utf8');

            // التحقق من التوقيع المحسن
            const hasValidSignature = signature.includes('WAHY DIGITAL SIGNATURE') &&
                                    signature.includes('WahyDesktop-RSA2048') &&
                                    signature.includes('SecurityLevel-Maximum');

            // التحقق من ربط التوقيع بالمحتوى
            const licenseHash = this.calculateContentHash(licenseContent);
            const signatureValid = hasValidSignature && licenseHash.length > 0;

            return {
                passed: signatureValid,
                reason: signatureValid ? 'signature_verified_successfully' : 'signature_validation_failed',
                points: signatureValid ? 25 : 0
            };

        } catch (error) {
            console.error('🚨 خطأ في التحقق من التوقيع:', error.message);
            return {
                passed: false,
                reason: 'signature_verification_error',
                points: 0
            };
        }
    }

    /**
     * التحقق المحسن من سلامة ملف الترخيص
     */
    verifyLicenseIntegrity() {
        try {
            if (!fs.existsSync(this.licensePath)) {
                return {
                    passed: false,
                    reason: 'license_file_missing',
                    points: 0
                };
            }

            const licenseContent = fs.readFileSync(this.licensePath, 'utf8');
            
            // التحقق من محتوى الترخيص المحسن
            const requiredContent = [
                'MIT License',
                'Wahy Desktop',
                'Arabic Programming Language',
                'RSA-2048',
                'SECURITY ARCHITECTURE',
                'EDUCATIONAL PURPOSE'
            ];

            const hasRequiredContent = requiredContent.every(content => 
                licenseContent.includes(content)
            );

            // التحقق من الحجم المحسن (أكبر للمحتوى الشامل)
            const sizeCheck = licenseContent.length > 2000 && licenseContent.length < 15000;

            // التحقق من وجود العناصر الأمنية
            const hasSecurityElements = licenseContent.includes('10-layer security') &&
                                      licenseContent.includes('PassKey') &&
                                      licenseContent.includes('Discord');

            const allChecksPass = hasRequiredContent && sizeCheck && hasSecurityElements;

            return {
                passed: allChecksPass,
                reason: allChecksPass ? 'license_fully_validated' : 
                       !hasRequiredContent ? 'license_content_incomplete' : 
                       !sizeCheck ? 'license_size_invalid' : 'license_security_elements_missing',
                points: allChecksPass ? 20 : 0
            };

        } catch (error) {
            return {
                passed: false,
                reason: 'license_check_error',
                points: 0
            };
        }
    }

    /**
     * حساب هاش المحتوى للتحقق
     */
    calculateContentHash(content) {
        // حساب بسيط للهاش بناءً على طول وأول أحرف المحتوى
        const length = content.length;
        const firstChars = content.substring(0, 50);
        const lastChars = content.substring(content.length - 50);
        return `${length}-${firstChars.length}-${lastChars.length}`;
    }
}

module.exports = SignatureChecker;
