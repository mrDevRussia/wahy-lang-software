/**
 * صفحة Wahy Dual Mode الرئيسية
 * Main page for Wahy Dual Mode system
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  BookOpen, 
  Star,
  Clock,
  HardDrive
} from 'lucide-react';
import ModeSelector from '@/dual-mode/components/ModeSelector';

export default function DualModePage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    
    // التوجه إلى صفحة الوضع المختار
    setTimeout(() => {
      if (modeId === 'web-dev') {
        window.location.href = '/dual-mode/web-dev';
      } else if (modeId === 'cybersecurity') {
        window.location.href = '/dual-mode/cybersecurity';
      }
    }, 1000);
  };

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: "تطوير الويب المتقدم",
      description: "أنشئ مواقع ويب احترافية باستخدام HTML وCSS وJavaScript بلغة عربية"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "الأمن السيبراني التعليمي",
      description: "تعلم أساسيات الأمان السيبراني من خلال محاكاة آمنة ومعتمدة"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "أداء محسن",
      description: "تحميل كسول وإدارة ذكية للموارد لضمان تجربة سلسة"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "تعليم تفاعلي",
      description: "بيئة تعلم آمنة مع أمثلة عملية وتمارين تطبيقية"
    }
  ];

  const stats = [
    { label: "المستخدمون النشطون", value: "2,500+", icon: <Users className="w-5 h-5" /> },
    { label: "المشاريع المنشأة", value: "15,000+", icon: <Globe className="w-5 h-5" /> },
    { label: "الفحوصات الأمنية", value: "50,000+", icon: <Shield className="w-5 h-5" /> },
    { label: "معدل الرضا", value: "98%", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 space-x-reverse">
                  <ArrowLeft className="w-4 h-4" />
                  <span>العودة للرئيسية</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wahy Dual Mode
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                نظام آمن
              </Badge>
              <Link href="/guide">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  دليل المستخدم
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            نظام الأوضاع المتعددة الجديد
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            مرحباً بك في
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Wahy Dual Mode
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            اختر بين وضع تطوير الويب المتقدم أو وضع الأمن السيبراني التعليمي. 
            بيئة آمنة ومتطورة لتعلم البرمجة والأمان الرقمي باللغة العربية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Globe className="w-5 h-5 mr-2" />
              ابدأ التطوير الآن
            </Button>
            <Button variant="outline" size="lg">
              <Shield className="w-5 h-5 mr-2" />
              استكشف الأمان
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-slate-200 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              لماذا Wahy Dual Mode؟
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              نظام متطور يجمع بين تطوير الويب والأمن السيبراني في بيئة تعليمية آمنة ومتكاملة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-200 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 p-3 bg-slate-100 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-12">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900">
                اختر وضع العمل المناسب لك
              </CardTitle>
              <p className="text-slate-600">
                كل وضع مُحسن للأداء مع تحميل كسول وإدارة ذكية للموارد
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <ModeSelector onModeSelect={handleModeSelect} currentMode={selectedMode} />
            </CardContent>
          </Card>
        </div>

        {/* Technical Specs */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              المواصفات التقنية
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              نظام محسن للأداء مع ضمانات الأمان والموثوقية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">استهلاك الذاكرة</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">200-250 MB</p>
                <p className="text-sm text-slate-600">حد أقصى لكل وضع</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">زمن التحميل</h3>
                <p className="text-2xl font-bold text-green-600 mb-2">&lt; 3 ثوان</p>
                <p className="text-sm text-slate-600">لكل وضع</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">الأمان</h3>
                <p className="text-2xl font-bold text-red-600 mb-2">100%</p>
                <p className="text-sm text-slate-600">محاكاة آمنة</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                جاهز لبدء رحلتك؟
              </h2>
              <p className="text-xl mb-6 text-blue-100">
                انضم إلى آلاف المطورين والخبراء الذين يستخدمون Wahy Dual Mode
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100">
                  <Globe className="w-5 h-5 mr-2" />
                  ابدأ تطوير الويب
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Shield className="w-5 h-5 mr-2" />
                  تعلم الأمن السيبراني
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="mb-2">
              Wahy Dual Mode - نظام الأوضاع المتعددة لتعلم البرمجة والأمان
            </p>
            <p className="text-sm">
              جميع عمليات الأمن السيبراني وهمية وتعليمية. مصمم للتعلم الآمن.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}