/**
 * Wahy Desktop - Preload Script
 * سكريبت التحميل المسبق لتطبيق وحي
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('wahyAPI', {
  // Code interpretation
  interpretCode: (code) => ipcRenderer.invoke('wahy:interpret-code', code),
  
  // File operations
  saveFile: (content, filePath) => ipcRenderer.invoke('wahy:save-file', content, filePath),
  openFile: () => ipcRenderer.invoke('wahy:open-file'),
  exportHTML: (htmlContent, projectName) => ipcRenderer.invoke('wahy:export-html', htmlContent, projectName),
  
  // App info
  getAppInfo: () => ipcRenderer.invoke('wahy:get-app-info'),
  
  // Menu listeners
  onMenuAction: (callback) => {
    ipcRenderer.on('menu:new-project', callback);
    ipcRenderer.on('menu:save', callback);
    ipcRenderer.on('menu:save-as', callback);
    ipcRenderer.on('menu:open-project', callback);
    ipcRenderer.on('menu:export-html', callback);
    ipcRenderer.on('menu:toggle-theme', callback);
    ipcRenderer.on('menu:run-code', callback);
    ipcRenderer.on('menu:run-and-preview', callback);
    ipcRenderer.on('menu:show-commands', callback);
    ipcRenderer.on('menu:show-examples', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});