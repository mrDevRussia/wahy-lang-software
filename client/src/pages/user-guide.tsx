import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  BookOpen, 
  Code2, 
  Shield, 
  Key, 
  FileText, 
  Monitor,
  Globe,
  AlertTriangle,
  Star,
  Users,
  Github
} from "lucide-react";
import { Link } from "wouter";

export default function UserGuide() {
  const downloadWahyDesktop = () => {
    // إنشاء رابط تحميل مباشر لمجلد wahy-desktop
    const link = document.createElement('a');
    link.href = '/wahy-desktop.zip'; // سيتم إنشاؤه لاحقاً
    link.download = 'Wahy-Desktop-Alpha.zip';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              دليل استخدام لغة وحي
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            لغة البرمجة العربية المبتكرة لإنشاء صفحات الويب بسهولة وبساطة
          </p>
        </div>

        {/* Alpha Version Warning */}
        <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                  نسخة ألفا تجريبية - Alpha Version
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  هذه نسخة تجريبية من لغة وحي. قد تحتوي على أخطاء أو مشاكل. نرحب بتقاريركم وملاحظاتكم لتحسين التطبيق.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* ما هي لغة وحي؟ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  ما هي لغة وحي؟
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  لغة وحي هي لغة برمجة عربية مبتكرة مصممة خصيصاً للمطورين العرب. تمكنك من إنشاء صفحات الويب 
                  باستخدام أوامر عربية بسيطة وواضحة، مما يجعل البرمجة أكثر سهولة ومتعة.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">مميزات اللغة</h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• أوامر عربية بسيطة</li>
                      <li>• إنتاج HTML متقدم</li>
                      <li>• دعم CSS و JavaScript</li>
                      <li>• واجهة سهلة الاستخدام</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">الاستخدامات</h4>
                    <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                      <li>• تعلم البرمجة</li>
                      <li>• إنشاء المواقع البسيطة</li>
                      <li>• النماذج الأولية</li>
                      <li>• المشاريع التعليمية</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أمثلة الأوامر */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  أمثلة الأوامر الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">إنشاء صفحة ويب بسيطة:</h4>
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div>افتح صفحة "مرحباً بالعالم"</div>
                      <div>أضف عنوان "أهلاً وسهلاً!"</div>
                      <div>أضف فقرة "هذه أول صفحة لي بلغة وحي"</div>
                      <div>أغلق الصفحة</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">إضافة قائمة وروابط:</h4>
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div>ابدأ قائمة</div>
                      <div>أضف عنصر قائمة "الصفحة الرئيسية"</div>
                      <div>أضف عنصر قائمة "من نحن"</div>
                      <div>أنه القائمة</div>
                      <div>أضف رابط "زر موقعنا" "https://example.com"</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">تخصيص التصميم:</h4>
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div>غير لون الخلفية "أزرق فاتح"</div>
                      <div>غير لون النص "أبيض"</div>
                      <div>غير الخط "Arial"</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول الأوامر */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة الأوامر المتاحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-semibold">الأمر</th>
                        <th className="text-right p-3 font-semibold">الوصف</th>
                        <th className="text-right p-3 font-semibold">مثال</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="p-3 font-mono">افتح صفحة</td>
                        <td className="p-3">بدء صفحة ويب جديدة</td>
                        <td className="p-3 font-mono">افتح صفحة "عنوان الصفحة"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أضف عنوان</td>
                        <td className="p-3">إضافة عنوان رئيسي</td>
                        <td className="p-3 font-mono">أضف عنوان "مرحباً"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أضف عنوان فرعي</td>
                        <td className="p-3">إضافة عنوان فرعي</td>
                        <td className="p-3 font-mono">أضف عنوان فرعي "القسم الأول"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أضف فقرة</td>
                        <td className="p-3">إضافة نص فقرة</td>
                        <td className="p-3 font-mono">أضف فقرة "هذا نص تجريبي"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أضف رابط</td>
                        <td className="p-3">إضافة رابط</td>
                        <td className="p-3 font-mono">أضف رابط "اضغط هنا" "https://example.com"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">ابدأ قائمة</td>
                        <td className="p-3">بدء قائمة نقطية</td>
                        <td className="p-3 font-mono">ابدأ قائمة</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أضف عنصر قائمة</td>
                        <td className="p-3">إضافة عنصر للقائمة</td>
                        <td className="p-3 font-mono">أضف عنصر قائمة "العنصر الأول"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أنه القائمة</td>
                        <td className="p-3">إنهاء القائمة</td>
                        <td className="p-3 font-mono">أنه القائمة</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-mono">أغلق الصفحة</td>
                        <td className="p-3">إغلاق الصفحة</td>
                        <td className="p-3 font-mono">أغلق الصفحة</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* تحميل البرنامج */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Download className="w-5 h-5" />
                  تحميل وحي Desktop
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  نسخة سطح المكتب مع نظام حماية متقدم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    Alpha v1.0
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    تجريبي
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>نظام حماية RSA-2048</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Key className="w-4 h-4 text-blue-500" />
                    <span>PassKey مع Discord</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>دعم ملفات .wahy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="w-4 h-4 text-orange-500" />
                    <span>واجهة سطح المكتب</span>
                  </div>
                </div>

                <Separator />
                
                <Button 
                  onClick={downloadWahyDesktop}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تحميل النسخة التجريبية
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  حجم التحميل: ~15 MB<br />
                  متوافق مع Windows 10/11
                </p>
              </CardContent>
            </Card>

            {/* روابط سريعة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  روابط سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tutorial">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    دروس تفاعلية
                  </Button>
                </Link>
                
                <Link href="/wahy-editor">
                  <Button variant="outline" className="w-full justify-start">
                    <Code2 className="w-4 h-4 mr-2" />
                    محرر الويب
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/wahy-lang" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    المصدر المفتوح
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* احصائيات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  احصائيات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-muted-foreground">أمر متاح</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-muted-foreground">عربي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">MIT</div>
                    <div className="text-sm text-muted-foreground">مفتوح المصدر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">Alpha</div>
                    <div className="text-sm text-muted-foreground">نسخة تجريبية</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* دعم المجتمع */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  انضم للمجتمع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  ساعدنا في تطوير لغة وحي وكن جزءاً من مجتمع المطورين العرب
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Github className="w-4 h-4 mr-2" />
                    ساهم في الكود
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    أبلغ عن خطأ
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    اقترح ميزة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}