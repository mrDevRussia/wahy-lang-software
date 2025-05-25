/**
 * Wahy Desktop - Lockdown Preload Script
 * سكريبت preload لنافذة تعطيل النظام
 */

const { contextBridge, ipcRenderer } = require('electron');

// تعريض API محدودة لنافذة القفل
contextBridge.exposeInMainWorld('electronAPI', {
    // استقبال أحداث قفل النظام
    onSystemLocked: (callback) => {
        ipcRenderer.on('system-locked', (event, data) => {
            callback(data);
        });
    },
    
    // إزالة المستمع
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});

// منع الوصول لـ Node.js APIs
window.eval = global.eval = function () {
    throw new Error('eval() is disabled for security reasons');
};

// تعطيل console في الإنتاج
if (process.env.NODE_ENV === 'production') {
    window.console = {
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {},
        debug: () => {}
    };
}