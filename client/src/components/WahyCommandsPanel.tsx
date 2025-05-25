import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy } from "lucide-react";

interface WahyCommandsPanelProps {
  onInsertCommand: (command: string) => void;
}

export function WahyCommandsPanel({ onInsertCommand }: WahyCommandsPanelProps) {
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

  const buttonTypes = ["primary", "success", "danger", "warning", "info"];
  const alertTypes = ["info", "success", "warning", "danger"];

  const insertCommand = (command: string) => {
    onInsertCommand(command + '\n');
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2">🪄 أوامر لغة وَحي</h2>
        <p className="text-sm text-gray-600">اضغط + لإضافة الأمر</p>
      </div>
      
      <div className="p-4 space-y-4">
        {["صفحة", "محتوى", "تفاعل", "قوائم", "تخطيط", "تنسيق"].map(category => (
          <Card key={category} className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{category}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {commands
                  .filter(cmd => cmd.category === category)
                  .map((command) => (
                    <div key={command.name} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                      <div>
                        <div className="text-sm font-medium">{command.name}</div>
                        <code className="text-xs text-gray-600 bg-gray-100 px-1 rounded">
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
        
        {/* أنواع الأزرار */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">أنواع الأزرار</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {buttonTypes.map(type => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* أنواع التنبيهات */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">أنواع التنبيهات</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {alertTypes.map(type => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}