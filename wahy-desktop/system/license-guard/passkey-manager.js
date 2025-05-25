/**
 * Wahy Desktop - PassKey Manager
 * مدير مفاتيح الاستعادة الطارئة
 * 
 * يدير نظام PassKey المتقدم مع التكامل مع Discord
 * لإنتاج مفاتيح استعادة عشوائية كل ساعة
 */

const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');

class PassKeyManager {
    constructor() {
        this.currentPassKey = null;
        this.keyGenerationTimer = null;
        this.discordWebhookUrl = null;
        this.keyHistory = new Map();
        
        // إعدادات النظام
        this.keyLength = 28;
        this.keyValidityHours = 1;
        this.maxHistorySize = 24; // حفظ آخر 24 مفتاح
        
        // أحرف وأرقام مسموحة للمفتاح
        this.allowedChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        
        this.initialize();
    }

    /**
     * تهيئة نظام PassKey
     */
    initialize() {
        try {
            // تحميل الإعدادات المحفوظة
            this.loadSettings();
            
            // بدء النظام إذا كان Discord webhook متوفراً
            if (this.discordWebhookUrl) {
                this.startKeyGeneration();
            }
            
            console.log('🔑 تم تهيئة نظام PassKey');
        } catch (error) {
            console.error('❌ فشل في تهيئة نظام PassKey:', error);
        }
    }

