# 🛡️ نظام الحماية المتقدم - Wahy Desktop

## 📋 نظرة عامة

نظام حماية متطور ومتعدد الطبقات مصمم لحماية تطبيق Wahy Desktop من التلاعب والاستخدام غير المصرح به، مع الحفاظ على الطبيعة مفتوحة المصدر للغة نفسها.

## 🏗️ معمارية النظام

### المكونات الأساسية

```
license-guard/
├── crypto-engine.js          ← محرك التشفير AES-256
├── license-validator.js      ← مدقق التراخيص والتحقق المستمر
├── security-shield.js        ← الدرع الأمني المخفي والمراقبة
├── protection-manager.js     ← المدير المركزي لجميع أنظمة الحماية
├── lockdown-interface.html   ← واجهة تعطيل النظام
├── lockdown-preload.js      ← سكريبت preload للنافذة المقفلة
└── README.md                ← هذا الدليل
```

## 🔐 آلية العمل

### 1. التشفير المتقدم (crypto-engine.js)
- **تشفير AES-256-GCM** مع مفاتيح مشتقة
- **بصمة النظام الفريدة** لربط الترخيص بالجهاز
- **تحقق من سلامة البيانات** باستخدام Checksum
- **حماية من نقل الملفات** بين الأجهزة

### 2. التحقق المستمر (license-validator.js)
- **فحص أولي شامل** عند بدء التشغيل
- **مراقبة دورية** كل 30 ثانية
- **مراقبة تغييرات الملفات** في الوقت الفعلي
- **إنشاء ترخيص افتراضي** للمجتمع

### 3. الدرع الأمني (security-shield.js)
- **فحوصات خفية متعددة** بطرق غير مباشرة
- **مراقبة مستمرة** كل دقيقة و 10 ثواني
- **تقييم نسبة الأمان** الديناميكي
- **قفل طارئ** عند اكتشاف تهديد

### 4. المدير المركزي (protection-manager.js)
- **تنسيق جميع المكونات** الأمنية
- **إدارة دورة حياة الحماية** من التهيئة للتنظيف
- **واجهة موحدة** للتطبيق الرئيسي
- **نافذة قفل احترافية** عند الخرق

## 🔒 مستويات الحماية

### المستوى 1: حماية أساسية
- التحقق من وجود ملف الترخيص
- فحص سلامة الملفات الأساسية
- التحقق من بيئة النظام

### المستوى 2: حماية متقدمة
- تشفير قوي للبيانات الحساسة
- مراقبة تغييرات الملفات
- فحوصات دورية مستمرة

### المستوى 3: حماية عسكرية
- درع أمني مخفي مع فحوصات خفية
- تحليل سلوكي للنظام
- قفل طارئ فوري

## 📁 أنواع التراخيص المدعومة

### ترخيص المجتمع (Community)
```json
{
  "type": "community",
  "features": [
    "basic_editor",
    "html_generation",
    "css_styling", 
    "javascript_basic",
    "file_save_load",
    "export_html"
  ],
  "expiry": null
}
```

### ترخيص احترافي (Professional)
```json
{
  "type": "professional", 
  "features": [
    "all_community_features",
    "advanced_debugging",
    "premium_templates",
    "priority_support",
    "multi_project"
  ],
  "expiry": "2025-12-31"
}
```

## 🚨 حالات التعطيل

### أسباب القفل التلقائي:
1. **license_file_missing** - ملف الترخيص مفقود
2. **license_decryption_failed** - فشل فك التشفير
3. **license_checksum_invalid** - تلف البيانات
4. **license_system_mismatch** - عدم تطابق النظام
5. **license_expired** - انتهاء الصلاحية
6. **critical_file_missing** - ملف أساسي مفقود
7. **security_shield_triggered** - خرق أمني

### واجهة التعطيل:
- **تصميم احترافي** مع تأثيرات بصرية
- **رسائل واضحة** باللغة العربية
- **تعليمات الاستكشاف** خطوة بخطوة
- **منع التجاوز** مع حماية متقدمة

