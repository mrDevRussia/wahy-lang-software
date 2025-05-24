import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Code, 
  Smartphone,
  CheckCircle,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

const tutorialSteps = [
  {
    title: "مرحباً بك في لغة وحي",
    icon: <BookOpen className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          لغة وحي هي أول لغة برمجة عربية مصممة خصيصاً لتعلم برمجة الويب. 
          تستطيع من خلالها إنشاء صفحات ويب باستخدام أوامر بسيطة باللغة العربية.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">لماذا لغة وحي؟</h4>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• سهلة التعلم للمبتدئين</li>
            <li>• أوامر باللغة العربية</li>
            <li>• تولد كود HTML فوري</li>
            <li>• مثالية لتعلم أساسيات الويب</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "الأوامر الأساسية",
    icon: <Code className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">كل برنامج في لغة وحي يبدأ وينتهي بهذين الأمرين:</p>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">🟢 بداية البرنامج</h4>
          <code className="bg-white p-2 rounded border text-green-700 block font-mono">
            افتح صفحة "عنوان الصفحة"
          </code>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">🔴 نهاية البرنامج</h4>
          <code className="bg-white p-2 rounded border text-red-700 block font-mono">
            أغلق صفحة
          </code>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-yellow-800">تذكر:</span>
          </div>
          <p className="text-yellow-700 text-sm">
            كل برنامج يجب أن يبدأ بـ "افتح صفحة" وينتهي بـ "أغلق صفحة"
          </p>
        </div>
      </div>
    )
  },
  {
    title: "إضافة المحتوى",
    icon: <Target className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">بعد فتح الصفحة، يمكنك إضافة محتوى متنوع:</p>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-50 p-3 rounded border">
            <h5 className="font-semibold text-gray-800 mb-1">العناوين</h5>
            <code className="text-sm text-blue-600 block font-mono">أضف عنوان "مرحباً بالعالم"</code>
            <code className="text-sm text-blue-600 block font-mono">أضف عنوان_فرعي "عنوان فرعي"</code>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h5 className="font-semibold text-gray-800 mb-1">النصوص</h5>
            <code className="text-sm text-green-600 block font-mono">أضف فقرة "هذا نص الفقرة"</code>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h5 className="font-semibold text-gray-800 mb-1">الروابط</h5>
            <code className="text-sm text-purple-600 block font-mono">أضف رابط "اسم الرابط" "https://example.com"</code>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h5 className="font-semibold text-gray-800 mb-1">القوائم</h5>
            <code className="text-sm text-orange-600 block font-mono">ابدأ قائمة</code>
            <code className="text-sm text-orange-600 block font-mono">أضف عنصر "العنصر الأول"</code>
            <code className="text-sm text-orange-600 block font-mono">أنهِ قائمة</code>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "تنسيق الصفحة",
    icon: <Zap className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">اجعل صفحتك أكثر جمالاً بتغيير الألوان والخط:</p>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-1">تغيير لون الخلفية</h5>
            <code className="text-sm text-blue-600 block font-mono">غيّر لون_الخلفية إلى "lightblue"</code>
            <p className="text-xs text-blue-600 mt-1">جرب: lightblue, lightgreen, lightyellow, pink</p>
          </div>

          <div className="bg-green-50 p-3 rounded border border-green-200">
            <h5 className="font-semibold text-green-800 mb-1">تغيير لون النص</h5>
            <code className="text-sm text-green-600 block font-mono">غيّر لون_النص إلى "darkblue"</code>
            <p className="text-xs text-green-600 mt-1">جرب: darkblue, red, green, purple</p>
          </div>

          <div className="bg-purple-50 p-3 rounded border border-purple-200">
            <h5 className="font-semibold text-purple-800 mb-1">تغيير نوع الخط</h5>
            <code className="text-sm text-purple-600 block font-mono">غيّر الخط إلى "Arial"</code>
            <p className="text-xs text-purple-600 mt-1">جرب: Arial, Times, Courier</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "مثال كامل",
    icon: <CheckCircle className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">هذا مثال كامل لبرنامج بسيط بلغة وحي:</p>
        
        <div className="bg-gray-900 p-4 rounded-lg border">
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap" dir="rtl">
{`افتح صفحة "موقعي الأول"

أضف عنوان "مرحباً بالعالم"
أضف فقرة "هذا أول برنامج لي بلغة وحي"

غيّر لون_الخلفية إلى "lightblue"
غيّر لون_النص إلى "darkblue"

ابدأ قائمة
أضف عنصر "سهل التعلم"
أضف عنصر "ممتع الاستخدام"
أضف عنصر "باللغة العربية"
أنهِ قائمة

أضف رابط "تعلم المزيد" "https://example.com"

أغلق صفحة`}
          </pre>
        </div>

        <div className="bg-green-50 p-3 rounded border border-green-200">
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">جرب الآن!</span>
          </div>
          <p className="text-green-700 text-sm">
            انسخ هذا الكود وجربه في المحرر
          </p>
        </div>
      </div>
    )
  },
  {
    title: "استخدام واجهة الهاتف",
    icon: <Smartphone className="h-6 w-6" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">على الهاتف، التطبيق منظم في ثلاثة تبويبات رئيسية:</p>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-2">📝 تبويبة المحرر</h5>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• اكتب كود لغة وحي هنا</li>
              <li>• اضغط "الأوامر" لرؤية قائمة الأوامر</li>
              <li>• اضغط على أي أمر لإدراجه تلقائياً</li>
            </ul>
          </div>

          <div className="bg-green-50 p-3 rounded border border-green-200">
            <h5 className="font-semibold text-green-800 mb-2">👁️ تبويبة المعاينة</h5>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• اضغط زر "تشغيل" لترى النتيجة</li>
              <li>• المعاينة تظهر الصفحة كما ستبدو على الويب</li>
              <li>• يمكنك تحميل الصفحة كملف HTML</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-3 rounded border border-purple-200">
            <h5 className="font-semibold text-purple-800 mb-2">📁 تبويبة الملفات</h5>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• اعرض جميع ملفاتك المحفوظة</li>
              <li>• اضغط على ملف لفتحه</li>
              <li>• أنشئ ملفات جديدة بزر "جديد"</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-yellow-800">نصائح للهاتف:</span>
          </div>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• استخدم الأزرار السريعة للأوامر</li>
            <li>• احفظ عملك بانتظام</li>
            <li>• تنقل بين التبويبات لرؤية النتيجة</li>
          </ul>
        </div>
      </div>
    )
  }
];

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToEditor = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">دليل تعلم لغة وحي</h1>
          <p className="text-gray-600">تعلم البرمجة باللغة العربية خطوة بخطوة</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              الخطوة {currentStep + 1} من {tutorialSteps.length}
            </span>
            <Badge variant="secondary">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Tutorial Card */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 space-x-reverse text-xl">
              {tutorialSteps[currentStep].icon}
              <span>{tutorialSteps[currentStep].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tutorialSteps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center space-x-2 space-x-reverse"
          >
            <ArrowRight className="h-4 w-4" />
            <span>السابق</span>
          </Button>

          <div className="flex space-x-2 space-x-reverse">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === tutorialSteps.length - 1 ? (
            <Button
              onClick={goToEditor}
              className="flex items-center space-x-2 space-x-reverse bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              <span>ابدأ البرمجة</span>
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <span>التالي</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Start Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={goToEditor}
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
          >
            تخطي الدليل والانتقال للمحرر
          </Button>
        </div>
      </div>
    </div>
  );
}