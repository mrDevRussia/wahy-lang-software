/**
 * Wahy Desktop - Digital Signature Verification System
 * نظام التحقق من التوقيع الرقمي لوحي Desktop
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SignatureChecker {
    constructor() {
        this.publicKeyPath = path.join(__dirname, '../keys/public.pem');
        this.licensePath = path.join(__dirname, '../../LICENSE');
        this.signaturePath = path.join(__dirname, '../../LICENSE.sig');
    }

    /**
     * التحقق من التوقيع الرقمي للترخيص
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
            const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
            const licenseContent = fs.readFileSync(this.licensePath, 'utf8');
            const signature = fs.readFileSync(this.signaturePath, 'utf8');

            // التحقق من التوقيع
            const verifier = crypto.createVerify('SHA256');
            verifier.update(licenseContent);
            verifier.end();

            const isValid = verifier.verify(publicKey, signature, 'base64');

            return {
                passed: isValid,
                reason: isValid ? 'signature_valid' : 'signature_invalid',
                points: isValid ? 25 : 0
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
     * التحقق من سلامة ملف الترخيص
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
            
            // التحقق من محتوى الترخيص الأساسي
            const requiredContent = [
                'MIT License',
                'Wahy Desktop',
                'Arabic Programming Language'
            ];

            const hasRequiredContent = requiredContent.every(content => 
                licenseContent.includes(content)
            );

            // التحقق من الحجم المناسب
            const sizeCheck = licenseContent.length > 500 && licenseContent.length < 5000;

            return {
                passed: hasRequiredContent && sizeCheck,
                reason: hasRequiredContent && sizeCheck ? 'license_valid' : 
                       !hasRequiredContent ? 'license_content_invalid' : 'license_size_invalid',
                points: hasRequiredContent && sizeCheck ? 15 : 0
            };

        } catch (error) {
            return {
                passed: false,
                reason: 'license_check_error',
                points: 0
            };
        }
    }
}

module.exports = SignatureChecker;
