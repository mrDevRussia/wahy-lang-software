@echo off
echo إنشاء ملفات عينة لتجربة امتداد .wahy
echo =======================================
echo.

rem إنشاء مجلد للعينات
if not exist "samples" mkdir samples

rem مثال بسيط
echo # مثال بسيط - لغة وحي > samples\simple-example.wahy
echo افتح صفحة "مثال بسيط" >> samples\simple-example.wahy
echo أضف عنوان "مرحباً بكم في لغة وحي" >> samples\simple-example.wahy
echo أضف فقرة "هذا مثال بسيط على البرمجة العربية" >> samples\simple-example.wahy
echo أغلق صفحة >> samples\simple-example.wahy

rem مثال متقدم
echo # مثال متقدم - لغة وحي > samples\advanced-example.wahy
echo افتح صفحة "مثال متقدم" >> samples\advanced-example.wahy
echo غيّر لون_الخلفية إلى "lightblue" >> samples\advanced-example.wahy
echo غيّر لون_النص إلى "darkblue" >> samples\advanced-example.wahy
echo أضف عنوان "موقع بتصميم جميل" >> samples\advanced-example.wahy
echo ابدأ قائمة >> samples\advanced-example.wahy
echo أضف عنصر "برمجة عربية" >> samples\advanced-example.wahy
echo أضف عنصر "تصميم جميل" >> samples\advanced-example.wahy
echo أنهِ قائمة >> samples\advanced-example.wahy
echo أغلق صفحة >> samples\advanced-example.wahy

rem مثال تفاعلي
echo # مثال تفاعلي - لغة وحي > samples\interactive-example.wahy
echo افتح صفحة "مثال تفاعلي" >> samples\interactive-example.wahy
echo أضف عنوان "تجربة الأزرار" >> samples\interactive-example.wahy
echo أنشئ_زر "قل مرحباً" "alert('مرحباً من وحي!')" >> samples\interactive-example.wahy
echo أنشئ_زر "غيّر اللون" "document.body.style.backgroundColor='lightgreen'" >> samples\interactive-example.wahy
echo أغلق صفحة >> samples\interactive-example.wahy

echo ✅ تم إنشاء ملفات العينة في مجلد samples\
echo.
echo يمكنك الآن:
echo 1. النقر نقراً مزدوجاً على أي ملف .wahy لفتحه
echo 2. تجربة ملفات العينة الجاهزة
echo.
pause