@echo off
title Wahy Desktop Portable
echo.
echo 🖥️ Wahy Desktop - محرر لغة البرمجة العربية
echo ===============================================
echo.
echo جاري بدء التطبيق...
echo Starting application...
echo.

rem تحقق من وجود Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo يرجى تثبيت Node.js من nodejs.org
    echo.
    pause
    exit /b 1
)

rem تشغيل التطبيق
node portable-runner.js

pause
