/**
 * ملعب لغة وحي التفاعلي
 * Interactive Wahy Language Playground
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, BookOpen, Code, Lightbulb, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { WahyTutorials, Tutorial, TutorialStep } from '@/lib/wahy-tutorials';
import { useToast } from '@/hooks/use-toast';
import MonacoEditor from '@monaco-editor/react';

const tutorials = new WahyTutorials();

export default function WahyPlayground() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const allTutorials = tutorials.getAllTutorials();
    if (allTutorials.length > 0) {
      setSelectedTutorial(allTutorials[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedTutorial && selectedTutorial.steps.length > 0) {
      const step = selectedTutorial.steps[currentStepIndex];
      setCurrentStep(step);
      setUserCode(step.code);
      setEvaluation(null);
    }
  }, [selectedTutorial, currentStepIndex]);

  const runCode = async () => {
    if (!userCode.trim()) {
      toast({
        title: "لا يوجد كود",
        description: "يرجى كتابة بعض الأكواد أولاً",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: userCode }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.html || result.combinedOutput || '');
        toast({
          title: "تم تشغيل الكود بنجاح!",
          description: "يمكنك رؤية النتيجة في نافذة المعاينة",
        });
      } else {
        toast({
          title: "خطأ في الكود",
          description: result.error || "حدث خطأ أثناء تشغيل الكود",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "تعذر الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const evaluateCode = () => {
    if (!currentStep) return;

    const result = tutorials.evaluateCode(currentStep.id, userCode);
    setEvaluation(result);

    if (result.correct) {
      if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps([...completedSteps, currentStep.id]);
      }
      toast({
        title: "ممتاز!",
        description: "كودك صحيح ومطابق للمطلوب",
      });
    } else {
      toast({
        title: "يحتاج لتحسين",
        description: "راجع الملاحظات لتحسين كودك",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (selectedTutorial && currentStepIndex < selectedTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetCode = () => {
    if (currentStep) {
      setUserCode(currentStep.code);
      setEvaluation(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'متقدم': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'html': return '🏗️';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'mixed': return '🌟';
      default: return '📚';
    }
  };

  const getProgress = () => {
    if (!selectedTutorial) return 0;
    return tutorials.calculateProgress(completedSteps, selectedTutorial.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ملعب لغة وحي التفاعلي</h1>
          <p className="text-xl text-gray-600">تعلم البرمجة بالعربية خطوة بخطوة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* قائمة الدروس */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  الدروس التعليمية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {tutorials.getAllTutorials().map((tutorial) => {
                      const progress = tutorials.calculateProgress(completedSteps, tutorial.id);
                      const isSelected = selectedTutorial?.id === tutorial.id;
                      
                      return (
                        <div
                          key={tutorial.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setSelectedTutorial(tutorial);
                            setCurrentStepIndex(0);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(tutorial.category)}</span>
                            <h3 className="font-semibold text-sm">{tutorial.title}</h3>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getDifficultyColor(tutorial.difficulty)}>
                              {tutorial.difficulty}
                            </Badge>
                            <span className="text-xs text-gray-500">{tutorial.duration}</span>
                          </div>
                          
                          <div className="mb-2">
                            <Progress value={progress.percentage} className="h-2" />
                            <span className="text-xs text-gray-500">
                              {progress.completedSteps} / {progress.totalSteps} خطوات
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {tutorial.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* منطقة الدرس والكود */}
          <div className="lg:col-span-2">
            {selectedTutorial && currentStep ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      {currentStep.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(currentStep.difficulty)}>
                      {currentStep.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      الخطوة {currentStepIndex + 1} من {selectedTutorial.steps.length}
                    </span>
                    <Progress 
                      value={((currentStepIndex + 1) / selectedTutorial.steps.length) * 100} 
                      className="h-2 flex-1" 
                    />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="description">الشرح</TabsTrigger>
                      <TabsTrigger value="code">الكود</TabsTrigger>
                      <TabsTrigger value="hints">التلميحات</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="mt-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {currentStep.description}
                        </p>
                        
                        {currentStep.concepts.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">المفاهيم في هذه الخطوة:</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentStep.concepts.map((concept, index) => (
                                <Badge key={index} variant="outline">
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code" className="mt-4">
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <MonacoEditor
                            height="300px"
                            language="text"
                            theme="vs-light"
                            value={userCode}
                            onChange={(value: string | undefined) => setUserCode(value || '')}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              lineNumbers: 'on',
                              wordWrap: 'on',
                              fontFamily: 'Monaco, "Courier New", monospace',
                            }}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={runCode} disabled={loading}>
                            <Play className="w-4 h-4 mr-2" />
                            {loading ? 'جاري التشغيل...' : 'تشغيل الكود'}
                          </Button>
                          
                          <Button onClick={evaluateCode} variant="outline">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            تقييم الكود
                          </Button>
                          
                          <Button onClick={resetCode} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            إعادة تعيين
                          </Button>
                        </div>
                        
                        {evaluation && (
                          <div className={`p-4 rounded-lg border ${
                            evaluation.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {evaluation.correct ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                              <h4 className="font-semibold">نتيجة التقييم</h4>
                            </div>
                            
                            <div className="space-y-2">
                              {evaluation.feedback.map((feedback: string, index: number) => (
                                <p key={index} className="text-sm">{feedback}</p>
                              ))}
                              
                              {evaluation.suggestions.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-sm mt-3 mb-1">اقتراحات:</h5>
                                  <ul className="text-sm space-y-1">
                                    {evaluation.suggestions.map((suggestion: string, index: number) => (
                                      <li key={index} className="list-disc list-inside">{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hints" className="mt-4">
                      <div className="space-y-3">
                        {currentStep.hints.map((hint, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-yellow-800">{hint}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button 
                      onClick={previousStep} 
                      disabled={currentStepIndex === 0}
                      variant="outline"
                    >
                      الخطوة السابقة
                    </Button>
                    
                    <Button 
                      onClick={nextStep} 
                      disabled={currentStepIndex === selectedTutorial.steps.length - 1}
                    >
                      الخطوة التالية
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">اختر درساً للبدء</h3>
                    <p className="text-gray-500">اختر أحد الدروس من القائمة للبدء في التعلم</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* نافذة المعاينة */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>معاينة النتيجة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white min-h-96">
                  {output ? (
                    <iframe
                      srcDoc={output}
                      className="w-full h-96 border-0"
                      title="معاينة الكود"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>شغّل الكود لرؤية النتيجة</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}