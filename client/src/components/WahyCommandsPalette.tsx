import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Plus } from "lucide-react";

interface WahyCommand {
  name: string;
  description: string;
  syntax: string;
  example: string;
}

interface CommandGroup {
  title: string;
  icon: string;
  commands: WahyCommand[];
}

interface WahyCommandsPaletteProps {
  onInsertCommand: (command: string) => void;
}

export function WahyCommandsPalette({ onInsertCommand }: WahyCommandsPaletteProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['page']));

  const commandGroups: CommandGroup[] = [
    {
      title: "أوامر الصفحة",
      icon: "📄",
      commands: [
        {
          name: "افتح صفحة",
          description: "إنشاء صفحة HTML جديدة",
          syntax: 'افتح "عنوان الصفحة"',
          example: 'افتح "موقعي الأول"'
        },
        {
          name: "أغلق صفحة",
          description: "إغلاق الصفحة وإنهاء الكود",
          syntax: "أغلق",
          example: "أغلق"
        }
      ]
    },
    {
      title: "أوامر المحتوى",
      icon: "📝",
      commands: [
        {
          name: "عنوان",
          description: "إضافة عنوان رئيسي",
          syntax: 'عنوان "النص"',
          example: 'عنوان "مرحباً بالعالم"'
        },
        {
          name: "عنوان فرعي",
          description: "إضافة عنوان فرعي",
          syntax: 'عنوان_فرعي "النص"',
          example: 'عنوان_فرعي "قسم فرعي"'
        },
        {
          name: "فقرة",
          description: "إضافة فقرة نصية",
          syntax: 'فقرة "النص"',
          example: 'فقرة "هذا نص الفقرة"'
        },
        {
          name: "رابط",
          description: "إضافة رابط تشعبي",
          syntax: 'رابط "النص" "الرابط"',
          example: 'رابط "جوجل" "https://google.com"'
        },
        {
          name: "صورة",
          description: "إضافة صورة",
          syntax: 'صورة "الرابط" "الوصف"',
          example: 'صورة "image.jpg" "صورة جميلة"'
        }
      ]
    },
    {
      title: "أوامر التفاعل",
      icon: "🔘",
      commands: [
        {
          name: "زر",
          description: "إضافة زر تفاعلي",
          syntax: 'زر "النص" "النوع"',
          example: 'زر "اضغطني" "primary"'
        },
        {
          name: "حقل إدخال",
          description: "إضافة حقل إدخال البيانات",
          syntax: 'حقل_إدخال "النص" "النوع"',
          example: 'حقل_إدخال "اسمك" "text"'
        },
        {
          name: "تنبيه",
          description: "إضافة تنبيه ملون",
          syntax: 'تنبيه "النص" "النوع"',
          example: 'تنبيه "تم الحفظ!" "success"'
        },
        {
          name: "بطاقة",
          description: "إضافة بطاقة معلومات",
          syntax: 'بطاقة "العنوان" "المحتوى"',
          example: 'بطاقة "عني" "مطور ويب"'
        },
        {
          name: "عداد",
          description: "إضافة عداد تفاعلي",
          syntax: 'عداد العدد "التسمية"',
          example: 'عداد 0 "النقرات"'
        }
      ]
    },
    {
      title: "أوامر القوائم",
      icon: "📋",
      commands: [
        {
          name: "ابدأ قائمة",
          description: "بدء قائمة نقطية",
          syntax: "ابدأ_قائمة",
          example: "ابدأ_قائمة"
        },
        {
          name: "ابدأ قائمة مرقمة",
          description: "بدء قائمة مرقمة",
          syntax: "ابدأ_قائمة_مرقمة",
          example: "ابدأ_قائمة_مرقمة"
        },
        {
          name: "عنصر",
          description: "إضافة عنصر للقائمة",
          syntax: 'عنصر "النص"',
          example: 'عنصر "العنصر الأول"'
        },
        {
          name: "أنهِ قائمة",
          description: "إنهاء القائمة",
          syntax: "أنهِ_قائمة",
          example: "أنهِ_قائمة"
        }
      ]
    },
    {
      title: "أوامر التخطيط",
      icon: "🏗️",
      commands: [
        {
          name: "ابدأ قسم",
          description: "بدء قسم جديد",
          syntax: 'ابدأ_قسم "الفئة"',
          example: 'ابدأ_قسم "center-text"'
        },
        {
          name: "أنهِ قسم",
          description: "إنهاء القسم",
          syntax: "أنهِ_قسم",
          example: "أنهِ_قسم"
        },
        {
          name: "خط فاصل",
          description: "إضافة خط أفقي فاصل",
          syntax: "خط_فاصل",
          example: "خط_فاصل"
        },
        {
          name: "مسافة",
          description: "إضافة مسافة فارغة",
          syntax: "مسافة",
          example: "مسافة"
        }
      ]
    },
    {
      title: "أوامر التنسيق",
      icon: "🎨",
      commands: [
        {
          name: "لون الخلفية",
          description: "تغيير لون خلفية الصفحة",
          syntax: 'لون_الخلفية "اللون"',
          example: 'لون_الخلفية "lightblue"'
        },
        {
          name: "لون النص",
          description: "تغيير لون النص",
          syntax: 'لون_النص "اللون"',
          example: 'لون_النص "darkblue"'
        },
        {
          name: "الخط",
          description: "تغيير نوع الخط",
          syntax: 'الخط "نوع الخط"',
          example: 'الخط "Arial"'
        },
        {
          name: "وسّط النص",
          description: "محاذاة النص في الوسط",
          syntax: "وسّط_النص",
          example: "وسّط_النص"
        }
      ]
    }
  ];

  const buttonTypes = [
    { name: "primary", color: "bg-blue-500", description: "أزرق" },
    { name: "success", color: "bg-green-500", description: "أخضر" },
    { name: "danger", color: "bg-red-500", description: "أحمر" },
    { name: "warning", color: "bg-yellow-500", description: "أصفر" },
    { name: "info", color: "bg-cyan-500", description: "سماوي" }
  ];

  const alertTypes = [
    { name: "info", color: "bg-blue-100 text-blue-800", description: "معلوماتي" },
    { name: "success", color: "bg-green-100 text-green-800", description: "نجح" },
    { name: "warning", color: "bg-yellow-100 text-yellow-800", description: "تحذير" },
    { name: "danger", color: "bg-red-100 text-red-800", description: "خطر" }
  ];

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const insertCommand = (command: WahyCommand) => {
    onInsertCommand(command.example + '\n');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-80 bg-background border-l border-border h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-2">🪄 أوامر لغة وَحي</h2>
        <p className="text-sm text-muted-foreground">اضغط على الأوامر لإدراجها في المحرر</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4 space-y-4">
          {commandGroups.map((group) => (
            <Card key={group.title} className="border border-border">
              <CardHeader 
                className="pb-2 cursor-pointer" 
                onClick={() => toggleGroup(group.title)}
              >
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>{group.icon}</span>
                    <span>{group.title}</span>
                  </span>
                  {expandedGroups.has(group.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              
              {expandedGroups.has(group.title) && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {group.commands.map((command) => (
                      <div key={command.name} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{command.name}</h4>
                            <p className="text-xs text-muted-foreground">{command.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(command.example)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => insertCommand(command)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">الصيغة:</p>
                          <code className="text-xs bg-muted p-1 rounded block font-mono">
                            {command.syntax}
                          </code>
                          <p className="text-xs text-muted-foreground">مثال:</p>
                          <code className="text-xs bg-primary/10 p-1 rounded block font-mono">
                            {command.example}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
          
          {/* مرجع أنواع الأزرار */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>🎨</span>
                <span>أنواع الأزرار</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2">
                {buttonTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <Badge variant="outline" className={`${type.color} text-white`}>
                      {type.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* مرجع أنواع التنبيهات */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>⚠️</span>
                <span>أنواع التنبيهات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2">
                {alertTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <Badge variant="outline" className={type.color}>
                      {type.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* نصائح سريعة */}
          <Card className="border border-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>💡</span>
                <span>نصائح سريعة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• ابدأ دائماً بـ افتح "عنوان الصفحة"</li>
                <li>• اختتم دائماً بـ أغلق</li>
                <li>• استخدم الاقتباس للنصوص المحتوية على مسافات</li>
                <li>• يمكنك استخدام ألوان CSS مثل red, blue, #ff0000</li>
                <li>• استخدم center-text لتوسيط النص</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}