    /**
     * تحميل إعدادات النظام
     */
    loadSettings() {
        try {
            const settingsPath = path.join(__dirname, '..', 'passkey-settings.json');
            
            if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                this.discordWebhookUrl = settings.discordWebhookUrl;
                this.keyValidityHours = settings.keyValidityHours || 1;
                
                // تحميل تاريخ المفاتيح المحفوظة
                if (settings.keyHistory) {
                    this.keyHistory = new Map(settings.keyHistory);
                }
            }
        } catch (error) {
            console.log('💡 لم يتم العثور على إعدادات PassKey، سيتم إنشاؤها عند الحاجة');
        }
    }

    /**
     * حفظ إعدادات النظام
     */
    saveSettings() {
        try {
            const settingsPath = path.join(__dirname, '..', 'passkey-settings.json');
            
            const settings = {
                discordWebhookUrl: this.discordWebhookUrl,
                keyValidityHours: this.keyValidityHours,
                keyHistory: Array.from(this.keyHistory.entries()),
                lastUpdate: new Date().toISOString()
            };
            
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        } catch (error) {
            console.error('❌ فشل في حفظ إعدادات PassKey:', error);
        }
    }

    /**
     * تعيين Discord webhook URL
     */
    setDiscordWebhook(webhookUrl) {
        this.discordWebhookUrl = webhookUrl;
        this.saveSettings();
        
        // بدء النظام فوراً
        this.startKeyGeneration();
        
        console.log('✅ تم تعيين Discord webhook وبدء نظام PassKey');
    }

    /**
     * بدء تولید المفاتيح كل ساعة
     */
    startKeyGeneration() {
        if (this.keyGenerationTimer) {
            clearInterval(this.keyGenerationTimer);
        }

        // تولید مفتاح فوري
        this.generateNewPassKey();
        
        // تولید مفتاح جديد كل ساعة
        this.keyGenerationTimer = setInterval(() => {
            this.generateNewPassKey();
        }, this.keyValidityHours * 60 * 60 * 1000); // تحويل الساعات إلى ميلي ثانية
        
        console.log(`🔄 بدء تولید PassKey كل ${this.keyValidityHours} ساعة`);
    }

    /**
     * إيقاف تولید المفاتيح
     */
    stopKeyGeneration() {
        if (this.keyGenerationTimer) {
            clearInterval(this.keyGenerationTimer);
            this.keyGenerationTimer = null;
        }
        
        console.log('⏹️ تم إيقاف تولید PassKey');
    }

    /**
     * تولید مفتاح جديد
     */
    async generateNewPassKey() {
        try {
            // إنشاء مفتاح عشوائی 28 حرف
            const newKey = this.createRandomKey();
            
            // حفظ المفتاح مع الطابع الزمني
            const timestamp = new Date().toISOString();
            const keyData = {
                key: newKey,
                timestamp: timestamp,
                used: false,
                validUntil: new Date(Date.now() + (this.keyValidityHours * 60 * 60 * 1000)).toISOString()
            };
            
            // إضافة إلى التاريخ
            this.keyHistory.set(newKey, keyData);
            this.currentPassKey = newKey;
            
            // تنظيف المفاتيح القديمة
            this.cleanupOldKeys();
            
            // إرسال إلى Discord
            await this.sendKeyToDiscord(keyData);
            
            // حفظ الإعدادات
            this.saveSettings();
            
            console.log(`🔑 تم تولید PassKey جديد: ${newKey.substring(0, 8)}...`);
            
        } catch (error) {
            console.error('❌ فشل في تولید PassKey:', error);
        }
    }

    /**
     * إنشاء مفتاح عشوائی
     */
    createRandomKey() {
        let key = '';
        
        for (let i = 0; i < this.keyLength; i++) {
            const randomIndex = crypto.randomInt(0, this.allowedChars.length);
            key += this.allowedChars[randomIndex];
        }
        
        // إضافة checksum للتحقق من صحة المفتاح
        const checksum = crypto.createHash('md5')
            .update(key + 'wahy_passkey_salt')
            .digest('hex')
            .substring(0, 4)
            .toUpperCase();
        
        return key + '-' + checksum;
    }

    /**
     * تنظيف المفاتيح القديمة
     */
    cleanupOldKeys() {
        const now = new Date();
        const keysToDelete = [];
        
        for (const [key, data] of this.keyHistory.entries()) {
            const keyAge = now - new Date(data.timestamp);
            const maxAge = this.maxHistorySize * 60 * 60 * 1000; // 24 ساعة بالميلي ثانية
            
            if (keyAge > maxAge) {
                keysToDelete.push(key);
            }
        }
        
        // حذف المفاتيح القديمة
        keysToDelete.forEach(key => {
            this.keyHistory.delete(key);
        });
        
        if (keysToDelete.length > 0) {
            console.log(`🧹 تم حذف ${keysToDelete.length} مفتاح قديم`);
        }
    }

    /**
     * إرسال المفتاح إلى Discord
     */
    async sendKeyToDiscord(keyData) {
        if (!this.discordWebhookUrl) {
            console.log('⚠️ Discord webhook غير مكوّن');
            return;
        }

        try {
            const embed = {
                title: '🔑 Wahy Desktop - PassKey جديد',
                description: 'تم إنتاج مفتاح استعادة جديد لنظام Wahy Desktop',
                color: 0x00AE86,
                fields: [
                    {
                        name: '🔐 PassKey',
                        value: `\`\`\`${keyData.key}\`\`\``,
                        inline: false
                    },
                    {
                        name: '⏰ صالح حتى',
                        value: keyData.validUntil,
                        inline: true
                    },
                    {
                        name: '🕒 وقت الإنتاج',
                        value: keyData.timestamp,
                        inline: true
                    }
                ],
                footer: {
                    text: 'Wahy Desktop Security System',
                    icon_url: 'https://example.com/wahy-icon.png'
                },
                timestamp: keyData.timestamp
            };

            const payload = {
                username: 'Wahy Security Bot',
                embeds: [embed]
            };

            await this.sendWebhookRequest(payload);
            console.log('✅ تم إرسال PassKey إلى Discord');

        } catch (error) {
            console.error('❌ فشل في إرسال PassKey إلى Discord:', error);
        }
    }

    /**
     * إرسال طلب webhook
     */
    sendWebhookRequest(payload) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);
            const url = new URL(this.discordWebhookUrl);
            
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data),
                    'User-Agent': 'Wahy-Desktop-Security/1.0'
                }
            };

            const req = https.request(options, (res) => {
                let responseBody = '';
                
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(responseBody);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${responseBody}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    /**
     * التحقق من صحة PassKey
     */
    validatePassKey(inputKey) {
        try {
            // التحقق من التنسيق
            if (!inputKey || inputKey.length !== (this.keyLength + 5)) { // 28 + "-" + 4 checksum
                return { valid: false, reason: 'تنسيق المفتاح غير صحيح' };
            }

            const parts = inputKey.split('-');
            if (parts.length !== 2) {
                return { valid: false, reason: 'تنسيق المفتاح غير صحيح' };
            }

            const [key, checksum] = parts;

            // التحقق من checksum
            const expectedChecksum = crypto.createHash('md5')
                .update(key + 'wahy_passkey_salt')
                .digest('hex')
                .substring(0, 4)
                .toUpperCase();

            if (checksum !== expectedChecksum) {
                return { valid: false, reason: 'checksum غير صحيح' };
            }

            // البحث في تاريخ المفاتيح
            const keyData = this.keyHistory.get(inputKey);
            
            if (!keyData) {
                return { valid: false, reason: 'مفتاح غير موجود أو منتهي الصلاحية' };
            }

            // التحقق من انتهاء الصلاحية
            const now = new Date();
            const validUntil = new Date(keyData.validUntil);
            
            if (now > validUntil) {
                return { valid: false, reason: 'المفتاح منتهي الصلاحية' };
            }

            // التحقق من عدم الاستخدام المسبق
            if (keyData.used) {
                return { valid: false, reason: 'المفتاح مُستخدم مسبقاً' };
            }

            // تحديد المفتاح كمُستخدم
            keyData.used = true;
            keyData.usedAt = new Date().toISOString();
            this.saveSettings();

            return { 
                valid: true, 
                keyData: keyData,
                message: 'تم قبول المفتاح بنجاح' 
            };

        } catch (error) {
            console.error('❌ خطأ في التحقق من PassKey:', error);
            return { valid: false, reason: 'خطأ في النظام' };
        }
    }

    /**
     * الحصول على معلومات النظام
     */
    getSystemInfo() {
        return {
            active: !!this.discordWebhookUrl,
            currentKey: this.currentPassKey ? this.currentPassKey.substring(0, 8) + '...' : null,
            keyHistory: this.keyHistory.size,
            keyValidityHours: this.keyValidityHours,
            nextKeyGeneration: this.keyGenerationTimer ? 
                new Date(Date.now() + (this.keyValidityHours * 60 * 60 * 1000)).toISOString() : null
        };
    }

    /**
     * تنظيف الموارد
     */
    cleanup() {
        this.stopKeyGeneration();
        this.saveSettings();
        console.log('🧹 تم تنظيف موارد PassKey Manager');
    }
}

module.exports = PassKeyManager;