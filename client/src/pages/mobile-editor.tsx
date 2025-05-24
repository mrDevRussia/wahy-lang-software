import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWahyInterpreter } from "@/hooks/use-wahy-interpreter";
import { WahyCommands } from "@/lib/wahy-commands";
import { 
  Play, 
  Save, 
  Download, 
  Menu,
  X,
  FileCode,
  Plus,
  CheckCircle,
  AlertCircle,
  Eye,
  Code2,
  Smartphone,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { useLocation } from "wouter";
import type { WahyFile } from "@shared/schema";

export default function MobileEditor() {
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("input.wahy");
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'files'>('editor');
  const [showCommands, setShowCommands] = useState(false);
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const commands = new WahyCommands();
  
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
        title: "تم الحفظ",
        description: "تم حفظ الملف بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الملف",
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
    onSuccess: async (response) => {
      const newFile = await response.json();
      setCurrentFileId(newFile.id);
      setFileName(newFile.name);
      setCode(newFile.content);
      toast({
        title: "تم إنشاء الملف",
        description: "ملف جديد جاهز للتعديل",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      setActiveTab('editor');
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الملف",
        variant: "destructive",
      });
    },
  });

  // Load initial file
  useEffect(() => {
    if (Array.isArray(files) && files.length > 0 && !currentFileId) {
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
    setActiveTab('preview');
  };

  const handleDownload = () => {
    if (result?.success && result.html) {
      downloadHtml(code, fileName.replace('.wahy', '.html'));
    } else {
      toast({
        title: "لا يوجد محتوى",
        description: "قم بتشغيل الكود أولاً",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewFile = () => {
    const newFileName = `ملف_${Date.now()}.wahy`;
    createFileMutation.mutate(newFileName);
  };

  const handleFileSelect = (file: WahyFile) => {
    setCurrentFileId(file.id);
    setFileName(file.name);
    setCode(file.content);
    setActiveTab('editor');
  };

  const insertCommand = (command: string) => {
    setCode(prev => prev + (prev ? '\n' : '') + command);
    setShowCommands(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white" dir="rtl">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Smartphone className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-bold">Wahy وَحي</h1>
              <p className="text-xs text-blue-100">محرر الجوال</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              onClick={() => setLocation('/tutorial')}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-blue-500"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveFileMutation.isPending}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-blue-500"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleRun}
              disabled={isInterpreting}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-blue-500"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'editor' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-500'
            }`}
          >
            <Code2 className="h-4 w-4 mx-auto mb-1" />
            المحرر
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'preview' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-500'
            }`}
          >
            <Eye className="h-4 w-4 mx-auto mb-1" />
            المعاينة
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'files' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-500'
            }`}
          >
            <FileCode className="h-4 w-4 mx-auto mb-1" />
            الملفات
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="h-full flex flex-col">
            {/* Editor Toolbar */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{fileName}</span>
                <Button
                  onClick={() => setShowCommands(!showCommands)}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {showCommands ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
                  الأوامر
                </Button>
              </div>
            </div>

            {/* Commands Panel */}
            {showCommands && (
              <div className="p-3 bg-blue-50 border-b border-blue-200 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {commands.getCommandGroups().map((group, index) => (
                    <div key={index}>
                      <h4 className="text-xs font-semibold text-blue-800 mb-1">{group.title}</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {group.commands.slice(0, 3).map((command, cmdIndex) => (
                          <button
                            key={cmdIndex}
                            onClick={() => insertCommand(command)}
                            className="text-xs p-2 bg-white rounded border border-blue-200 text-blue-700 hover:bg-blue-100 text-right"
                          >
                            {command}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Textarea */}
            <div className="flex-1 p-3">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full border border-gray-300 rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="اكتب كود لغة وحي هنا..."
                dir="rtl"
              />
            </div>

            {/* Status Bar */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 space-x-reverse">
                  {result?.success === false ? (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">خطأ في الكود</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">جاهز</span>
                    </>
                  )}
                </div>
                <div className="text-gray-500">
                  {code ? code.split('\n').length : 0} سطر
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-full flex flex-col">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">معاينة النتيجة</span>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading || !result?.success}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-3 w-3 ml-1" />
                  تحميل
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-3">
              {isInterpreting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-500">جاري التفسير...</p>
                  </div>
                </div>
              ) : result?.success ? (
                <iframe
                  srcDoc={result.html}
                  className="w-full h-full border border-gray-300 rounded-lg"
                  sandbox="allow-scripts allow-same-origin"
                  title="Preview"
                />
              ) : result?.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                    <h3 className="font-semibold text-red-700">خطأ في الكود</h3>
                  </div>
                  <p className="text-red-600 text-sm">{result.error}</p>
                  {result.lineNumber && (
                    <p className="text-red-500 text-xs mt-1">السطر: {result.lineNumber}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>اضغط "تشغيل" لرؤية النتيجة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="h-full flex flex-col">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ملفاتي</span>
                <Button
                  onClick={handleCreateNewFile}
                  disabled={createFileMutation.isPending}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-3 w-3 ml-1" />
                  جديد
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {Array.isArray(files) && files.map((file: WahyFile) => (
                  <Card 
                    key={file.id}
                    className={`cursor-pointer transition-colors ${
                      currentFileId === file.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FileCode className={`h-4 w-4 ${
                            currentFileId === file.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            currentFileId === file.id ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {file.name}
                          </span>
                        </div>
                        {currentFileId === file.id && (
                          <Badge variant="secondary" className="text-xs">
                            نشط
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {file.content.split('\n')[0] || 'ملف فارغ'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}