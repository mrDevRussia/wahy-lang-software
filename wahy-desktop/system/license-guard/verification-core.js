/**
 * Wahy Desktop - Enhanced Security Verification Core
 * نواة التحقق الأمني المحسنة لوحي Desktop
 */

const fs = require('fs');
const path = require('path');

class VerificationCore {
    constructor() {
        this.requiredScore = 70;
        this.maxScore = 100;
    }

    /**
     * التحقق الشامل المحسن من جميع مكونات الأمان
     */
    verify() {
        try {
            console.log('🔒 بدء فحص الأمان الشامل...');
            
            const checks = {
                license_check: this.verifyLicense(),
                system_files: this.verifySystemFiles(),
                project_integrity: this.verifyProjectIntegrity(),
                environment: this.verifyEnvironment(),
                digital_signature: this.verifyDigitalSignature(),
                license_signature: this.verifyLicenseSignature()
            };

            // حساب النقاط الإجمالية
            let totalScore = 0;
            Object.keys(checks).forEach(check => {
                if (checks[check].points !== undefined) {
                    totalScore += checks[check].points;
                }
            });

            // التحقق من النجاح العام
            const success = totalScore >= this.requiredScore;
            
            if (!success) {
                console.log('🚨 تنبيه أمني: validation_failed');
            }

            return {
                success,
                score: totalScore,
                details: checks,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ خطأ في نظام التحقق:', error.message);
            return {
                success: false,
                score: 0,
                details: {},
                error: error.message
            };
        }
    }

    /**
     * فحص محسن لملف الترخيص
     */
    verifyLicense() {
        try {
            const licensePath = path.join(__dirname, '../../LICENSE');
            
            if (!fs.existsSync(licensePath)) {
                return { passed: false, reason: 'license_file_missing', points: 0 };
            }

            const content = fs.readFileSync(licensePath, 'utf8');
            
            // فحوصات محسنة ومتعددة
            const requiredElements = [
                'MIT License',
                'Wahy Desktop',
                'Arabic Programming Language',
                'SECURITY ARCHITECTURE',
                'RSA-2048',
                'PassKey',
                'Discord'
            ];

            const hasAllElements = requiredElements.every(element => 
                content.includes(element)
            );

            const sizeCheck = content.length > 2000 && content.length < 15000;
            const hasProjectDetails = content.includes('PROJECT DETAILS');
            const hasEducationalPurpose = content.includes('EDUCATIONAL PURPOSE');

            const allChecksPass = hasAllElements && sizeCheck && hasProjectDetails && hasEducationalPurpose;

            return {
                passed: allChecksPass,
                reason: allChecksPass ? 'license_fully_compliant' : 'license_requirements_not_met',
                points: allChecksPass ? 20 : 0
            };

        } catch (error) {
            return { passed: false, reason: 'license_check_error', points: 0 };
        }
    }

    /**
     * فحص محسن لملفات النظام
     */
    verifySystemFiles() {
        try {
            const requiredFiles = [
                'system/license-guard/protection-manager.js',
                'system/license-guard/verification-core.js',
                'system/license-guard/signature-checker.js',
                'system/license-guard/passkey-manager.js',
                'system/keys/public.pem',
                'system/keys/wahy.key',
                'system/config/security.json'
            ];

            const allFilesExist = requiredFiles.every(file => 
                fs.existsSync(path.join(__dirname, '../..', file))
            );

            return {
                passed: allFilesExist,
                reason: allFilesExist ? 'all_system_files_present' : 'missing_system_files',
                points: allFilesExist ? 15 : 0
            };

        } catch (error) {
            return { passed: false, reason: 'system_files_check_error', points: 0 };
        }
    }

    /**
     * فحص سلامة المشروع المحسن
     */
    verifyProjectIntegrity() {
        try {
            const coreFiles = [
                'main.js',
                'renderer.js', 
                'preload.js',
                'wahy-interpreter.js',
                'package.json'
            ];

            const filesExist = coreFiles.every(file => 
                fs.existsSync(path.join(__dirname, '../..', file))
            );

            // فحص إضافي لملف package.json
            let packageValid = false;
            try {
                const packagePath = path.join(__dirname, '../../package.json');
                const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                packageValid = packageContent.name && packageContent.name.includes('wahy');
            } catch (e) {
                packageValid = false;
            }

            const integrityCheck = filesExist && packageValid;

            return {
                passed: integrityCheck,
                reason: integrityCheck ? 'project_integrity_verified' : 'project_integrity_compromised',
                points: integrityCheck ? 15 : 0
            };

        } catch (error) {
            return { passed: false, reason: 'integrity_check_error', points: 0 };
        }
    }

    /**
     * فحص بيئة التشغيل المحسن
     */
    verifyEnvironment() {
        try {
            // فحوصات بيئة محسنة
            const nodeVersion = process.version;
            const platform = process.platform;
            const hasRequiredModules = this.checkRequiredModules();

            const envCheck = nodeVersion && platform && hasRequiredModules;

            return {
                passed: envCheck,
                reason: envCheck ? 'environment_optimal' : 'environment_issues_detected',
                points: envCheck ? 15 : 0
            };

        } catch (error) {
            return { passed: false, reason: 'environment_check_error', points: 0 };
        }
    }

    /**
     * فحص التوقيع الرقمي المحسن
     */
    verifyDigitalSignature() {
        try {
            const publicKeyPath = path.join(__dirname, '../keys/public.pem');
            
            if (!fs.existsSync(publicKeyPath)) {
                return { passed: false, reason: 'public_key_missing', points: 0 };
            }

            const keyContent = fs.readFileSync(publicKeyPath, 'utf8');
            const isValidKey = keyContent.includes('BEGIN PUBLIC KEY') && 
                             keyContent.includes('END PUBLIC KEY') &&
                             keyContent.length > 200;

            return {
                passed: isValidKey,
                reason: isValidKey ? 'digital_signature_system_active' : 'digital_signature_invalid',
                points: isValidKey ? 20 : 0
            };

        } catch (error) {
            return { passed: false, reason: 'digital_signature_error', points: 0 };
        }
    }

    /**
     * فحص توقيع الترخيص المحسن
     */
    verifyLicenseSignature() {
        try {
            const SignatureChecker = require('./signature-checker');
            const checker = new SignatureChecker();
            
            const licenseResult = checker.verifyLicenseIntegrity();
            const signatureResult = checker.verifyLicenseSignature();

            const bothPass = licenseResult.passed && signatureResult.passed;
            const totalPoints = (licenseResult.points || 0) + (signatureResult.points || 0);

            return {
                passed: bothPass,
                reason: bothPass ? 'license_signature_fully_verified' : 'license_signature_validation_failed',
                points: Math.min(totalPoints, 15)  // الحد الأقصى 15 نقطة
            };

        } catch (error) {
            return { passed: false, reason: 'license_signature_check_error', points: 0 };
        }
    }

    /**
     * فحص الوحدات المطلوبة
     */
    checkRequiredModules() {
        try {
            const requiredModules = ['fs', 'path', 'crypto'];
            return requiredModules.every(module => {
                try {
                    require(module);
                    return true;
                } catch (e) {
                    return false;
                }
            });
        } catch (error) {
            return false;
        }
    }
}

module.exports = new VerificationCore();
