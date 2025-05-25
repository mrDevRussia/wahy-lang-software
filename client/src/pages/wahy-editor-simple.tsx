import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWahyInterpreter } from "@/hooks/use-wahy-interpreter";
import MonacoEditor from "@/components/ui/monaco-editor";
import { 
  Play, 
  Save, 
  Download, 
  RefreshCw, 
  Plus,
  FileCode,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { WahyFile } from "@shared/schema";

export default function WahyEditorSimple() {
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("input.wahy");
  const [previewKey, setPreviewKey] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
    onError: () => {
      toast({
        title: "فشل في الحفظ",
        description: "حدث خطأ أثناء حفظ الملف",
        variant: "destructive",
      });
    },
  });

  // Create new file mutation
  const createFileMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest("POST", "/api/files", { 
        name, 
        content: `افتح "${name.replace('.wahy', '')}"\n\nعنوان "مرحباً بالعالم"\nفقرة "هذا مثال بسيط بلغة وحي"\n\nأغلق` 
      });
    },
    onSuccess: (newFile: any) => {
      setCurrentFileId(newFile.id);
      setFileName(newFile.name);
      setCode(newFile.content);
      toast({
        title: "تم إنشاء الملف",
        description: "تم إنشاء ملف جديد بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
  });

  // Load file content when file changes
  useEffect(() => {
    if (currentFile && typeof currentFile === 'object' && 'content' in currentFile) {
      setCode(currentFile.content as string);
      setFileName(currentFile.name as string);
    }
  }, [currentFile]);

  const handleFileSelect = (file: WahyFile) => {
    setCurrentFileId(file.id);
  };

  const handleSave = () => {
    if (currentFileId) {
      saveFileMutation.mutate({ id: currentFileId, name: fileName, content: code });
    } else {
      saveFileMutation.mutate({ name: fileName, content: code });
    }
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

  // Commands Panel
  const commands = [
    { name: "افتح صفحة", example: 'افتح "عنوان الصفحة"', category: "صفحة" },
    { name: "أغلق صفحة", example: "أغلق", category: "صفحة" },
    { name: "عنوان", example: 'عنوان "النص"', category: "محتوى" },
    { name: "عنوان فرعي", example: 'عنوان_فرعي "النص"', category: "محتوى" },
    { name: "فقرة", example: 'فقرة "النص"', category: "محتوى" },
    { name: "رابط", example: 'رابط "النص" "الرابط"', category: "محتوى" },
    { name: "صورة", example: 'صورة "الرابط" "الوصف"', category: "محتوى" },
    { name: "زر", example: 'زر "النص" "primary"', category: "تفاعل" },
    { name: "حقل إدخال", example: 'حقل_إدخال "النص" "text"', category: "تفاعل" },
    { name: "تنبيه", example: 'تنبيه "النص" "success"', category: "تفاعل" },
    { name: "بطاقة", example: 'بطاقة "العنوان" "المحتوى"', category: "تفاعل" },
    { name: "عداد", example: 'عداد 0 "التسمية"', category: "تفاعل" },
    { name: "ابدأ قائمة", example: "ابدأ_قائمة", category: "قوائم" },
    { name: "عنصر", example: 'عنصر "النص"', category: "قوائم" },
    { name: "أنهِ قائمة", example: "أنهِ_قائمة", category: "قوائم" },
    { name: "خط فاصل", example: "خط_فاصل", category: "تخطيط" },
    { name: "مسافة", example: "مسافة", category: "تخطيط" },
    { name: "لون الخلفية", example: 'لون_الخلفية "lightblue"', category: "تنسيق" },
    { name: "لون النص", example: 'لون_النص "darkblue"', category: "تنسيق" }
  ];

  const insertCommand = (command: string) => {
    setCode(prev => prev + command + '\n');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <h1 className="text-xl font-bold text-slate-800">🪄 محرر لغة وَحي</h1>
            <span className="text-sm text-slate-500">المفسر المحسن</span>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button
              onClick={handleCreateNewFile}
              disabled={createFileMutation.isPending}
              variant="outline"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="h-4 w-4" />
              <span>ملف جديد</span>
            </Button>
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
        {/* Sidebar with Files */}
        <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">الملفات</h3>
            <div className="space-y-2">
              {Array.isArray(files) && files.map((file: WahyFile) => (
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
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Commands Panel */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-2">🪄 أوامر لغة وَحي</h2>
            <p className="text-sm text-gray-600">اضغط على الأمر لإضافته</p>
          </div>
          
          <div className="p-4 space-y-4">
            {["صفحة", "محتوى", "تفاعل", "قوائم", "تخطيط", "تنسيق"].map(category => (
              <Card key={category} className="border border-gray-200">
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold mb-3">{category}</h3>
                  <div className="space-y-2">
                    {commands
                      .filter(cmd => cmd.category === category)
                      .map((command) => (
                        <div key={command.name} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{command.name}</div>
                            <code className="text-xs text-gray-600 bg-gray-100 px-1 rounded block">
                              {command.example}
                            </code>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => insertCommand(command.example)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Editor and Preview */}
        <main className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-slate-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {fileName}
                </span>
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-slate-400">
                  <span>{code.split('\n').length} سطر</span>
                  <span>•</span>
                  <span>{code.length} حرف</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <MonacoEditor
                value={code}
                onChange={setCode}
                language="wahy"
                theme="vs"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  rtl: true,
                }}
              />
            </div>

            {/* Status Bar */}
            <div className="bg-slate-800 text-white px-4 py-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  {result?.success ? (
                    <div className="flex items-center space-x-2 space-x-reverse text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>تم التفسير بنجاح</span>
                    </div>
                  ) : result?.error ? (
                    <div className="flex items-center space-x-2 space-x-reverse text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>خطأ: {result.error}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">جاهز</span>
                  )}
                </div>
                <div className="text-slate-400">
                  لغة وَحي • المفسر المحسن
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 border-l border-slate-200 bg-white">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">المعاينة</span>
                <Button
                  onClick={() => setPreviewKey(prev => prev + 1)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="h-full overflow-auto">
              {result?.success && result.html ? (
                <iframe
                  key={previewKey}
                  srcDoc={result.html}
                  className="w-full h-full border-none"
                  title="معاينة لغة وحي"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <Play className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">معاينة النتيجة</p>
                    <p className="text-sm">اضغط "تشغيل" لرؤية النتيجة هنا</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}