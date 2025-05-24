export class WahyCommands {
  private commandGroups = [
    {
      title: "أوامر الصفحة",
      commands: [
        'افتح صفحة "العنوان"',
        'أغلق صفحة',
      ]
    },
    {
      title: "أوامر المحتوى",
      commands: [
        'أضف عنوان "النص"',
        'أضف عنوان_فرعي "النص"',
        'أضف فقرة "النص"',
        'أضف رابط "النص" "URL"',
        'أضف صورة "URL" "وصف"',
      ]
    },
    {
      title: "أوامر التنسيق",
      commands: [
        'غيّر لون_الخلفية إلى "لون"',
        'غيّر لون_النص إلى "لون"',
        'غيّر الخط إلى "نوع_الخط"',
      ]
    },
    {
      title: "أوامر القوائم",
      commands: [
        'ابدأ قائمة',
        'أضف عنصر "النص"',
        'أنهِ قائمة',
        'ابدأ قائمة_مرقمة',
        'أنهِ قائمة_مرقمة',
      ]
    },
    {
      title: "أوامر إضافية",
      commands: [
        'أضف خط_فاصل',
        'أضف مسافة',
        'ابدأ قسم',
        'أنهِ قسم',
      ]
    }
  ];

  getCommandGroups() {
    return this.commandGroups;
  }

  getDefaultTemplate() {
    return `افتح صفحة "موقعي الأول"

أضف عنوان "مرحباً بالعالم"
أضف فقرة "هذا مثال على استخدام لغة وحي لإنشاء صفحات الويب باللغة العربية"

غيّر لون_الخلفية إلى "lightblue"
غيّر لون_النص إلى "darkblue"

ابدأ قائمة
أضف عنصر "البساطة في الاستخدام"
أضف عنصر "دعم اللغة العربية"
أضف عنصر "سهولة التعلم"
أنهِ قائمة

أضف فقرة "يمكنك إضافة المزيد من المحتوى هنا"
أضف رابط "زيارة موقع GitHub" "https://github.com"

أغلق صفحة`;
  }

  getAllCommands() {
    return this.commandGroups.flatMap(group => group.commands);
  }

  searchCommands(query: string) {
    const allCommands = this.getAllCommands();
    return allCommands.filter(command => 
      command.includes(query) || 
      command.replace(/"/g, '').includes(query)
    );
  }
}
