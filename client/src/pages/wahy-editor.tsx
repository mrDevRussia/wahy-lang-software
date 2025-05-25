import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWahyInterpreter } from "@/hooks/use-wahy-interpreter";
import { useSmartSuggestions } from "@/hooks/use-smart-suggestions";
import { WahyCommands } from "@/lib/wahy-commands";
import MonacoEditor from "@/components/ui/monaco-editor";
import SmartSuggestions from "@/components/ui/smart-suggestions";
import { 
  Play, 
  Save, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  Plus,
  FileCode,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Code,
  CheckCircle,
  AlertCircle,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { Link } from "wouter";
import type { WahyFile } from "@shared/schema";

export default function WahyEditor() {
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("input.wahy");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [previewKey, setPreviewKey] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const commands = new WahyCommands();
  
  // Smart suggestions hook
  const { suggestions, userPatterns, isAnalyzing } = useSmartSuggestions(code, cursorPosition.column);
  
  // Fetch all files
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ["/api/files"],
  });

  // Load current file content
  const { data: currentFile } = useQuery({
    queryKey: ["/api/files", currentFileId],
    enabled: !!currentFileId,
  });

  // Interpreter hook
  const { 
    interpretCode, 
    downloadHtml, 
    isInterpreting, 
    isDownloading,
    result 
  } = useWahyInterpreter();

  // Save file mutation
  const saveFileMutation = useMutation({
    mutationFn: async (data: { id?: number; name: string; content: string }) => {
      if (data.id) {
        return apiRequest("PUT", `/api/files/${data.id}`, { 
          name: data.name, 
          content: data.content 
        });
      } else {
        return apiRequest("POST", "/api/files", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الملف بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "فشل في حفظ الملف",
        variant: "destructive",
      });
    },
  });

  // Create new file mutation
  const createFileMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest("POST", "/api/files", { 
        name, 
        content: commands.getDefaultTemplate() 
      });
    },
    onSuccess: (response) => {
      const newFile = response.json();
      setCurrentFileId(newFile.id);
      setFileName(newFile.name);
      setCode(newFile.content);
      toast({
        title: "تم إنشاء الملف",
        description: "تم إنشاء ملف جديد بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الإنشاء",
        description: error.message || "فشل في إنشاء الملف",
        variant: "destructive",
      });
    },
  });

  // Load initial file
  useEffect(() => {
    if (files.length > 0 && !currentFileId) {
      const firstFile = files[0];
      setCurrentFileId(firstFile.id);
      setFileName(firstFile.name);
      setCode(firstFile.content);
    }
  }, [files, currentFileId]);

  // Update code when current file changes
  useEffect(() => {
    if (currentFile) {
      setCode(currentFile.content);
      setFileName(currentFile.name);
    }
  }, [currentFile]);

  const handleSave = () => {
    saveFileMutation.mutate({
      id: currentFileId || undefined,
      name: fileName,
      content: code,
    });
  };

  const handleRun = () => {
    interpretCode(code);
    setPreviewKey(prev => prev + 1);
  };

  const handleDownload = () => {
    if (result?.success && result.html) {
      downloadHtml({ code, filename: fileName.replace('.wahy', '.html') });
    } else {
      toast({
        title: "لا يوجد محتوى للتحميل",
        description: "قم بتشغيل الكود أولاً للحصول على النتيجة",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewFile = () => {
    const newFileName = `ملف_جديد_${Date.now()}.wahy`;
    createFileMutation.mutate(newFileName);
  };

  const handleFileSelect = (file: WahyFile) => {
    setCurrentFileId(file.id);
    setFileName(file.name);
    setCode(file.content);
  };

  const refreshPreview = () => {
    if (code.trim()) {
      interpretCode(code);
      setPreviewKey(prev => prev + 1);
    }
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Wahy وَحي</h1>
                <p className="text-xs text-slate-500">مفسر اللغة العربية لبرمجة الويب</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <Link href="/guide">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                <BookOpen className="h-4 w-4 ml-1" />
                دليل الاستخدام
              </Button>
            </Link>
            <Link href="/tutorial">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                <HelpCircle className="h-4 w-4 ml-1" />
                دروس تفاعلية
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={saveFileMutation.isPending}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Save className="h-4 w-4" />
              <span>حفظ</span>
            </Button>
            <Button
              onClick={handleRun}
              disabled={isInterpreting}
              className="flex items-center space-x-2 space-x-reverse bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="h-4 w-4" />
              <span>تشغيل</span>
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !result?.success}
              variant="outline"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Download className="h-4 w-4" />
              <span>تحميل HTML</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 h-0">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col">
          {/* File Explorer */}
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">الملفات</h3>
            <div className="space-y-2">
              {files.map((file: WahyFile) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg cursor-pointer ${
                    currentFileId === file.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <FileCode className={`h-4 w-4 ${
                    currentFileId === file.id ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <span className={`text-sm font-medium flex-1 ${
                    currentFileId === file.id ? 'text-blue-800' : 'text-slate-600'
                  }`}>
                    {file.name}
                  </span>
                  {currentFileId === file.id && (
                    <Badge variant="secondary" className="text-xs text-blue-600">
                      نشط
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleCreateNewFile}
              disabled={createFileMutation.isPending}
              variant="outline"
              className="w-full mt-3 border-2 border-dashed"
            >
              <Plus className="h-4 w-4 ml-2" />
              ملف جديد
            </Button>
          </div>

          {/* Command Reference */}
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">مرجع الأوامر</h3>
            <div className="space-y-3">
              {commands.getCommandGroups().map((group, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <h4 className="text-xs font-semibold text-slate-600 mb-2">{group.title}</h4>
                    <div className="space-y-1">
                      {group.commands.map((command, cmdIndex) => (
                        <div key={cmdIndex} className="text-xs font-mono text-emerald-600">
                          {command}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-2 space-x-reverse text-sm">
              <div className={`w-2 h-2 rounded-full ${
                result?.success === false ? 'bg-red-500' : 'bg-emerald-500'
              }`} />
              <span className="text-slate-600">
                {isInterpreting 
                  ? 'جاري التفسير...' 
                  : result?.success === false 
                    ? 'يوجد أخطاء' 
                    : 'جاهز للتشغيل'
                }
              </span>
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">محرر الكود</h2>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-slate-500">
                  <span>{lineCount} سطر</span>
                  <span>•</span>
                  <span>{charCount} حرف</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <MonacoEditor
                value={code}
                onChange={setCode}
                onCursorPositionChange={setCursorPosition}
                language="wahy"
                theme="wahy-theme"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Monaco', 'Consolas', monospace",
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  renderWhitespace: 'selection',
                  tabSize: 2,
                  insertSpaces: true,
                }}
              />
            </div>

            {/* Status Bar */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span>لغة: Wahy</span>
                  <span>الترميز: UTF-8</span>
                  <span>السطر {cursorPosition.line}، العمود {cursorPosition.column}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {result?.success === false ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">
                        خطأ في السطر {result.lineNumber}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>لا توجد أخطاء</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="w-1/2 border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">المعاينة المباشرة</h2>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button
                    onClick={refreshPreview}
                    disabled={isInterpreting}
                    size="sm"
                    variant="ghost"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (result?.html) {
                        const blob = new Blob([result.html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      }
                    }}
                    disabled={!result?.success}
                    size="sm"
                    variant="ghost"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white">
              <div className="w-full h-full border-2 border-dashed border-slate-200 flex flex-col">
                {/* Preview Header */}
                <div className="bg-slate-50 p-2 border-b border-slate-200 text-xs text-slate-500 flex items-center space-x-2 space-x-reverse">
                  <Globe className="h-4 w-4" />
                  <span>localhost:5000/output.html</span>
                </div>
                
                {/* Preview Content */}
                <div className="flex-1 overflow-auto">
                  {isInterpreting ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                        <p className="text-slate-500">جاري التفسير...</p>
                      </div>
                    </div>
                  ) : result?.success ? (
                    <iframe
                      key={previewKey}
                      srcDoc={result.html}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                      title="Preview"
                    />
                  ) : result?.error ? (
                    <div className="p-6 text-center">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-700 mb-2">خطأ في الكود</h3>
                      <p className="text-red-600 mb-2">{result.error}</p>
                      {result.lineNumber && (
                        <p className="text-sm text-red-500">السطر: {result.lineNumber}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-500">اضغط "تشغيل" لمعاينة النتيجة</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="p-3 bg-slate-100 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  {result ? 'آخر تحديث: منذ ثانيتين' : 'لم يتم التشغيل بعد'}
                </span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button size="sm" variant="outline" className="px-2 py-1">
                    <Smartphone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="px-2 py-1">
                    <Tablet className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="secondary" className="px-2 py-1">
                    <Monitor className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
