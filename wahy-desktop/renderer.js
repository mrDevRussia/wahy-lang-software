/**
 * Wahy Desktop - Renderer Process
 * عملية العرض وربط الواجهة بمحرك اللغة
 */

// عناصر الواجهة
const elements = {
  codeEditor: document.getElementById('codeEditor'),
  preview: document.getElementById('preview'),
  console: document.getElementById('console'),
  runBtn: document.getElementById('runBtn'),
  clearBtn: document.getElementById('clearBtn'),
  saveBtn: document.getElementById('saveBtn'),
  exportBtn: document.getElementById('exportBtn'),
  fileName: document.getElementById('fileName'),
  fileStatus: document.getElementById('fileStatus'),
  lineCount: document.getElementById('lineCount'),
  charCount: document.getElementById('charCount'),
  previewStatus: document.getElementById('previewStatus'),
  interpreterStatus: document.getElementById('interpreterStatus'),
  exampleSelect: document.getElementById('exampleSelect'),
  helpModal: document.getElementById('helpModal'),
  clearConsole: document.getElementById('clearConsole'),
  refreshPreview: document.getElementById('refreshPreview')
};

// متغيرات التطبيق
let interpreter = new WahyInterpreter();
let currentFilePath = null;
let isUnsaved = false;
let lastResult = null;

// أمثلة جاهزة
const examples = {
  simple: `افتح صفحة "مثال بسيط"
أضف عنوان "مرحباً بكم في لغة وحي"
أضف فقرة "هذا مثال بسيط على استخدام لغة البرمجة العربية"
أضف رابط "زوروا موقعنا" "https://wahy-lang.com"
أغلق صفحة`,

  styled: `افتح صفحة "صفحة منسقة"
غيّر لون_الخلفية إلى "lightblue"
غيّر لون_النص إلى "darkblue"
غيّر الخط إلى "Arial"
أضف عنوان "موقع بتصميم جميل"
أضف فقرة "هذه صفحة منسقة بألوان وخطوط جميلة"
أضف خط_فاصل
أضف عنوان_فرعي "قائمة بالمميزات"
ابدأ قائمة
أضف عنصر "سهولة الاستخدام"
أضف عنصر "دعم اللغة العربية"
أضف عنصر "تصميم جميل"
أنهِ قائمة
أغلق صفحة`,

  interactive: `افتح صفحة "صفحة تفاعلية"
أضف عنوان "تجربة الأزرار التفاعلية"
أضف فقرة "اضغط على الأزرار التالية لتجربة التفاعل"
أنشئ_زر "قل مرحباً" "alert('مرحباً بك في لغة وحي!')"
أنشئ_زر "غيّر اللون" "document.body.style.backgroundColor = 'lightgreen'"
أنشئ_زر "إخفاء النص" "document.querySelector('p').style.display = 'none'"
أضف مسافة
أضف فقرة "هذا النص يمكن إخفاؤه بالزر أعلاه"
أغلق صفحة`
};

