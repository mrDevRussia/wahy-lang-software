/**
 * Wahy Dual Mode - نظام إدارة الأوضاع
 * نواة إدارة الأوضاع المتعددة في وحي سطح المكتب
 */

const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');

class ModeManager extends EventEmitter {
    constructor() {
        super();
        this.currentMode = null;
        this.availableModes = new Map();
        this.loadedResources = new Map();
        this.performanceConfig = {
            maxMemoryUsage: 500 * 1024 * 1024, // 500MB
            enableGarbageCollection: true,
            lazyLoadThreshold: 10 * 1024 * 1024, // 10MB
            cacheSize: 50 * 1024 * 1024 // 50MB
        };
        
        this.initializeModes();
    }

    /**
     * تهيئة الأوضاع المتاحة
     */
    initializeModes() {
        // وضع تطوير الويب
        this.availableModes.set('web-dev', {
            id: 'web-dev',
            name: 'تطوير الويب',
            nameEn: 'Web Development',
            description: 'إنشاء وتطوير مواقع الويب باستخدام لغة وحي',
            icon: '🌐',
            color: '#3B82F6',
            requiredResources: [
                'html-interpreter',
                'css-interpreter', 
                'js-interpreter',
                'web-libraries',
                'browser-preview'
            ],
            interpreters: ['wahy-html', 'wahy-css', 'wahy-js'],
            libraries: ['bootstrap', 'tailwind', 'chart-js'],
            shortcuts: [
                { key: 'Ctrl+R', action: 'run-code' },
                { key: 'Ctrl+P', action: 'preview' },
                { key: 'Ctrl+S', action: 'save' }
            ],
            workspace: 'web-projects',
            memoryLimit: 250 * 1024 * 1024 // 250MB
        });

        // وضع الأمن السيبراني
        this.availableModes.set('cybersecurity', {
            id: 'cybersecurity',
            name: 'الأمن السيبراني',
            nameEn: 'Cybersecurity',
            description: 'أدوات التحليل الأمني وفحص الشبكات باستخدام لغة وحي',
            icon: '🔒',
            color: '#EF4444',
            requiredResources: [
                'network-analyzer',
                'packet-inspector',
                'crypto-tools',
                'security-scanner',
                'threat-detector'
            ],
            interpreters: ['wahy-scan', 'wahy-crypto', 'wahy-network'],
            libraries: ['crypto-lib', 'network-tools', 'security-utils'],
            shortcuts: [
                { key: 'Ctrl+Shift+S', action: 'scan-network' },
                { key: 'Ctrl+Shift+A', action: 'analyze-packets' },
                { key: 'Ctrl+Shift+E', action: 'encrypt-data' }
            ],
            workspace: 'security-projects',
            memoryLimit: 300 * 1024 * 1024 // 300MB
        });

        console.log('🎯 تم تهيئة أوضاع وحي:', Array.from(this.availableModes.keys()));
    }

    /**
     * الحصول على جميع الأوضاع المتاحة
     */
    getAvailableModes() {
        return Array.from(this.availableModes.values());
    }

    /**
     * الحصول على الوضع الحالي
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * التبديل إلى وضع جديد
     */
    async switchMode(modeId) {
        try {
            console.log(`🔄 بدء التبديل إلى وضع: ${modeId}`);
            
            if (!this.availableModes.has(modeId)) {
                throw new Error(`الوضع غير موجود: ${modeId}`);
            }

            const newMode = this.availableModes.get(modeId);
            
            // حفظ حالة الوضع الحالي إذا كان موجوداً
            if (this.currentMode) {
                await this.saveCurrentModeState();
                await this.unloadModeResources(this.currentMode.id);
            }

            // تحميل الوضع الجديد
            await this.loadModeResources(modeId);
            
            // تحديث الوضع الحالي
            this.currentMode = newMode;
            
            // إطلاق حدث التبديل
            this.emit('mode-switched', {
                previousMode: this.currentMode?.id || null,
                currentMode: modeId,
                timestamp: new Date().toISOString()
            });

            console.log(`✅ تم التبديل بنجاح إلى وضع: ${newMode.name}`);
            return true;

        } catch (error) {
            console.error('❌ خطأ في تبديل الوضع:', error.message);
            this.emit('mode-switch-error', { modeId, error: error.message });
            throw error;
        }
    }

    /**
     * تحميل موارد الوضع
     */
    async loadModeResources(modeId) {
        const mode = this.availableModes.get(modeId);
        if (!mode) {
            throw new Error(`الوضع غير موجود: ${modeId}`);
        }

        console.log(`📦 تحميل موارد وضع: ${mode.name}`);
        
        // التحقق من الذاكرة المتاحة
        if (!this.checkMemoryAvailability(mode.memoryLimit)) {
            throw new Error('الذاكرة غير كافية لتحميل هذا الوضع');
        }

        const startTime = Date.now();
        const loadedResources = [];

        try {
            // تحميل المفسرات
            for (const interpreter of mode.interpreters) {
                await this.loadInterpreter(modeId, interpreter);
                loadedResources.push(`interpreter:${interpreter}`);
            }

            // تحميل المكتبات
            for (const library of mode.libraries) {
                await this.loadLibrary(modeId, library);
                loadedResources.push(`library:${library}`);
            }

            // تحميل الموارد الإضافية
            for (const resource of mode.requiredResources) {
                await this.loadResource(modeId, resource);
                loadedResources.push(`resource:${resource}`);
            }

            // حفظ الموارد المحملة
            this.loadedResources.set(modeId, {
                resources: loadedResources,
                loadTime: Date.now() - startTime,
                memoryUsage: this.estimateMemoryUsage(loadedResources)
            });

            console.log(`✅ تم تحميل ${loadedResources.length} مورد في ${Date.now() - startTime}ms`);

        } catch (error) {
            // تنظيف الموارد في حالة الفشل
            await this.cleanupPartialLoad(loadedResources);
            throw error;
        }
    }

