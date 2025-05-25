/**
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
