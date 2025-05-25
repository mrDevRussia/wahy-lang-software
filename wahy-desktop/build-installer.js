/**
 * Wahy Desktop - Simple Installer Builder
 * أداة بناء ملف التثبيت البسيط لوحي Desktop
 */

const fs = require('fs');
const path = require('path');

// إنشاء ملف setup.bat للتثبيت على Windows
const setupBatContent = `@echo off
echo Wahy Desktop Installer
echo ======================
echo.
echo Installing Wahy Desktop...
echo.

rem Create installation directory
if not exist "%USERPROFILE%\\WahyDesktop" (
    mkdir "%USERPROFILE%\\WahyDesktop"
)

rem Copy files
copy /Y "*.js" "%USERPROFILE%\\WahyDesktop\\"
copy /Y "*.html" "%USERPROFILE%\\WahyDesktop\\"
copy /Y "*.css" "%USERPROFILE%\\WahyDesktop\\"
copy /Y "package.json" "%USERPROFILE%\\WahyDesktop\\"
xcopy /Y /E /I "assets" "%USERPROFILE%\\WahyDesktop\\assets\\"
xcopy /Y /E /I "node_modules" "%USERPROFILE%\\WahyDesktop\\node_modules\\"

rem Create desktop shortcut
echo Creating desktop shortcut...
echo Set WshShell = WScript.CreateObject("WScript.Shell") > create_shortcut.vbs
echo Set shortcut = WshShell.CreateShortcut("%USERPROFILE%\\Desktop\\Wahy Desktop.lnk") >> create_shortcut.vbs
echo shortcut.TargetPath = "node.exe" >> create_shortcut.vbs
echo shortcut.Arguments = "main.js" >> create_shortcut.vbs
echo shortcut.WorkingDirectory = "%USERPROFILE%\\WahyDesktop" >> create_shortcut.vbs
echo shortcut.IconLocation = "%USERPROFILE%\\WahyDesktop\\assets\\icon.ico" >> create_shortcut.vbs
echo shortcut.Save >> create_shortcut.vbs

cscript create_shortcut.vbs
del create_shortcut.vbs

echo.
echo Installation completed successfully!
echo You can now find "Wahy Desktop" on your desktop.
echo.
pause
`;

// إنشاء ملف portable executable script
const portableRunnerContent = `/**
 * Wahy Desktop Portable Runner
 * مشغل وحي Desktop المحمول
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Wahy Desktop...');
console.log('مرحباً بك في وحي Desktop!');

// تشغيل التطبيق
const electron = spawn('npx', ['electron', '.'], {
  cwd: __dirname,
  stdio: 'inherit'
});

electron.on('error', (err) => {
  console.error('❌ Error starting Wahy Desktop:', err.message);
  console.log('💡 Installing dependencies...');
  
  // تثبيت التبعيات إذا لم تكن موجودة
  const npm = spawn('npm', ['install'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  npm.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully!');
      console.log('🔄 Restarting Wahy Desktop...');
      
      // إعادة تشغيل التطبيق
      const electronRetry = spawn('npx', ['electron', '.'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
    }
  });
});

electron.on('close', (code) => {
  console.log('👋 Wahy Desktop closed.');
});
`;

// إنشاء دليل استخدام سريع
const quickStartContent = `# 🖥️ Wahy Desktop - دليل البدء السريع

## التشغيل المباشر (Windows)
1. انقر نقراً مزدوجاً على \`WahyDesktop-Portable.bat\`
2. انتظر تحميل التطبيق
3. ابدأ البرمجة بلغة وحي!

## التثبيت على النظام (Windows)
1. انقر بزر الماوس الأيمن على \`setup.bat\`
2. اختر "Run as administrator"
3. اتبع التعليمات على الشاشة
4. ستجد اختصار "Wahy Desktop" على سطح المكتب

## التشغيل اليدوي
\`\`\`bash
npm install
npm start
\`\`\`

## المساعدة
- اضغط F1 داخل التطبيق لرؤية دليل الأوامر
- أو راجع README.md للتفاصيل الكاملة

---
صُنع بـ ❤️ للمجتمع العربي التقني
`;

// إنشاء ملف bat للتشغيل المحمول
const portableBatContent = `@echo off
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
`;

// كتابة الملفات
try {
  fs.writeFileSync('setup.bat', setupBatContent);
  fs.writeFileSync('portable-runner.js', portableRunnerContent);
  fs.writeFileSync('QUICK-START.md', quickStartContent);
  fs.writeFileSync('WahyDesktop-Portable.bat', portableBatContent);
  
  console.log('✅ Installer files created successfully!');
  console.log('📁 Files created:');
  console.log('   - setup.bat (System installer)');
  console.log('   - WahyDesktop-Portable.bat (Portable version)');
  console.log('   - portable-runner.js (Portable runner)');
  console.log('   - QUICK-START.md (Quick start guide)');
  
} catch (error) {
  console.error('❌ Error creating installer files:', error.message);
}