// تهيئة التطبيق
function initializeApp() {
  setupEventListeners();
  setupMenuListeners();
  updateStats();
  addConsoleMessage('تم تحميل Wahy Desktop بنجاح! 🎉', 'success');
  addConsoleMessage('اكتب كودك في المحرر واضغط "تشغيل" لرؤية النتيجة', 'info');
  
  // تحميل مثال افتراضي
  elements.codeEditor.value = examples.simple;
  updateStats();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
  // أزرار شريط الأدوات
  elements.runBtn.addEventListener('click', runCode);
  elements.clearBtn.addEventListener('click', clearAll);
  elements.saveBtn.addEventListener('click', saveFile);
  elements.exportBtn.addEventListener('click', exportHTML);
  
  // محرر الكود
  elements.codeEditor.addEventListener('input', () => {
    updateStats();
    markAsUnsaved();
    debounce(autoPreview, 1000)();
  });
  
  // قائمة الأمثلة
  elements.exampleSelect.addEventListener('change', loadExample);
  
  // وحدة التحكم
  elements.clearConsole.addEventListener('click', clearConsole);
  
  // المعاينة
  elements.refreshPreview.addEventListener('click', runCode);
  
  // النافذة المنبثقة للمساعدة
  const modal = elements.helpModal;
  const closeBtn = modal.querySelector('.close');
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // اختصارات لوحة المفاتيح
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

// إعداد مستمعي القوائم
function setupMenuListeners() {
  if (window.wahyAPI) {
    window.wahyAPI.onMenuAction((action) => {
      switch (action) {
        case 'new':
          newProject();
          break;
        case 'save':
          saveFile();
          break;
        case 'save-as':
          saveFileAs();
          break;
        case 'run':
          runCode();
          break;
        case 'clear':
          clearAll();
          break;
        case 'help':
          showHelp();
          break;
        case 'export':
          exportHTML();
          break;
      }
    });
    
    window.wahyAPI.onFileOpened((data) => {
      elements.codeEditor.value = data.content;
      currentFilePath = data.path;
      elements.fileName.textContent = data.name;
      isUnsaved = false;
      updateFileStatus();
      updateStats();
      addConsoleMessage(`تم فتح الملف: ${data.name}`, 'success');
    });
  }
}

// تشغيل الكود
async function runCode() {
  const code = elements.codeEditor.value.trim();
  
  if (!code) {
    addConsoleMessage('لا يوجد كود للتشغيل', 'warning');
    return;
  }
  
  elements.runBtn.textContent = '⏳ جاري التشغيل...';
  elements.runBtn.disabled = true;
  elements.interpreterStatus.textContent = 'جاري تفسير الكود...';
  
  try {
    addConsoleMessage('بدء تفسير الكود...', 'info');
    
    const result = interpreter.interpret(code);
    lastResult = result;
    
    if (result.success) {
      elements.preview.srcdoc = result.html;
      elements.previewStatus.textContent = 'تم التشغيل بنجاح ✅';
      elements.previewStatus.className = 'status-text success-state';
      addConsoleMessage('تم تفسير وتشغيل الكود بنجاح! 🎉', 'success');
    } else {
      elements.preview.srcdoc = `
        <html dir="rtl">
          <body style="font-family: Arial; padding: 20px; background: #fee2e2; color: #dc2626;">
            <h2>❌ خطأ في الكود</h2>
            <p>${result.error}</p>
            <hr>
            <p><strong>نصائح:</strong></p>
            <ul>
              <li>تأكد من بدء الكود بـ "افتح صفحة"</li>
              <li>تأكد من إنهاء الكود بـ "أغلق صفحة"</li>
              <li>تأكد من وضع النصوص بين علامتي تنصيص</li>
            </ul>
          </body>
        </html>
      `;
      elements.previewStatus.textContent = 'خطأ في الكود ❌';
      elements.previewStatus.className = 'status-text error-state';
      addConsoleMessage(`خطأ في الكود: ${result.error}`, 'error');
    }
    
  } catch (error) {
    addConsoleMessage(`خطأ غير متوقع: ${error.message}`, 'error');
    elements.previewStatus.textContent = 'خطأ غير متوقع ❌';
    elements.previewStatus.className = 'status-text error-state';
  } finally {
    elements.runBtn.textContent = '▶️ تشغيل';
    elements.runBtn.disabled = false;
    elements.interpreterStatus.textContent = 'مفسر وحي جاهز';
  }
}

// مسح الكل
function clearAll() {
  elements.codeEditor.value = '';
  elements.preview.srcdoc = 'about:blank';
  elements.previewStatus.textContent = 'جاهز للتشغيل...';
  elements.previewStatus.className = 'status-text';
  clearConsole();
  updateStats();
  addConsoleMessage('تم مسح جميع المحتويات', 'info');
}

// مشروع جديد
function newProject() {
  if (isUnsaved) {
    const confirm = window.confirm('هل تريد إنشاء مشروع جديد؟ ستفقد التغييرات غير المحفوظة.');
    if (!confirm) return;
  }
  
  elements.codeEditor.value = examples.simple;
  currentFilePath = null;
  elements.fileName.textContent = 'مشروع جديد.wahy';
  isUnsaved = false;
  updateFileStatus();
  updateStats();
  clearConsole();
  addConsoleMessage('تم إنشاء مشروع جديد', 'success');
}

// حفظ الملف
async function saveFile() {
  if (!window.wahyAPI) {
    addConsoleMessage('خطأ: API غير متوفر', 'error');
    return;
  }
  
  try {
    const result = await window.wahyAPI.saveFile(elements.codeEditor.value, currentFilePath);
    
    if (result.success) {
      currentFilePath = result.path;
      elements.fileName.textContent = result.name;
      isUnsaved = false;
      updateFileStatus();
      addConsoleMessage(`تم حفظ الملف: ${result.name}`, 'success');
    } else if (!result.canceled) {
      addConsoleMessage(`خطأ في الحفظ: ${result.error}`, 'error');
    }
  } catch (error) {
    addConsoleMessage(`خطأ في الحفظ: ${error.message}`, 'error');
  }
}

// حفظ باسم
async function saveFileAs() {
  if (!window.wahyAPI) return;
  
  try {
    const result = await window.wahyAPI.saveFile(elements.codeEditor.value, null);
    
    if (result.success) {
      currentFilePath = result.path;
      elements.fileName.textContent = result.name;
      isUnsaved = false;
      updateFileStatus();
      addConsoleMessage(`تم حفظ الملف: ${result.name}`, 'success');
    }
  } catch (error) {
    addConsoleMessage(`خطأ في الحفظ: ${error.message}`, 'error');
  }
}

// تصدير HTML
async function exportHTML() {
  if (!lastResult || !lastResult.success) {
    addConsoleMessage('لا يوجد محتوى HTML للتصدير. قم بتشغيل الكود أولاً.', 'warning');
    return;
  }
  
  if (!window.wahyAPI) {
    addConsoleMessage('خطأ: API غير متوفر', 'error');
    return;
  }
  
  try {
    const fileName = currentFilePath ? 
      currentFilePath.replace('.wahy', '.html').split('/').pop() : 
      'مشروع-وحي.html';
      
    const result = await window.wahyAPI.exportHTML(lastResult.html, fileName);
    
    if (result.success) {
      addConsoleMessage(`تم تصدير HTML بنجاح: ${result.path}`, 'success');
    } else if (!result.canceled) {
      addConsoleMessage(`خطأ في التصدير: ${result.error}`, 'error');
    }
  } catch (error) {
    addConsoleMessage(`خطأ في التصدير: ${error.message}`, 'error');
  }
}

// تحميل مثال
function loadExample() {
  const selectedExample = elements.exampleSelect.value;
  if (selectedExample && examples[selectedExample]) {
    elements.codeEditor.value = examples[selectedExample];
    updateStats();
    markAsUnsaved();
    addConsoleMessage(`تم تحميل المثال: ${selectedExample}`, 'info');
  }
  elements.exampleSelect.value = '';
}

// معاينة تلقائية
function autoPreview() {
  // يمكن إضافة معاينة تلقائية هنا إذا رغبت
}

// تحديث الإحصائيات
function updateStats() {
  const code = elements.codeEditor.value;
  const lines = code.split('\n').length;
  const chars = code.length;
  
  elements.lineCount.textContent = `السطور: ${lines}`;
  elements.charCount.textContent = `الأحرف: ${chars}`;
}

// تحديث حالة الملف
function updateFileStatus() {
  elements.fileStatus.textContent = isUnsaved ? '● غير محفوظ' : '✓ محفوظ';
  elements.fileStatus.className = isUnsaved ? 'error-state' : 'success-state';
}

// تمييز كملف غير محفوظ
function markAsUnsaved() {
  isUnsaved = true;
  updateFileStatus();
}

// إضافة رسالة لوحدة التحكم
function addConsoleMessage(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('ar');
  const messageElement = document.createElement('div');
  messageElement.className = `console-message ${type}`;
  messageElement.textContent = `[${timestamp}] ${message}`;
  
  elements.console.appendChild(messageElement);
  elements.console.scrollTop = elements.console.scrollHeight;
}

// مسح وحدة التحكم
function clearConsole() {
  elements.console.innerHTML = '';
  addConsoleMessage('تم مسح وحدة التحكم', 'info');
}

// إظهار المساعدة
function showHelp() {
  elements.helpModal.style.display = 'block';
}

// معالجة اختصارات لوحة المفاتيح
function handleKeyboardShortcuts(event) {
  const isCtrl = event.ctrlKey || event.metaKey;
  
  if (isCtrl) {
    switch (event.key.toLowerCase()) {
      case 's':
        event.preventDefault();
        if (event.shiftKey) {
          saveFileAs();
        } else {
          saveFile();
        }
        break;
      case 'n':
        event.preventDefault();
        newProject();
        break;
      case 'r':
        event.preventDefault();
        runCode();
        break;
    }
  } else if (event.key === 'F5') {
    event.preventDefault();
    runCode();
  } else if (event.key === 'F1') {
    event.preventDefault();
    showHelp();
  }
}

// دالة تأخير التنفيذ
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);