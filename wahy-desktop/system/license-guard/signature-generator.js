/**
 * Wahy Desktop - Digital Signature Generator
 * مولد التوقيع الرقمي لحماية حقوق الملكية الفكرية
 * 
 * يستخدم RSA-2048 مع SHA-256 لتوقيع ملف LICENSE
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SignatureGenerator {
    constructor() {
        this.keySize = 2048;
        this.algorithm = 'rsa';
        this.hashAlgorithm = 'sha256';
        this.keysDir = path.join(__dirname, '..', 'keys');
        this.privateKeyPath = path.join(this.keysDir, 'wahy-private.pem');
        this.publicKeyPath = path.join(this.keysDir, 'wahy-public.pem');
        
        // تشفير المفتاح الخاص
        this.passphrase = this._generatePassphrase();
        
        this.ensureKeysDirectory();
    }

    /**
     * إنشاء مجلد المفاتيح
     */
    ensureKeysDirectory() {
        if (!fs.existsSync(this.keysDir)) {
            fs.mkdirSync(this.keysDir, { recursive: true });
        }
    }

    /**
     * توليد كلمة مرور للمفتاح الخاص
     */
    _generatePassphrase() {
        return crypto.createHash('sha256')
            .update('wahy_digital_signature_2024' + Date.now())
            .digest('hex')
            .substring(0, 32);
    }

    /**
     * إنشاء زوج المفاتيح RSA
     */
    generateKeyPair() {
        try {
            console.log('🔐 إنشاء زوج مفاتيح RSA-2048...');
            
            const { publicKey, privateKey } = crypto.generateKeyPairSync(this.algorithm, {
                modulusLength: this.keySize,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: this.passphrase
                }
            });

            // حفظ المفاتيح
            fs.writeFileSync(this.publicKeyPath, publicKey);
            fs.writeFileSync(this.privateKeyPath, privateKey);
            
            // حماية ملف المفتاح الخاص (قراءة فقط للمالك)
            if (process.platform !== 'win32') {
                fs.chmodSync(this.privateKeyPath, 0o600);
            }

            console.log('✅ تم إنشاء المفاتيح بنجاح');
            console.log(`📁 المفتاح العام: ${this.publicKeyPath}`);
            console.log(`🔒 المفتاح الخاص: ${this.privateKeyPath} (مشفر)`);
            
            return { publicKey, privateKey };

        } catch (error) {
            console.error('❌ فشل في إنشاء المفاتيح:', error);
            throw error;
        }
    }

    /**
     * قراءة المفاتيح من الملفات
     */
    loadKeys() {
        try {
            if (!fs.existsSync(this.publicKeyPath) || !fs.existsSync(this.privateKeyPath)) {
                console.log('🔑 المفاتيح غير موجودة، سيتم إنشاؤها...');
                return this.generateKeyPair();
            }

            const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
            const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');

            return { publicKey, privateKey };

        } catch (error) {
            console.error('❌ فشل في قراءة المفاتيح:', error);
            throw error;
        }
    }

    /**
     * توقيع ملف LICENSE
     */
    signLicenseFile() {
        try {
            const licensePath = path.join(__dirname, '..', '..', 'LICENSE');
            const signaturePath = path.join(__dirname, '..', '..', 'LICENSE.sig');

            // التحقق من وجود ملف LICENSE
            if (!fs.existsSync(licensePath)) {
                throw new Error('ملف LICENSE غير موجود');
            }

            // قراءة محتوى الملف
            const licenseContent = fs.readFileSync(licensePath, 'utf8');
            console.log(`📄 قراءة ملف LICENSE (${licenseContent.length} حرف)`);

            // تحميل المفاتيح
            const { privateKey } = this.loadKeys();

            // إنشاء التوقيع
            const sign = crypto.createSign(this.hashAlgorithm);
            sign.update(licenseContent);
            sign.end();

            const signature = sign.sign({
                key: privateKey,
                passphrase: this.passphrase
            }, 'base64');

            // إنشاء ملف التوقيع مع معلومات إضافية
            const signatureData = {
                signature: signature,
                algorithm: this.algorithm + '-' + this.hashAlgorithm,
                keySize: this.keySize,
                timestamp: new Date().toISOString(),
                fileHash: crypto.createHash(this.hashAlgorithm).update(licenseContent).digest('hex'),
                version: '1.0.0',
                signer: 'Wahy Language Team'
            };

            // حفظ التوقيع
            fs.writeFileSync(signaturePath, JSON.stringify(signatureData, null, 2));

            console.log('✅ تم توقيع ملف LICENSE بنجاح');
            console.log(`📝 ملف التوقيع: ${signaturePath}`);
            console.log(`🔢 التوقيع: ${signature.substring(0, 32)}...`);

            return signatureData;

        } catch (error) {
            console.error('❌ فشل في توقيع ملف LICENSE:', error);
            throw error;
        }
    }

    /**
     * التحقق من التوقيع
     */
    verifyLicenseSignature() {
        try {
            const licensePath = path.join(__dirname, '..', '..', 'LICENSE');
            const signaturePath = path.join(__dirname, '..', '..', 'LICENSE.sig');

            // التحقق من وجود الملفات
            if (!fs.existsSync(licensePath)) {
                return { valid: false, reason: 'license_file_missing' };
            }

            if (!fs.existsSync(signaturePath)) {
                return { valid: false, reason: 'signature_file_missing' };
            }

            // قراءة الملفات
            const licenseContent = fs.readFileSync(licensePath, 'utf8');
            const signatureData = JSON.parse(fs.readFileSync(signaturePath, 'utf8'));

            // تحميل المفتاح العام
            const { publicKey } = this.loadKeys();

            // التحقق من hash الملف
            const currentHash = crypto.createHash(this.hashAlgorithm).update(licenseContent).digest('hex');
            if (currentHash !== signatureData.fileHash) {
                return { valid: false, reason: 'license_file_modified' };
            }

            // التحقق من التوقيع
            const verify = crypto.createVerify(this.hashAlgorithm);
            verify.update(licenseContent);
            verify.end();

            const isValid = verify.verify(publicKey, signatureData.signature, 'base64');

            if (isValid) {
                return { 
                    valid: true, 
                    reason: 'signature_valid',
                    signatureInfo: {
                        algorithm: signatureData.algorithm,
                        timestamp: signatureData.timestamp,
                        signer: signatureData.signer
                    }
                };
            } else {
                return { valid: false, reason: 'signature_invalid' };
            }

        } catch (error) {
            console.error('❌ خطأ في التحقق من التوقيع:', error);
            return { valid: false, reason: 'verification_error', error: error.message };
        }
    }

    /**
     * إنشاء ملف LICENSE إذا لم يكن موجوداً
     */
    createDefaultLicense() {
        const licensePath = path.join(__dirname, '..', '..', 'LICENSE');
        
        if (fs.existsSync(licensePath)) {
            console.log('✅ ملف LICENSE موجود بالفعل');
            return;
        }

        const licenseContent = `MIT License

Copyright (c) 2024 Wahy Language Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

تم تطوير هذا البرنامج بواسطة فريق لغة وحي لتمكين المطورين العرب من البرمجة بلغتهم الأم.
جميع الحقوق محفوظة © 2024 فريق لغة وحي

هذا البرنامج مجاني ومفتوح المصدر تحت ترخيص MIT.
يُسمح بالاستخدام والتعديل والتوزيع مع ضرورة الاحتفاظ بحقوق المؤلف.
`;

        fs.writeFileSync(licensePath, licenseContent);
        console.log('✅ تم إنشاء ملف LICENSE');
    }

    /**
     * إعداد النظام الكامل
     */
    setupDigitalSignature() {
        try {
            console.log('🚀 إعداد نظام التوقيع الرقمي...');
            
            // إنشاء ملف LICENSE إذا لم يكن موجوداً
            this.createDefaultLicense();
            
            // إنشاء المفاتيح
            this.loadKeys();
            
            // توقيع الملف
            const signatureData = this.signLicenseFile();
            
            // التحقق من التوقيع
            const verification = this.verifyLicenseSignature();
            
            console.log('✅ تم إعداد نظام التوقيع الرقمي بنجاح');
            console.log('🔐 التحقق من التوقيع:', verification.valid ? '✅ صحيح' : '❌ غير صحيح');
            
            return verification.valid;

        } catch (error) {
            console.error('❌ فشل في إعداد نظام التوقيع الرقمي:', error);
            return false;
        }
    }
}

// استخدام مباشر للإعداد
if (require.main === module) {
    const generator = new SignatureGenerator();
    generator.setupDigitalSignature();
}

module.exports = SignatureGenerator;