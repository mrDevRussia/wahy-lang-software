@echo off
echo Wahy Desktop - File Extension Registration
echo ==========================================
echo تسجيل امتداد ملفات لغة وحي (.wahy)
echo.

rem التحقق من صلاحيات المدير
net session >nul 2>&1
if errorlevel 1 (
    echo ❌ هذا الملف يحتاج صلاحيات المدير
    echo يرجى النقر بزر الماوس الأيمن واختيار "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ✅ تسجيل امتداد .wahy...

rem إنشاء مفتاح امتداد .wahy
reg add "HKEY_CLASSES_ROOT\.wahy" /ve /d "WahySourceFile" /f >nul 2>&1

rem إنشاء مفتاح نوع الملف
reg add "HKEY_CLASSES_ROOT\WahySourceFile" /ve /d "Wahy Source File" /f >nul 2>&1

rem تعيين الأيقونة
reg add "HKEY_CLASSES_ROOT\WahySourceFile\DefaultIcon" /ve /d "%USERPROFILE%\WahyDesktop\assets\icon.ico,0" /f >nul 2>&1

rem إضافة أمر الفتح
reg add "HKEY_CLASSES_ROOT\WahySourceFile\shell\open\command" /ve /d "node \"%USERPROFILE%\WahyDesktop\main.js\" \"%%1\"" /f >nul 2>&1

rem إضافة أمر تشغيل بـ Wahy Desktop
reg add "HKEY_CLASSES_ROOT\WahySourceFile\shell\edit" /ve /d "فتح بـ Wahy Desktop" /f >nul 2>&1
reg add "HKEY_CLASSES_ROOT\WahySourceFile\shell\edit\command" /ve /d "node \"%USERPROFILE%\WahyDesktop\main.js\" \"%%1\"" /f >nul 2>&1

rem إضافة قائمة السياق "إنشاء ملف وحي جديد"
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\NewWahyFile" /ve /d "إنشاء ملف وحي جديد" /f >nul 2>&1
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\NewWahyFile\command" /ve /d "echo افتح صفحة \"مشروع جديد\" > \"%%V\مشروع-جديد.wahy\" && node \"%USERPROFILE%\WahyDesktop\main.js\" \"%%V\مشروع-جديد.wahy\"" /f >nul 2>&1

echo ✅ تم تسجيل امتداد .wahy بنجاح!
echo.
echo المميزات المُفعلة:
echo - النقر المزدوج على ملفات .wahy سيفتحها في Wahy Desktop
echo - أيقونة مخصصة لملفات .wahy
echo - قائمة "إنشاء ملف وحي جديد" بالنقر الأيمن في المجلدات
echo.
echo الآن يمكنك:
echo 1. إنشاء ملف جديد باسم "مثال.wahy"
echo 2. النقر عليه نقراً مزدوجاً لفتحه في Wahy Desktop
echo.
pause