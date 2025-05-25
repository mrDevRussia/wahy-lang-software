/**
 * Wahy Desktop - Preload Script
 * سكريبت الربط بين الواجهة ومحرك اللغة
 */

const { contextBridge, ipcRenderer } = require('electron');

// تصدير API آمن للواجهة
contextBridge.exposeInMainWorld('wahyAPI', {
  // عمليات الملفات
  saveFile: (content, filePath) => ipcRenderer.invoke('save-file', content, filePath),
  exportHTML: (htmlContent, fileName) => ipcRenderer.invoke('export-html', htmlContent, fileName),
  
  // الاستماع لأحداث القائمة
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-project', () => callback('new'));
    ipcRenderer.on('menu-save', () => callback('save'));
    ipcRenderer.on('menu-save-as', () => callback('save-as'));
    ipcRenderer.on('menu-run', () => callback('run'));
    ipcRenderer.on('menu-clear', () => callback('clear'));
    ipcRenderer.on('menu-help', () => callback('help'));
    ipcRenderer.on('menu-export-html', () => callback('export'));
  },
  
  // الاستماع لفتح الملفات
  onFileOpened: (callback) => {
    ipcRenderer.on('file-opened', (event, data) => callback(data));
  },
  
  // إزالة المستمعين
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('menu-new-project');
    ipcRenderer.removeAllListeners('menu-save');
    ipcRenderer.removeAllListeners('menu-save-as');
    ipcRenderer.removeAllListeners('menu-run');
    ipcRenderer.removeAllListeners('menu-clear');
    ipcRenderer.removeAllListeners('menu-help');
    ipcRenderer.removeAllListeners('menu-export-html');
    ipcRenderer.removeAllListeners('file-opened');
  }
});