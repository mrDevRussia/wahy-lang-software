/**
 * Wahy Web Dual Mode - مدير الأوضاع المحسن للويب
 * نظام إدارة الأوضاع المتعددة داخل موقع وحي الرسمي
 */

interface WahyWebMode {
  id: 'web-dev' | 'cybersecurity';
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  maxMemory: number; // بالميجابايت
  features: string[];
  interpreters: string[];
  templates: string[];
  estimatedSize: number; // بالكيلوبايت
}

interface ModeResourceUsage {
  modeId: string;
  memoryUsed: number;
  loadTime: number;
  lastAccessed: number;
  isActive: boolean;
}

class WebModeManager {
  private currentMode: WahyWebMode | null = null;
  private availableModes: Map<string, WahyWebMode> = new Map();
  private loadedResources: Map<string, ModeResourceUsage> = new Map();
  private performanceObserver: PerformanceObserver | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeModes();
    this.setupPerformanceMonitoring();
  }

  /**
   * تهيئة الأوضاع المتاحة للويب
   */
  private initializeModes(): void {
    // وضع تطوير الويب
    this.availableModes.set('web-dev', {
      id: 'web-dev',
      name: 'تطوير الويب',
      nameEn: 'Web Development',
      description: 'أنشئ مواقع ويب جميلة باستخدام HTML وCSS وJavaScript بلغة عربية',
      icon: '🌐',
      color: '#3B82F6',
      maxMemory: 200, // 200MB
      features: [
        'مفسر HTML متقدم',
        'تصميم CSS تفاعلي', 
        'JavaScript ديناميكي',
        'معاينة مباشرة',
        'قوالب جاهزة'
      ],
      interpreters: ['wahy-html', 'wahy-css', 'wahy-js'],
      templates: ['صفحة-بسيطة', 'موقع-شركة', 'مدونة-شخصية'],
      estimatedSize: 800 // 800KB
    });

    // وضع الأمن السيبراني
    this.availableModes.set('cybersecurity', {
      id: 'cybersecurity',
      name: 'الأمن السيبراني',
      nameEn: 'Cybersecurity',
      description: 'تعلم أساسيات الأمن السيبراني من خلال محاكاة آمنة وتعليمية',
      icon: '🔒',
      color: '#EF4444',
      maxMemory: 250, // 250MB
      features: [
        'فحص وهمي للشبكات',
        'تحليل آمن للحزم',
        'محاكاة الثغرات',
        'تقارير أمنية',
        'سيناريوهات تدريبية'
      ],
      interpreters: ['wahy-scan', 'wahy-crypto', 'wahy-analyze'],
      templates: ['فحص-بسيط', 'تقرير-أمني', 'تحليل-شبكة'],
      estimatedSize: 950 // 950KB
    });

    console.log('🎯 تم تهيئة أوضاع الويب:', Array.from(this.availableModes.keys()));
  }

  /**
   * إعداد مراقبة الأداء
   */
  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            console.log(`⚡ قياس الأداء: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  /**
   * الحصول على جميع الأوضاع المتاحة
   */
  getAvailableModes(): WahyWebMode[] {
    return Array.from(this.availableModes.values());
  }

  /**
   * الحصول على الوضع الحالي
   */
  getCurrentMode(): WahyWebMode | null {
    return this.currentMode;
  }

  /**
   * التبديل إلى وضع جديد
   */
  async switchMode(modeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const startTime = performance.now();
      performance.mark('mode-switch-start');

      // التحقق من وجود الوضع
      const newMode = this.availableModes.get(modeId);
      if (!newMode) {
        throw new Error(`الوضع غير موجود: ${modeId}`);
      }

      // التحقق من توفر الذاكرة
      if (!this.checkMemoryAvailability(newMode.maxMemory)) {
        throw new Error(`الذاكرة غير كافية. مطلوب: ${newMode.maxMemory}MB`);
      }

      // إلغاء تحميل الوضع الحالي إذا كان موجوداً
      if (this.currentMode && this.currentMode.id !== modeId) {
        await this.unloadMode(this.currentMode.id);
      }

      // تحميل الوضع الجديد
      await this.loadMode(modeId);
      
      // تحديث الوضع الحالي
      this.currentMode = newMode;

      // قياس وقت التبديل
      performance.mark('mode-switch-end');
      performance.measure('mode-switch-duration', 'mode-switch-start', 'mode-switch-end');
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // تحديث إحصائيات الاستخدام
      this.updateResourceUsage(modeId, loadTime);

      // إشعار المستمعين
      this.emit('mode-switched', {
        modeId,
        mode: newMode,
        loadTime,
        timestamp: Date.now()
      });

      console.log(`✅ تم التبديل بنجاح إلى وضع: ${newMode.name} في ${loadTime.toFixed(2)}ms`);
      
      return { success: true };

    } catch (error) {
      console.error('❌ خطأ في تبديل الوضع:', error);
      
      this.emit('mode-switch-error', {
        modeId,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في تبديل الوضع'
      };
    }
  }

  /**
   * تحميل موارد الوضع (تحميل كسول)
   */
  private async loadMode(modeId: string): Promise<void> {
    const mode = this.availableModes.get(modeId);
    if (!mode) throw new Error(`الوضع غير موجود: ${modeId}`);

    console.log(`📦 تحميل موارد وضع: ${mode.name}`);

    // محاكاة تحميل الموارد
    const resources = [
      `modes/${modeId}/components`,
      `modes/${modeId}/interpreters`, 
      `modes/${modeId}/templates`
    ];

    for (const resource of resources) {
      // محاكاة زمن التحميل
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      console.log(`  ✅ تم تحميل: ${resource}`);
    }

    // تسجيل استخدام الموارد
    this.loadedResources.set(modeId, {
      modeId,
      memoryUsed: this.estimateMemoryUsage(mode),
      loadTime: 0, // سيتم تحديثه لاحقاً
      lastAccessed: Date.now(),
      isActive: true
    });
  }

  /**
   * إلغاء تحميل موارد الوضع
   */
  private async unloadMode(modeId: string): Promise<void> {
    console.log(`🗑️ إلغاء تحميل موارد وضع: ${modeId}`);
    
    // تحديث حالة الموارد
    const resource = this.loadedResources.get(modeId);
    if (resource) {
      resource.isActive = false;
      resource.lastAccessed = Date.now();
    }

    // تنظيف الذاكرة
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // تحرير الموارد
    this.loadedResources.delete(modeId);
    
    console.log(`✅ تم إلغاء تحميل موارد وضع: ${modeId}`);
  }

  /**
   * التحقق من توفر الذاكرة
   */
  private checkMemoryAvailability(requiredMemory: number): boolean {
    // فحص ذاكرة المتصفح
    const memoryInfo = (performance as any).memory;
    
    if (memoryInfo) {
      const usedMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      const totalMemoryMB = memoryInfo.totalJSHeapSize / (1024 * 1024);
      const availableMemory = totalMemoryMB - usedMemoryMB;
      
      console.log(`💾 الذاكرة المستخدمة: ${usedMemoryMB.toFixed(2)}MB من ${totalMemoryMB.toFixed(2)}MB`);
      
      return availableMemory >= requiredMemory;
    }

    return true;
  }

  /**
   * تقدير استخدام الذاكرة للوضع
   */
  private estimateMemoryUsage(mode: WahyWebMode): number {
    let estimated = mode.estimatedSize / 1024;
    estimated += mode.interpreters.length * 10;
    estimated += mode.templates.length * 2;
    
    return Math.min(estimated, mode.maxMemory);
  }

  /**
   * تحديث إحصائيات استخدام الموارد
   */
  private updateResourceUsage(modeId: string, loadTime: number): void {
    const resource = this.loadedResources.get(modeId);
    if (resource) {
      resource.loadTime = loadTime;
      resource.lastAccessed = Date.now();
    }
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getPerformanceStats(): {
    currentMode: string | null;
    memoryUsage: { [key: string]: number };
    loadedModes: string[];
    totalMemoryUsed: number;
    browserMemory?: any;
  } {
    const memoryUsage: { [key: string]: number } = {};
    let totalMemoryUsed = 0;

    this.loadedResources.forEach((resource, modeId) => {
      if (resource.isActive) {
        memoryUsage[modeId] = resource.memoryUsed;
        totalMemoryUsed += resource.memoryUsed;
      }
    });

    return {
      currentMode: this.currentMode?.name || null,
      memoryUsage,
      loadedModes: Array.from(this.loadedResources.keys()).filter(
        modeId => this.loadedResources.get(modeId)?.isActive
      ),
      totalMemoryUsed,
      browserMemory: (performance as any).memory
    };
  }

  /**
   * نظام الأحداث البسيط
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`خطأ في معالج الحدث ${event}:`, error);
        }
      });
    }
  }

  /**
   * تنظيف الموارد عند الإغلاق
   */
  cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.loadedResources.clear();
    this.listeners.clear();
    this.currentMode = null;
    
    console.log('🧹 تم تنظيف مدير الأوضاع');
  }
}

export default WebModeManager;
export type { WahyWebMode, ModeResourceUsage };