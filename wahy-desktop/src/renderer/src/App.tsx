/**
 * Wahy Desktop - Main Application Component
 * المكون الرئيسي لتطبيق وحي سطح المكتب
 */

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Save, 
  FolderOpen, 
  Download, 
  Sun, 
  Moon, 
  FileText, 
  Code, 
  Eye,
  Terminal,
  Settings,
  Maximize,
  Minimize,
  RotateCcw
} from 'lucide-react';

interface InterpretationResult {
  success: boolean;
  html?: string;
  css?: string;
  javascript?: string;
  combinedOutput?: string;
  error?: string;
  warnings?: string[];
  type?: string;
}

interface WahyAPI {
  interpretCode: (code: string) => Promise<InterpretationResult>;
  saveFile: (content: string, filePath?: string) => Promise<any>;
  openFile: () => Promise<any>;
  exportHTML: (htmlContent: string, projectName: string) => Promise<any>;
  getAppInfo: () => Promise<any>;
  onMenuAction: (callback: (event: any, action: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    wahyAPI: WahyAPI;
  }
}

const WAHY_EXAMPLES = {
  'مثال بسيط': `افتح صفحة "صفحتي الأولى"
أضف عنوان "مرحباً بكم في لغة وحي"
أضف فقرة "هذا مثال بسيط على استخدام لغة البرمجة العربية"
أغلق صفحة`,

  'صفحة مع تصميم': `افتح صفحة "صفحة جميلة"

ابدأ_CSS
اختر body
لون_الخلفية lightblue
الخط Arial
حجم_الخط 18px
}
أنهِ_CSS

أضف عنوان "موقع بتصميم جميل"
أضف فقرة "هذه صفحة منسقة بـ CSS"
أغلق صفحة`,

  'صفحة تفاعلية': `افتح صفحة "صفحة تفاعلية"

ابدأ_JS
دالة ترحيب() {
  أظهر_رسالة "مرحباً! هذا مثال على التفاعل"
}

دالة غيّر_اللون() {
  متغير ألوان = ["أحمر", "أزرق", "أخضر", "أصفر"]
  متغير لون_عشوائي = ألوان[Math.floor(Math.random() * 4)]
  document.body.style.backgroundColor = لون_عشوائي
}
أنهِ_JS

أضف عنوان "تجربة التفاعل"
أنشئ_زر "قل مرحباً" "ترحيب()"
أضف مسافة
أنشئ_زر "غيّر اللون" "غيّر_اللون()"

أغلق صفحة`
};

export default function App() {
  const [code, setCode] = useState(WAHY_EXAMPLES['مثال بسيط']);
  const [output, setOutput] = useState('');
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // تطبيق الثيم
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // الاستماع لأحداث القائمة
    if (window.wahyAPI) {
      window.wahyAPI.onMenuAction((event, action) => {
        handleMenuAction(action);
      });
    }

    return () => {
      if (window.wahyAPI) {
        // تنظيف المستمعين
        window.wahyAPI.removeAllListeners('menu:new-project');
        window.wahyAPI.removeAllListeners('menu:save');
        window.wahyAPI.removeAllListeners('menu:open-project');
        window.wahyAPI.removeAllListeners('menu:export-html');
        window.wahyAPI.removeAllListeners('menu:toggle-theme');
        window.wahyAPI.removeAllListeners('menu:run-code');
      }
    };
  }, []);

  useEffect(() => {
    // تحديث حالة عدم الحفظ
    setIsUnsaved(true);
  }, [code]);

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'menu:new-project':
        handleNewProject();
        break;
      case 'menu:save':
        handleSave();
        break;
      case 'menu:open-project':
        handleOpen();
        break;
      case 'menu:export-html':
        handleExport();
        break;
      case 'menu:toggle-theme':
        setIsDarkMode(!isDarkMode);
        break;
      case 'menu:run-code':
        handleRun();
        break;
    }
  };

  const handleNewProject = () => {
    if (isUnsaved) {
      const confirm = window.confirm('هل تريد إنشاء مشروع جديد؟ ستفقد التغييرات غير المحفوظة.');
      if (!confirm) return;
    }
    
    setCode(WAHY_EXAMPLES['مثال بسيط']);
    setCurrentFile(null);
    setIsUnsaved(false);
    setResult(null);
    setOutput('');
    setConsoleOutput([]);
  };

  const handleSave = async () => {
    if (!window.wahyAPI) return;
    
    try {
      const result = await window.wahyAPI.saveFile(code, currentFile || undefined);
      if (result.success) {
        setCurrentFile(result.filePath);
        setIsUnsaved(false);
        addConsoleMessage('تم حفظ الملف بنجاح: ' + result.filePath);
      } else if (!result.canceled) {
        addConsoleMessage('خطأ في الحفظ: ' + result.error, 'error');
      }
    } catch (error) {
      addConsoleMessage('خطأ في الحفظ: ' + error, 'error');
    }
  };

  const handleOpen = async () => {
    if (!window.wahyAPI) return;
    
    if (isUnsaved) {
      const confirm = window.confirm('هل تريد فتح ملف جديد؟ ستفقد التغييرات غير المحفوظة.');
      if (!confirm) return;
    }
    
    try {
      const result = await window.wahyAPI.openFile();
      if (result.success) {
        setCode(result.content);
        setCurrentFile(result.filePath);
        setIsUnsaved(false);
        addConsoleMessage('تم فتح الملف: ' + result.fileName);
      } else if (!result.canceled) {
        addConsoleMessage('خطأ في فتح الملف: ' + result.error, 'error');
      }
    } catch (error) {
      addConsoleMessage('خطأ في فتح الملف: ' + error, 'error');
    }
  };

  const handleExport = async () => {
    if (!result?.combinedOutput && !result?.html) {
      addConsoleMessage('لا يوجد محتوى للتصدير. قم بتشغيل الكود أولاً.', 'warning');
      return;
    }

    if (!window.wahyAPI) return;
    
    try {
      const htmlContent = result.combinedOutput || result.html || '';
      const projectName = currentFile ? 
        currentFile.split('/').pop()?.replace('.wahy', '') || 'مشروع-وحي' : 
        'مشروع-وحي';
        
      const exportResult = await window.wahyAPI.exportHTML(htmlContent, projectName);
      if (exportResult.success) {
        addConsoleMessage('تم تصدير HTML بنجاح: ' + exportResult.filePath);
      } else if (!exportResult.canceled) {
        addConsoleMessage('خطأ في التصدير: ' + exportResult.error, 'error');
      }
    } catch (error) {
      addConsoleMessage('خطأ في التصدير: ' + error, 'error');
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      addConsoleMessage('لا يوجد كود للتشغيل', 'warning');
      return;
    }

    if (!window.wahyAPI) {
      addConsoleMessage('API غير متوفر', 'error');
      return;
    }

    setIsRunning(true);
    addConsoleMessage('جاري تشغيل الكود...');

    try {
      const interpretResult = await window.wahyAPI.interpretCode(code);
      setResult(interpretResult);

      if (interpretResult.success) {
        const finalOutput = interpretResult.combinedOutput || interpretResult.html || '';
        setOutput(finalOutput);
        addConsoleMessage('تم تشغيل الكود بنجاح');
        
        if (interpretResult.warnings && interpretResult.warnings.length > 0) {
          interpretResult.warnings.forEach(warning => {
            addConsoleMessage('تحذير: ' + warning, 'warning');
          });
        }
      } else {
        addConsoleMessage('خطأ في الكود: ' + interpretResult.error, 'error');
        setOutput('');
      }
    } catch (error) {
      addConsoleMessage('خطأ في التشغيل: ' + error, 'error');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const addConsoleMessage = (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('ar');
    const formattedMessage = `[${timestamp}] ${message}`;
    setConsoleOutput(prev => [...prev, `${type}:${formattedMessage}`]);
  };

  const loadExample = (exampleName: string) => {
    setCode(WAHY_EXAMPLES[exampleName as keyof typeof WAHY_EXAMPLES]);
    setCurrentFile(null);
    setIsUnsaved(true);
  };

  const getTitle = () => {
    const fileName = currentFile ? currentFile.split('/').pop() : 'مشروع جديد';
    return `${fileName}${isUnsaved ? ' *' : ''} - Wahy Desktop`;
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
      {/* شريط الأدوات */}
      <div className="toolbar">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-primary" 
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? <div className="spinner" /> : <Play size={16} />}
            {isRunning ? 'جاري التشغيل...' : 'تشغيل'}
          </button>
          
          <div className="h-6 w-px bg-[var(--border-color)]" />
          
          <button className="btn" onClick={handleNewProject}>
            <FileText size={16} />
            جديد
          </button>
          
          <button className="btn" onClick={handleOpen}>
            <FolderOpen size={16} />
            فتح
          </button>
          
          <button className="btn" onClick={handleSave}>
            <Save size={16} />
            حفظ
          </button>
          
          <button className="btn" onClick={handleExport}>
            <Download size={16} />
            تصدير HTML
          </button>
          
          <div className="h-6 w-px bg-[var(--border-color)]" />
          
          <button 
            className="btn" 
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'فاتح' : 'داكن'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select 
            className="btn"
            onChange={(e) => loadExample(e.target.value)}
            value=""
          >
            <option value="">اختر مثال...</option>
            {Object.keys(WAHY_EXAMPLES).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden">
        {/* محرر الكود */}
        <div className="panel flex-1">
          <div className="panel-header">
            <span>محرر الكود - {getTitle()}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">
                أسطر: {code.split('\n').length}
              </span>
              <span className="text-sm text-muted">
                أحرف: {code.length}
              </span>
            </div>
          </div>
          <div className="panel-content">
            <Editor
              height="100%"
              language="plaintext"
              theme={isDarkMode ? 'vs-dark' : 'vs-light'}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: 14,
                lineNumbers: 'on',
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: 'Consolas, "Courier New", monospace',
                selectOnLineNumbers: true,
                quickSuggestions: false,
                parameterHints: { enabled: false },
                suggestOnTriggerCharacters: false,
                acceptSuggestionOnEnter: 'off',
                tabCompletion: 'off',
                wordBasedSuggestions: false,
              }}
            />
          </div>
        </div>

        {/* نافذة المعاينة والمخرجات */}
        <div className="panel" style={{ width: '45%' }}>
          <div className="panel-header">
            <div className="flex items-center gap-4">
              <button 
                className={`btn ${activeTab === 'preview' ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye size={16} />
                معاينة
              </button>
              <button 
                className={`btn ${activeTab === 'html' ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab('html')}
                disabled={!result?.html}
              >
                <Code size={16} />
                HTML
              </button>
              <button 
                className={`btn ${activeTab === 'css' ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab('css')}
                disabled={!result?.css}
              >
                <Settings size={16} />
                CSS
              </button>
              <button 
                className={`btn ${activeTab === 'js' ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab('js')}
                disabled={!result?.javascript}
              >
                <Terminal size={16} />
                JS
              </button>
            </div>
            
            <button 
              className="btn"
              onClick={() => {
                setOutput('');
                setResult(null);
              }}
            >
              <RotateCcw size={16} />
              مسح
            </button>
          </div>
          
          <div className="panel-content">
            {activeTab === 'preview' && (
              <div className="h-full">
                {output ? (
                  <iframe
                    ref={previewRef}
                    srcDoc={output}
                    className="w-full h-full border-0"
                    title="معاينة الكود"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
                    <div className="text-center">
                      <Eye size={48} className="mx-auto mb-4 opacity-50" />
                      <p>شغّل الكود لرؤية النتيجة</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'html' && result?.html && (
              <Editor
                height="100%"
                language="html"
                theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                value={result.html}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                }}
              />
            )}
            
            {activeTab === 'css' && result?.css && (
              <Editor
                height="100%"
                language="css"
                theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                value={result.css}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                }}
              />
            )}
            
            {activeTab === 'js' && result?.javascript && (
              <Editor
                height="100%"
                language="javascript"
                theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                value={result.javascript}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* شريط وحدة التحكم */}
      {showConsole && (
        <div className="panel" style={{ height: '150px' }}>
          <div className="panel-header">
            <span>وحدة التحكم</span>
            <div className="flex items-center gap-2">
              <button 
                className="btn btn-sm"
                onClick={() => setConsoleOutput([])}
              >
                مسح
              </button>
              <button 
                className="btn btn-sm"
                onClick={() => setShowConsole(false)}
              >
                <Minimize size={14} />
                إخفاء
              </button>
            </div>
          </div>
          <div className="panel-content p-2">
            <div className="h-full overflow-auto bg-[var(--editor-bg)] border border-[var(--border-color)] rounded p-2 font-mono text-sm">
              {consoleOutput.length === 0 ? (
                <div className="text-[var(--text-muted)]">وحدة التحكم جاهزة...</div>
              ) : (
                consoleOutput.map((message, index) => {
                  const [type, content] = message.split(':', 2);
                  return (
                    <div 
                      key={index} 
                      className={`mb-1 ${
                        type === 'error' ? 'text-error' : 
                        type === 'warning' ? 'text-warning' : 
                        'text-[var(--text-primary)]'
                      }`}
                    >
                      {content}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* شريط الحالة */}
      <div className="status-bar">
        <div className="flex items-center gap-4">
          <span>جاهز</span>
          {result && (
            <span className={result.success ? 'text-success' : 'text-error'}>
              {result.success ? 'تم التشغيل بنجاح' : 'خطأ في الكود'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!showConsole && (
            <button 
              className="text-sm hover:text-[var(--accent-color)] cursor-pointer"
              onClick={() => setShowConsole(true)}
            >
              <Terminal size={14} className="inline mr-1" />
              إظهار وحدة التحكم
            </button>
          )}
          <span>لغة وحي Desktop v1.0.0-alpha</span>
        </div>
      </div>
    </div>
  );
}