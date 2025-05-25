# Wahy Desktop Alpha - محرر لغة وحي لسطح المكتب

<div align="center">
  <h2>أول محرر سطح مكتب للغة البرمجة العربية "وحي"</h2>
  <p>تجربة برمجية عربية أصيلة خارج المتصفح</p>
</div>

## 📖 نظرة عامة

**Wahy Desktop Alpha** هو محرر سطح مكتب متطور للغة البرمجة العربية "وحي"، مصمم خصيصاً لتوفير تجربة برمجية مريحة وقوية للمطورين العرب. يجمع التطبيق بين سهولة الاستخدام والقوة التقنية المتقدمة.

## ✨ المميزات الرئيسية

### 🖥️ واجهة سطح مكتب أصلية
- **تطبيق Electron** مع واجهة React متجاوبة
- **الوضع الداكن والفاتح** للراحة البصرية
- **واجهة عربية كاملة** مع دعم الكتابة من اليمين لليسار
- **قوائم وأدوات متكاملة** لإدارة المشاريع

### 📝 محرر كود متقدم
- **محرر Monaco** بتمييز بناء الجملة
- **ترقيم الأسطر** وإحصائيات الكود
- **البحث والاستبدال** المتقدم
- **الإكمال التلقائي** للأوامر العربية

### ⚡ معالجة فورية
- **مفسر لغة وحي متكامل** يدعم HTML وCSS وJavaScript
- **معاينة مباشرة** للنتائج في نافذة منفصلة
- **وحدة تحكم تفاعلية** لتتبع التنفيذ والأخطاء
- **تشغيل فوري** بضغطة زر

### 💾 إدارة المشاريع
- **حفظ وفتح الملفات** بصيغة .wahy
- **تصدير HTML** جاهز للنشر
- **إدارة المشاريع المتعددة**
- **تتبع التغييرات** والحفظ التلقائي

### 🎨 أدوات التطوير
- **عرض منفصل للأكواد** (HTML, CSS, JavaScript)
- **أمثلة جاهزة** للتعلم السريع
- **رسائل خطأ واضحة** باللغة العربية
- **إحصائيات مفصلة** للكود

## 🚀 التثبيت والتشغيل

### متطلبات النظام
- **Node.js** (الإصدار 18 أو أحدث)
- **npm** أو **yarn**
- **نظام التشغيل**: Windows, macOS, Linux

### خطوات التثبيت

1. **الانتقال لمجلد التطبيق**
```bash
cd wahy-desktop
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **تشغيل التطبيق في وضع التطوير**
```bash
npm run dev
```

4. **بناء التطبيق للإنتاج**
```bash
npm run build
npm run dist
```

### بناء التطبيق لنظام تشغيل محدد

```bash
# لنظام Windows
npm run dist -- --win

# لنظام macOS  
npm run dist -- --mac

# لنظام Linux
npm run dist -- --linux
```

## 🎯 كيفية الاستخدام

### البداية السريعة

1. **افتح التطبيق** - ستجد مثالاً جاهزاً للتشغيل
2. **اضغط "تشغيل"** - ستظهر النتيجة في نافذة المعاينة
3. **جرب تعديل الكود** - ستشاهد التغييرات فوراً
4. **احفظ مشروعك** - باستخدام Ctrl+S

### أمثلة عملية

#### مثال بسيط
```wahy
افتح صفحة "صفحتي الأولى"
أضف عنوان "مرحباً بكم في لغة وحي"
أضف فقرة "هذا مثال بسيط على البرمجة العربية"
أغلق صفحة
```

#### مثال مع تصميم
```wahy
افتح صفحة "صفحة منسقة"

ابدأ_CSS
اختر body
لون_الخلفية lightblue
الخط Arial
حجم_الخط 18px
}
أنهِ_CSS

أضف عنوان "موقع بتصميم جميل"
أضف فقرة "مرحباً بالتصميم المتقدم"
أغلق صفحة
```

#### مثال تفاعلي
```wahy
افتح صفحة "صفحة تفاعلية"

ابدأ_JS
دالة ترحيب() {
  أظهر_رسالة "أهلاً وسهلاً!"
}
أنهِ_JS