## 🔧 التكامل مع التطبيق

### في main.js:
```javascript
const ProtectionManager = require('./system/license-guard/protection-manager');

async function createMainWindow() {
  protectionManager = new ProtectionManager();
  // ... إنشاء النافذة
  
  mainWindow.once('ready-to-show', async () => {
    const securityValid = await protectionManager.initialize(mainWindow);
    if (securityValid && protectionManager.canSystemRun()) {
      mainWindow.show();
    }
  });
}
```

### حماية IPC Handlers:
```javascript
ipcMain.handle('save-file', async (event, content, filePath) => {
  if (global.fileSaveDisabled || !protectionManager?.canSystemRun()) {
    return { success: false, error: 'تم تعطيل حفظ الملفات لأسباب أمنية' };
  }
  // ... منطق الحفظ
});
```

## 📊 مراقبة النظام

### تسجيل الأحداث:
```
security.log
{"timestamp":"2024-01-20T10:30:00.000Z","reason":"license_validated","fingerprint":"abc123"}
{"timestamp":"2024-01-20T10:31:00.000Z","reason":"periodic_check_passed","fingerprint":"abc123"}
```

### حالة النظام:
```javascript
const status = protectionManager.getSystemStatus();
console.log(status);
// {
//   initialized: true,
//   locked: false,
//   protection: 'active',
//   license: 'valid',
//   security: 'active'
// }
```

## 🛠️ وضع التطوير

### تفعيل وضع التطوير:
```bash
NODE_ENV=development node main.js --dev
```

### مميزات وضع التطوير:
- إمكانية إعادة تشغيل النظام
- تجاوز بعض الفحوصات الأمنية
- رسائل تفصيلية في الكونسول
- إمكانية تعطيل الدرع مؤقتاً

### إعادة تشغيل النظام:
```javascript
// متاح في وضع التطوير فقط
await window.electronAPI.invoke('reset-security-system');
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة:

1. **النظام لا يبدأ**
   - فحص وجود ملفات `system/license-guard/`
   - التأكد من صلاحيات القراءة/الكتابة
   - فحص سجل الأخطاء في الكونسول

2. **واجهة القفل تظهر فوراً**
   - فحص وجود `wahy.lic`
   - التأكد من سلامة ملفات النظام
   - إعادة تثبيت التطبيق

3. **فشل التشفير**
   - فحص دعم Node.js للتشفير
   - التأكد من توافق النظام
   - إعادة إنشاء ملف الترخيص

### أدوات التشخيص:
```javascript
// فحص حالة النظام
const status = await window.electronAPI.invoke('get-system-status');

// إعادة تشغيل (تطوير فقط)  
await window.electronAPI.invoke('reset-security-system');
```

## 🔐 الأمان والخصوصية

### حماية البيانات:
- **تشفير محلي** - لا إرسال بيانات خارجية
- **بصمة النظام** - فقط معلومات الأجهزة الأساسية
- **تسجيل محدود** - فقط أحداث الأمان الضرورية
- **بدون تتبع** - احترام كامل للخصوصية

### المبادئ الأساسية:
1. **الحماية لا تنتهك الخصوصية**
2. **مفتوح المصدر للغة نفسها**
3. **حماية الملكية الفكرية للمحرر**
4. **شفافية كاملة في التطبيق**

## 📞 الدعم والمساعدة

### للمطورين:
- كود مفتوح المصدر
- توثيق شامل
- أمثلة عملية

### للمستخدمين:
- واجهات واضحة بالعربية
- رسائل خطأ مفهومة
- تعليمات استكشاف الأخطاء

---

<div align="center">
  <p><strong>🛡️ نظام حماية Wahy Desktop</strong></p>
  <p><em>حماية متقدمة • أمان عالي • احترام الخصوصية</em></p>
  <p>© 2024 Wahy Language Team - جميع الحقوق محفوظة</p>
</div>