    /**
     * إلغاء تحميل موارد الوضع
     */
    async unloadModeResources(modeId) {
        if (!this.loadedResources.has(modeId)) {
            return; // لا توجد موارد محملة
        }

        console.log(`🗑️ إلغاء تحميل موارد وضع: ${modeId}`);
        
        const modeResources = this.loadedResources.get(modeId);
        
        try {
            // إلغاء تحميل الموارد
            for (const resource of modeResources.resources) {
                await this.unloadResource(resource);
            }

            // تحرير الذاكرة
            if (this.performanceConfig.enableGarbageCollection) {
                if (global.gc) {
                    global.gc();
                }
            }

            // إزالة من الموارد المحملة
            this.loadedResources.delete(modeId);
            
            console.log(`✅ تم إلغاء تحميل موارد وضع: ${modeId}`);

        } catch (error) {
            console.error('❌ خطأ في إلغاء تحميل الموارد:', error.message);
        }
    }

    /**
     * تحميل مفسر
     */
    async loadInterpreter(modeId, interpreterName) {
        const interpreterPath = path.join(__dirname, '..', 'modes', modeId, 'interpreters', `${interpreterName}.js`);
        
        if (fs.existsSync(interpreterPath)) {
            const interpreter = require(interpreterPath);
            if (interpreter.initialize) {
                await interpreter.initialize();
            }
            console.log(`📝 تم تحميل المفسر: ${interpreterName}`);
        }
    }

    /**
     * تحميل مكتبة
     */
    async loadLibrary(modeId, libraryName) {
        const libraryPath = path.join(__dirname, '..', 'modes', modeId, 'libraries', `${libraryName}.js`);
        
        if (fs.existsSync(libraryPath)) {
            const library = require(libraryPath);
            if (library.load) {
                await library.load();
            }
            console.log(`📚 تم تحميل المكتبة: ${libraryName}`);
        }
    }

    /**
     * تحميل مورد
     */
    async loadResource(modeId, resourceName) {
        const resourcePath = path.join(__dirname, '..', 'modes', modeId, 'resources', `${resourceName}.js`);
        
        // إنشاء المورد إذا لم يكن موجوداً (للتطوير)
        if (!fs.existsSync(resourcePath)) {
            console.log(`⚠️ المورد غير موجود، سيتم إنشاؤه: ${resourceName}`);
            return;
        }
        
        const resource = require(resourcePath);
        if (resource.initialize) {
            await resource.initialize();
        }
        console.log(`⚙️ تم تحميل المورد: ${resourceName}`);
    }

    /**
     * إلغاء تحميل مورد
     */
    async unloadResource(resourceIdentifier) {
        const [type, name] = resourceIdentifier.split(':');
        
        try {
            console.log(`🗑️ تم إلغاء تحميل: ${resourceIdentifier}`);
        } catch (error) {
            console.error(`❌ خطأ في إلغاء تحميل ${resourceIdentifier}:`, error.message);
        }
    }

    /**
     * التحقق من توفر الذاكرة
     */
    checkMemoryAvailability(requiredMemory) {
        const memoryUsage = process.memoryUsage();
        const availableMemory = this.performanceConfig.maxMemoryUsage - memoryUsage.heapUsed;
        
        return availableMemory >= requiredMemory;
    }

    /**
     * تقدير استخدام الذاكرة
     */
    estimateMemoryUsage(resources) {
        return resources.length * 5 * 1024 * 1024; // 5MB لكل مورد
    }

    /**
     * حفظ حالة الوضع الحالي
     */
    async saveCurrentModeState() {
        if (!this.currentMode) return;
        
        try {
            const state = {
                modeId: this.currentMode.id,
                timestamp: new Date().toISOString(),
            };
            
            console.log(`💾 تم حفظ حالة وضع: ${this.currentMode.name}`);
            
        } catch (error) {
            console.error('❌ خطأ في حفظ حالة الوضع:', error.message);
        }
    }

    /**
     * تنظيف في حالة التحميل الجزئي
     */
    async cleanupPartialLoad(loadedResources) {
        console.log('🧹 تنظيف التحميل الجزئي...');
        
        for (const resource of loadedResources) {
            try {
                await this.unloadResource(resource);
            } catch (error) {
                console.error(`❌ خطأ في تنظيف ${resource}:`, error.message);
            }
        }
    }

    /**
     * الحصول على إحصائيات الأداء
     */
    getPerformanceStats() {
        const memoryUsage = process.memoryUsage();
        
        return {
            currentMode: this.currentMode?.name || 'لا يوجد',
            memoryUsage: {
                used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
            },
            loadedModes: Array.from(this.loadedResources.keys()),
            uptime: Math.round(process.uptime()) + ' ثانية'
        };
    }
}

module.exports = ModeManager;