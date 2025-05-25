/**
 * مكتبة الأوامر العربية الجاهزة للغة وحي
 * Wahy Arabic Commands Library
 */

export interface WahyCommand {
  name: string;
  arabicName: string;
  description: string;
  syntax: string;
  example: string;
  category: 'html' | 'css' | 'javascript' | 'ui' | 'logic';
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'color' | 'url';
    required: boolean;
    description: string;
  }>;
}

export class WahyLibrary {
  private commands: Map<string, WahyCommand> = new Map();

  constructor() {
    this.initializeCommands();
  }

  private initializeCommands() {
    // أوامر HTML الأساسية
    this.addCommand({
      name: 'create_page',
      arabicName: 'أنشئ_صفحة',
      description: 'إنشاء صفحة HTML جديدة مع عنوان',
      syntax: 'أنشئ_صفحة "عنوان الصفحة"',
      example: 'أنشئ_صفحة "موقعي الشخصي"',
      category: 'html',
      parameters: [
        { name: 'title', type: 'string', required: true, description: 'عنوان الصفحة' }
      ]
    });

    this.addCommand({
      name: 'create_button',
      arabicName: 'أنشئ_زر',
      description: 'إنشاء زر تفاعلي مع نص وإجراء',
      syntax: 'أنشئ_زر "نص الزر" "الإجراء"',
      example: 'أنشئ_زر "اضغط هنا" "أظهر_رسالة \'مرحباً!\'"',
      category: 'ui',
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'نص الزر' },
        { name: 'action', type: 'string', required: false, description: 'الإجراء عند الضغط' }
      ]
    });

    this.addCommand({
      name: 'when_click',
      arabicName: 'عند_الضغط',
      description: 'تحديد إجراء يحدث عند الضغط على عنصر',
      syntax: 'عند_الضغط "معرف_العنصر" فعل "الإجراء"',
      example: 'عند_الضغط "زر1" فعل "غيّر_لون_الخلفية \'أحمر\'"',
      category: 'javascript',
      parameters: [
        { name: 'element_id', type: 'string', required: true, description: 'معرف العنصر' },
        { name: 'action', type: 'string', required: true, description: 'الإجراء المطلوب' }
      ]
    });

    this.addCommand({
      name: 'add_text',
      arabicName: 'أضف_نص',
      description: 'إضافة نص إلى الصفحة',
      syntax: 'أضف_نص "النص المطلوب"',
      example: 'أضف_نص "مرحباً بكم في موقعي"',
      category: 'html',
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'النص المراد إضافته' }
      ]
    });

    this.addCommand({
      name: 'show_message',
      arabicName: 'أظهر_رسالة',
      description: 'عرض رسالة منبثقة للمستخدم',
      syntax: 'أظهر_رسالة "نص الرسالة"',
      example: 'أظهر_رسالة "تم حفظ البيانات بنجاح"',
      category: 'javascript',
      parameters: [
        { name: 'message', type: 'string', required: true, description: 'نص الرسالة' }
      ]
    });

    this.addCommand({
      name: 'change_color',
      arabicName: 'غيّر_اللون',
      description: 'تغيير لون عنصر محدد',
      syntax: 'غيّر_اللون "معرف_العنصر" إلى "اللون"',
      example: 'غيّر_اللون "عنوان1" إلى "أزرق"',
      category: 'css',
      parameters: [
        { name: 'element_id', type: 'string', required: true, description: 'معرف العنصر' },
        { name: 'color', type: 'color', required: true, description: 'اللون الجديد' }
      ]
    });

    // أوامر التحكم المنطقي
    this.addCommand({
      name: 'if_condition',
      arabicName: 'إذا',
      description: 'تنفيذ كود عند تحقق شرط معين',
      syntax: 'إذا "الشرط" فإن { الأوامر }',
      example: 'إذا "العمر > 18" فإن { أظهر_رسالة "مرحباً بالبالغين" }',
      category: 'logic',
      parameters: [
        { name: 'condition', type: 'string', required: true, description: 'الشرط المطلوب فحصه' }
      ]
    });

    this.addCommand({
      name: 'repeat_loop',
      arabicName: 'كرر',
      description: 'تكرار مجموعة أوامر عدد محدد من المرات',
      syntax: 'كرر "العدد" مرة { الأوامر }',
      example: 'كرر "5" مرة { أضف_نص "السطر رقم " + الرقم }',
      category: 'logic',
      parameters: [
        { name: 'count', type: 'number', required: true, description: 'عدد مرات التكرار' }
      ]
    });

    this.addCommand({
      name: 'while_loop',
      arabicName: 'طالما',
      description: 'تكرار الأوامر طالما الشرط محقق',
      syntax: 'طالما "الشرط" { الأوامر }',
      example: 'طالما "العداد < 10" { اطبع العداد، العداد = العداد + 1 }',
      category: 'logic',
      parameters: [
        { name: 'condition', type: 'string', required: true, description: 'شرط الاستمرار' }
      ]
    });

    this.addCommand({
      name: 'print_output',
      arabicName: 'اطبع',
      description: 'طباعة قيمة في وحدة التحكم',
      syntax: 'اطبع "القيمة"',
      example: 'اطبع "مرحباً بالعالم"',
      category: 'javascript',
      parameters: [
        { name: 'value', type: 'string', required: true, description: 'القيمة المراد طباعتها' }
      ]
    });

    // أوامر التصميم المتقدمة
    this.addCommand({
      name: 'create_section',
      arabicName: 'أنشئ_قسم',
      description: 'إنشاء قسم منطقي في الصفحة',
      syntax: 'أنشئ_قسم "الاسم" بنمط "النمط"',
      example: 'أنشئ_قسم "المحتوى_الرئيسي" بنمط "مركز"',
      category: 'html',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'اسم القسم' },
        { name: 'style', type: 'string', required: false, description: 'نمط القسم' }
      ]
    });

    this.addCommand({
      name: 'add_input',
      arabicName: 'أضف_مدخل',
      description: 'إضافة حقل إدخال للمستخدم',
      syntax: 'أضف_مدخل "النوع" "العنوان" "القيمة_الافتراضية"',
      example: 'أضف_مدخل "نص" "الاسم" "أدخل اسمك هنا"',
      category: 'ui',
      parameters: [
        { name: 'type', type: 'string', required: true, description: 'نوع المدخل (نص، رقم، كلمة_سر)' },
        { name: 'label', type: 'string', required: true, description: 'عنوان المدخل' },
        { name: 'placeholder', type: 'string', required: false, description: 'النص التوضيحي' }
      ]
    });

    // أوامر الوسائط المتعددة
    this.addCommand({
      name: 'add_video',
      arabicName: 'أضف_فيديو',
      description: 'إضافة مقطع فيديو إلى الصفحة',
      syntax: 'أضف_فيديو "رابط_الفيديو" "العرض" "الارتفاع"',
      example: 'أضف_فيديو "video.mp4" "400" "300"',
      category: 'html',
      parameters: [
        { name: 'src', type: 'url', required: true, description: 'رابط الفيديو' },
        { name: 'width', type: 'number', required: false, description: 'العرض' },
        { name: 'height', type: 'number', required: false, description: 'الارتفاع' }
      ]
    });

    this.addCommand({
      name: 'add_audio',
      arabicName: 'أضف_صوت',
      description: 'إضافة ملف صوتي إلى الصفحة',
      syntax: 'أضف_صوت "رابط_الصوت" "تشغيل_تلقائي"',
      example: 'أضف_صوت "music.mp3" "لا"',
      category: 'html',
      parameters: [
        { name: 'src', type: 'url', required: true, description: 'رابط الملف الصوتي' },
        { name: 'autoplay', type: 'boolean', required: false, description: 'التشغيل التلقائي' }
      ]
    });

    // أوامر متقدمة للتفاعل
    this.addCommand({
      name: 'create_form',
      arabicName: 'أنشئ_نموذج',
      description: 'إنشاء نموذج لجمع البيانات',
      syntax: 'أنشئ_نموذج "الاسم" "طريقة_الإرسال" "الوجهة"',
      example: 'أنشئ_نموذج "تسجيل_دخول" "POST" "/login"',
      category: 'html',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'اسم النموذج' },
        { name: 'method', type: 'string', required: false, description: 'طريقة الإرسال' },
        { name: 'action', type: 'string', required: false, description: 'وجهة الإرسال' }
      ]
    });

    this.addCommand({
      name: 'animate_element',
      arabicName: 'حرك_عنصر',
      description: 'إضافة حركة لعنصر معين',
      syntax: 'حرك_عنصر "معرف_العنصر" "نوع_الحركة" "المدة"',
      example: 'حرك_عنصر "صندوق1" "اهتزاز" "2ث"',
      category: 'css',
      parameters: [
        { name: 'element_id', type: 'string', required: true, description: 'معرف العنصر' },
        { name: 'animation', type: 'string', required: true, description: 'نوع الحركة' },
        { name: 'duration', type: 'string', required: false, description: 'مدة الحركة' }
      ]
    });
  }

  private addCommand(command: WahyCommand) {
    this.commands.set(command.arabicName, command);
    this.commands.set(command.name, command);
  }

  getCommand(name: string): WahyCommand | undefined {
    return this.commands.get(name);
  }

  getAllCommands(): WahyCommand[] {
    return Array.from(this.commands.values());
  }

  getCommandsByCategory(category: WahyCommand['category']): WahyCommand[] {
    return this.getAllCommands().filter(cmd => cmd.category === category);
  }

  searchCommands(query: string): WahyCommand[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllCommands().filter(cmd => 
      cmd.arabicName.includes(query) ||
      cmd.name.toLowerCase().includes(lowercaseQuery) ||
      cmd.description.includes(query)
    );
  }

  getCommandSuggestions(partialInput: string): string[] {
    const suggestions: string[] = [];
    this.commands.forEach((command, key) => {
      if (key.startsWith(partialInput)) {
        suggestions.push(key);
      }
    });
    return suggestions.sort();
  }

  // ترجمة الأوامر المعقدة إلى أكواد
  translateCommand(arabicCommand: string): string {
    const command = this.getCommand(arabicCommand);
    if (!command) {
      return '';
    }

    switch (command.name) {
      case 'create_button':
        return this.generateButtonCode(arabicCommand);
      case 'when_click':
        return this.generateClickEventCode(arabicCommand);
      case 'show_message':
        return this.generateAlertCode(arabicCommand);
      case 'change_color':
        return this.generateColorChangeCode(arabicCommand);
      case 'if_condition':
        return this.generateIfStatementCode(arabicCommand);
      case 'repeat_loop':
        return this.generateForLoopCode(arabicCommand);
      case 'while_loop':
        return this.generateWhileLoopCode(arabicCommand);
      default:
        return '';
    }
  }

  private generateButtonCode(command: string): string {
    // استخراج المعاملات من الأمر العربي
    const match = command.match(/أنشئ_زر\s+"([^"]+)"\s*"?([^"]*)"?/);
    if (!match) return '';

    const text = match[1];
    const action = match[2] || '';

    return `
      <button class="wahy-button" onclick="${action.replace(/'/g, '"')}">${text}</button>
      <style>
        .wahy-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin: 5px;
        }
        .wahy-button:hover {
          background-color: #0056b3;
        }
      </style>
    `;
  }

  private generateClickEventCode(command: string): string {
    const match = command.match(/عند_الضغط\s+"([^"]+)"\s+فعل\s+"([^"]+)"/);
    if (!match) return '';

    const elementId = match[1];
    const action = match[2];

    return `
      <script>
        document.getElementById('${elementId}').addEventListener('click', function() {
          ${this.translateArabicAction(action)}
        });
      </script>
    `;
  }

  private generateAlertCode(command: string): string {
    const match = command.match(/أظهر_رسالة\s+"([^"]+)"/);
    if (!match) return '';

    const message = match[1];
    return `alert('${message}');`;
  }

  private generateColorChangeCode(command: string): string {
    const match = command.match(/غيّر_اللون\s+"([^"]+)"\s+إلى\s+"([^"]+)"/);
    if (!match) return '';

    const elementId = match[1];
    const color = match[2];

    return `document.getElementById('${elementId}').style.color = '${color}';`;
  }

  private generateIfStatementCode(command: string): string {
    const match = command.match(/إذا\s+"([^"]+)"\s+فإن/);
    if (!match) return '';

    const condition = match[1];
    return `if (${this.translateArabicCondition(condition)}) {`;
  }

  private generateForLoopCode(command: string): string {
    const match = command.match(/كرر\s+"(\d+)"\s+مرة/);
    if (!match) return '';

    const count = match[1];
    return `for (let i = 0; i < ${count}; i++) {`;
  }

  private generateWhileLoopCode(command: string): string {
    const match = command.match(/طالما\s+"([^"]+)"/);
    if (!match) return '';

    const condition = match[1];
    return `while (${this.translateArabicCondition(condition)}) {`;
  }

  private translateArabicAction(action: string): string {
    // ترجمة الإجراءات العربية إلى JavaScript
    if (action.includes('أظهر_رسالة')) {
      const match = action.match(/أظهر_رسالة\s+'([^']+)'/);
      if (match) {
        return `alert('${match[1]}');`;
      }
    }
    
    if (action.includes('غيّر_لون_الخلفية')) {
      const match = action.match(/غيّر_لون_الخلفية\s+'([^']+)'/);
      if (match) {
        return `document.body.style.backgroundColor = '${match[1]}';`;
      }
    }

    return action;
  }

  private translateArabicCondition(condition: string): string {
    // ترجمة الشروط العربية إلى JavaScript
    let jsCondition = condition;
    
    // استبدال العمليات العربية
    jsCondition = jsCondition.replace(/أكبر_من/g, '>');
    jsCondition = jsCondition.replace(/أصغر_من/g, '<');
    jsCondition = jsCondition.replace(/يساوي/g, '==');
    jsCondition = jsCondition.replace(/لا_يساوي/g, '!=');
    jsCondition = jsCondition.replace(/و/g, '&&');
    jsCondition = jsCondition.replace(/أو/g, '||');
    
    return jsCondition;
  }

  // إنشاء دوكيومنتيشن للأوامر
  generateDocumentation(): string {
    const categories = ['html', 'css', 'javascript', 'ui', 'logic'] as const;
    let docs = '# دليل أوامر لغة وحي\n\n';

    categories.forEach(category => {
      const commands = this.getCommandsByCategory(category);
      if (commands.length > 0) {
        docs += `## ${this.getCategoryNameInArabic(category)}\n\n`;
        
        commands.forEach(cmd => {
          docs += `### ${cmd.arabicName}\n`;
          docs += `**الوصف:** ${cmd.description}\n\n`;
          docs += `**الصيغة:** \`${cmd.syntax}\`\n\n`;
          docs += `**مثال:**\n\`\`\`wahy\n${cmd.example}\n\`\`\`\n\n`;
          
          if (cmd.parameters.length > 0) {
            docs += '**المعاملات:**\n';
            cmd.parameters.forEach(param => {
              const required = param.required ? '(مطلوب)' : '(اختياري)';
              docs += `- \`${param.name}\` ${required}: ${param.description}\n`;
            });
            docs += '\n';
          }
          
          docs += '---\n\n';
        });
      }
    });

    return docs;
  }

  private getCategoryNameInArabic(category: WahyCommand['category']): string {
    const names = {
      'html': 'أوامر HTML',
      'css': 'أوامر التصميم (CSS)',
      'javascript': 'أوامر البرمجة (JavaScript)',
      'ui': 'أوامر واجهة المستخدم',
      'logic': 'أوامر التحكم المنطقي'
    };
    return names[category];
  }
}