أضف عنوان "جرب التفاعل"
أنشئ_زر "اضغط هنا" "ترحيب()"
أغلق صفحة
```

## 🎮 اختصارات لوحة المفاتيح

| الاختصار | الوظيفة |
|---------|----------|
| `Ctrl+N` | مشروع جديد |
| `Ctrl+O` | فتح مشروع |
| `Ctrl+S` | حفظ |
| `Ctrl+Shift+S` | حفظ باسم |
| `F5` | تشغيل الكود |
| `Ctrl+F5` | تشغيل ومعاينة |
| `Ctrl+T` | تبديل الوضع الداكن/الفاتح |
| `Ctrl+Q` | إغلاق التطبيق |

## 🏗️ البنية التقنية

### تقنيات التطوير
- **Electron.js** - إطار تطبيقات سطح المكتب
- **React.js** - واجهة المستخدم التفاعلية
- **TypeScript** - لغة البرمجة المطورة
- **Monaco Editor** - محرر الكود المتقدم
- **Node.js** - بيئة تشغيل الخادم

### بنية المشروع
```
wahy-desktop/
├── src/
│   ├── main/           # العملية الرئيسية (Electron)
│   │   └── main.ts
│   ├── renderer/       # واجهة المستخدم (React)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   └── main.tsx
│   │   └── index.html
│   └── shared/         # الكود المشترك
│       └── wahy-interpreter.ts
├── assets/             # الأيقونات والصور
├── package.json
└── README.md
```

## 🤝 المساهمة والتطوير

نرحب بمساهماتكم في تطوير Wahy Desktop! يمكنكم:

### المساهمة في الكود
1. **انسخوا المستودع** (Fork the repository)
2. **أنشئوا فرع جديد** (`git checkout -b feature/amazing-feature`)
3. **اكتبوا تغييراتكم** (`git commit -m 'Add amazing feature'`)
4. **ارفعوا الفرع** (`git push origin feature/amazing-feature`)
5. **افتحوا Pull Request**

### الإبلاغ عن المشاكل
- استخدموا قسم Issues في GitHub
- وصفوا المشكلة بالتفصيل
- أرفقوا لقطات شاشة إذا أمكن
- اذكروا نظام التشغيل والإصدار

### اقتراح مميزات جديدة
- شاركوا أفكاركم في Issues
- اشرحوا الفائدة المتوقعة
- ارسموا مخطط أولي إذا أمكن

## 🔮 خارطة الطريق

### الإصدار الحالي (Alpha 1.0)
- ✅ محرر أساسي مع Monaco
- ✅ مفسر لغة وحي متكامل
- ✅ معاينة مباشرة
- ✅ حفظ وفتح الملفات
- ✅ تصدير HTML

### الإصدارات القادمة

#### Beta 1.1
- 🔄 **نظام الإضافات** - دعم plugins خارجية
- 🔄 **مكتبة أوامر موسعة** - أوامر متقدمة للتصميم
- 🔄 **أدوات التصحيح** - debugger متكامل
- 🔄 **تحسينات الأداء** - سرعة أكبر في التشغيل

#### الإصدار النهائي 1.0
- 🔄 **دعم المشاريع الكبيرة** - ملفات متعددة
- 🔄 **نظام Git متكامل** - version control
- 🔄 **مشاركة المشاريع** - رفع مباشر للويب
- 🔄 **سوق الأكواد** - مشاركة القوالب
- 🔄 **دروس تفاعلية** - تعلم داخل التطبيق

## 📊 الأداء والتوافق

### الأداء
- **وقت البدء**: أقل من 3 ثواني
- **استهلاك الذاكرة**: 150-300 ميجابايت
- **سرعة التفسير**: أقل من 100 مللي ثانية للملفات الصغيرة
- **حجم التطبيق**: ~150 ميجابايت (مضغوط)

### التوافق
- **Windows**: 10, 11 (x64, arm64)
- **macOS**: 10.15+ (Intel, Apple Silicon)
- **Linux**: Ubuntu 18.04+, Fedora 30+, Debian 10+

## 🛠️ الإعدادات المتقدمة

### متغيرات البيئة
```bash
# وضع التطوير
NODE_ENV=development

# مسار الإضافات
WAHY_PLUGINS_PATH=/path/to/plugins

# تفعيل السجلات المفصلة
WAHY_DEBUG=true
```

### إعدادات التطبيق
يمكن تخصيص التطبيق عبر ملف `config.json`:

```json
{
  "editor": {
    "fontSize": 14,
    "theme": "light",
    "autoSave": true
  },
  "interpreter": {
    "timeout": 5000,
    "maxOutputSize": "10MB"
  },
  "ui": {
    "language": "ar",
    "direction": "rtl"
  }
}
```

## 🔐 الأمان والخصوصية

- **تشغيل محلي**: جميع الأكواد تُشغل محلياً على جهازك
- **لا توجد تتبع**: لا نجمع أي بيانات شخصية
- **مفتوح المصدر**: الكود متاح للمراجعة والتدقيق
- **تشفير الملفات**: دعم حفظ الملفات مشفرة (قريباً)

## 📞 الدعم والمساعدة

### الحصول على المساعدة
- **GitHub Issues**: للمشاكل التقنية
- **Discord**: [انضموا لمجتمعنا](https://discord.gg/wahy-lang)
- **البريد الإلكتروني**: desktop@wahy-lang.com
- **الوثائق**: [docs.wahy-lang.com](https://docs.wahy-lang.com)

### الأسئلة الشائعة

**س: هل يمكن تشغيل ملفات Python في التطبيق؟**
ج: حالياً الإصدار Alpha يدعم HTML وCSS وJavaScript. دعم Python مخطط للإصدارات القادمة.

**س: هل يمكن تصدير المشاريع لتطبيقات موبايل؟**
ج: حالياً التصدير متاح لـ HTML فقط. دعم تصدير React Native وFlutter مخطط مستقبلاً.

**س: هل التطبيق مجاني؟**
ج: نعم، التطبيق مجاني ومفتوح المصدر تحت رخصة MIT.

## 📜 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](../LICENSE) للتفاصيل.

```
MIT License

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
```

## 🙏 شكر وتقدير

- **فريق تطوير لغة وحي** - للرؤية والإلهام
- **مجتمع Electron** - للأدوات الرائعة
- **فريق React** - لإطار العمل المذهل
- **Microsoft Monaco** - لمحرر الكود المتقدم
- **المجتمع العربي التقني** - للدعم والتشجيع

---

<div align="center">
  <p><strong>صُنع بـ ❤️ للمجتمع العربي التقني</strong></p>
  <p>لغة وحي - حيث تلتقي البرمجة بالعربية</p>
</div>