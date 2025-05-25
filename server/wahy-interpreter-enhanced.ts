/**
 * مفسر لغة وَحي المحسن
 * Enhanced Wahy Programming Language Interpreter
 * 
 * يدعم:
 * - HTML elements with Arabic commands
 * - CSS styling with Arabic properties
 * - JavaScript functionality with Arabic syntax
 * - Variables and functions
 * - Event handlers
 * - Interactive elements
 */

interface InterpretationResult {
  success: boolean;
  html?: string;
  error?: string;
  lineNumber?: number;
}

// واجهة لتخزين المتغيرات
interface WahyVariable {
  name: string;
  value: any;
  type: 'عدد' | 'نص' | 'منطقي';
}

// واجهة لتخزين الوظائف والأحداث
interface WahyEventHandler {
  elementId: string;
  event: string;
  actions: string[];
}

// واجهة لتخزين أنماط CSS
interface WahyStyle {
  selector: string;
  properties: Record<string, string>;
}

class EnhancedWahyGenerator {
  private htmlParts: string[] = [];
  private pageOpened = false;
  private pageClosed = false;
  private customStyles: WahyStyle[] = [];
  private variables: WahyVariable[] = [];
  private eventHandlers: WahyEventHandler[] = [];
  private scriptParts: string[] = [];
  private listStack: string[] = [];
  private sectionStack: string[] = [];
  private elementCounter = 0;

  reset() {
    this.htmlParts = [];
    this.pageOpened = false;
    this.pageClosed = false;
    this.customStyles = [];
    this.variables = [];
    this.eventHandlers = [];
    this.scriptParts = [];
    this.listStack = [];
    this.sectionStack = [];
    this.elementCounter = 0;
  }

  // إنشاء معرف فريد للعناصر
  private generateElementId(prefix: string = 'element'): string {
    this.elementCounter++;
    return `${prefix}_${this.elementCounter}`;
  }

  // فتح صفحة جديدة
  openPage(title: string) {
    if (this.pageOpened) {
      throw new Error('الصفحة مفتوحة بالفعل');
    }

    this.htmlParts.push('<!DOCTYPE html>');
    this.htmlParts.push('<html lang="ar" dir="rtl">');
    this.htmlParts.push('<head>');
    this.htmlParts.push('<meta charset="UTF-8">');
    this.htmlParts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    this.htmlParts.push(`<title>${this.escapeHtml(title)}</title>`);
    this.htmlParts.push('<style>');
    
    // أنماط CSS الأساسية
    this.htmlParts.push(`
      * { box-sizing: border-box; }
      body { 
        font-family: "Noto Sans Arabic", "Arial", sans-serif; 
        margin: 20px; 
        padding: 20px; 
        background-color: white; 
        color: #333; 
        line-height: 1.6;
      }
      h1, h2, h3, h4, h5, h6 { 
        color: #333; 
        margin: 15px 0; 
        font-weight: bold;
      }
      p { 
        margin: 10px 0; 
        line-height: 1.6; 
      }
      ul, ol { 
        margin: 10px 0; 
        padding-right: 20px; 
      }
      li { 
        margin: 5px 0; 
      }
      a { 
        color: #007bff; 
        text-decoration: none; 
        transition: all 0.3s ease;
      }
      a:hover { 
        text-decoration: underline; 
        color: #0056b3; 
      }
      img { 
        max-width: 100%; 
        height: auto; 
        margin: 10px 0; 
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      hr { 
        margin: 20px 0; 
        border: none; 
        border-top: 2px solid #eee; 
        border-radius: 1px;
      }
      .section { 
        margin: 20px 0; 
        padding: 20px; 
        border: 1px solid #eee; 
        border-radius: 10px; 
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      button { 
        padding: 12px 24px; 
        margin: 8px 4px; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer; 
        font-family: inherit; 
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }
      button:hover { 
        opacity: 0.9; 
        transform: translateY(-2px); 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      button:active { 
        transform: translateY(0); 
      }
      .btn-primary { 
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); 
        color: white; 
      }
      .btn-success { 
        background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); 
        color: white; 
      }
      .btn-danger { 
        background: linear-gradient(135deg, #dc3545 0%, #bd2130 100%); 
        color: white; 
      }
      .btn-warning { 
        background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); 
        color: #333; 
      }
      .btn-info { 
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); 
        color: white; 
      }
      .center-text { 
        text-align: center; 
      }
      .right-text { 
        text-align: right; 
      }
      .left-text { 
        text-align: left; 
      }
      .large-text { 
        font-size: 1.5em; 
      }
      .medium-text { 
        font-size: 1.2em; 
      }
      .small-text { 
        font-size: 0.9em; 
      }
      .bold-text { 
        font-weight: bold; 
      }
      .italic-text { 
        font-style: italic; 
      }
      .counter { 
        font-size: 2.5em; 
        font-weight: bold; 
        color: #007bff; 
        text-align: center; 
        margin: 20px 0; 
        background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
        padding: 20px;
        border-radius: 15px;
        border: 2px solid #007bff;
      }
      .alert { 
        padding: 15px; 
        margin: 15px 0; 
        border-radius: 8px; 
        border-left: 4px solid; 
      }
      .alert-success { 
        background-color: #d4edda; 
        border-color: #28a745; 
        color: #155724; 
      }
      .alert-danger { 
        background-color: #f8d7da; 
        border-color: #dc3545; 
        color: #721c24; 
      }
      .alert-warning { 
        background-color: #fff3cd; 
        border-color: #ffc107; 
        color: #856404; 
      }
      .alert-info { 
        background-color: #cce7ff; 
        border-color: #007bff; 
        color: #004085; 
      }
      .card { 
        background: white; 
        border-radius: 12px; 
        box-shadow: 0 4px 16px rgba(0,0,0,0.1); 
        margin: 20px 0; 
        overflow: hidden;
        transition: transform 0.3s ease;
      }
      .card:hover { 
        transform: translateY(-4px); 
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      .card-header { 
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
        padding: 20px; 
        border-bottom: 1px solid #dee2e6; 
        font-weight: bold;
      }
      .card-body { 
        padding: 20px; 
      }
      .input-field { 
        width: 100%; 
        padding: 12px; 
        margin: 8px 0; 
        border: 2px solid #ddd; 
        border-radius: 8px; 
        font-family: inherit;
        transition: border-color 0.3s ease;
      }
      .input-field:focus { 
        outline: none; 
        border-color: #007bff; 
        box-shadow: 0 0 8px rgba(0,123,255,0.25);
      }
    `);

    this.pageOpened = true;
  }

  // إغلاق الصفحة
  closePage() {
    if (!this.pageOpened) {
      throw new Error('لا توجد صفحة مفتوحة');
    }
    if (this.pageClosed) {
      throw new Error('الصفحة مغلقة بالفعل');
    }

    // إغلاق القوائم والأقسام المفتوحة
    while (this.listStack.length > 0) {
      const listType = this.listStack.pop();
      this.htmlParts.push(`</${listType}>`);
    }

    while (this.sectionStack.length > 0) {
      this.sectionStack.pop();
      this.htmlParts.push('</div>');
    }

    // إضافة الأنماط المخصصة
    for (const style of this.customStyles) {
      this.htmlParts.push(`${style.selector} {`);
      for (const [property, value] of Object.entries(style.properties)) {
        this.htmlParts.push(`  ${property}: ${value};`);
      }
      this.htmlParts.push('}');
    }

    this.htmlParts.push('</style>');
    this.htmlParts.push('</head>');
    this.htmlParts.push('<body>');

    // إضافة JavaScript للمتغيرات والوظائف
    if (this.variables.length > 0 || this.eventHandlers.length > 0 || this.scriptParts.length > 0) {
      this.htmlParts.push('<script>');
      
      // تعريف المتغيرات
      for (const variable of this.variables) {
        let value = variable.value;
        if (variable.type === 'نص') {
          value = `"${value}"`;
        }
        this.htmlParts.push(`let ${variable.name} = ${value};`);
      }
      
      // إضافة كود JavaScript المخصص
      for (const script of this.scriptParts) {
        this.htmlParts.push(script);
      }
      
      // إضافة معالجات الأحداث
      for (const handler of this.eventHandlers) {
        this.htmlParts.push(`document.getElementById('${handler.elementId}').addEventListener('${handler.event}', function() {`);
        for (const action of handler.actions) {
          this.htmlParts.push(`  ${action}`);
        }
        this.htmlParts.push('});');
      }
      
      this.htmlParts.push('</script>');
    }

    this.htmlParts.push('</body>');
    this.htmlParts.push('</html>');
    this.pageClosed = true;
  }

  // إضافة عنوان
  addHeading(text: string, level: number = 1) {
    this.ensurePageOpen();
    this.htmlParts.push(`<h${level}>${this.escapeHtml(text)}</h${level}>`);
  }

  // إضافة عنوان فرعي
  addSubheading(text: string) {
    this.addHeading(text, 2);
  }

  // إضافة فقرة
  addParagraph(text: string, className?: string) {
    this.ensurePageOpen();
    const classAttr = className ? ` class="${className}"` : '';
    this.htmlParts.push(`<p${classAttr}>${this.escapeHtml(text)}</p>`);
  }

  // إضافة رابط
  addLink(text: string, url: string) {
    this.ensurePageOpen();
    this.htmlParts.push(`<a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(text)}</a>`);
  }

  // إضافة صورة
  addImage(url: string, altText: string) {
    this.ensurePageOpen();
    this.htmlParts.push(`<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(altText)}">`);
  }

  // إضافة زر
  addButton(text: string, style: string = 'primary', onClick?: string) {
    this.ensurePageOpen();
    const buttonId = this.generateElementId('btn');
    this.htmlParts.push(`<button id="${buttonId}" class="btn-${style}">${this.escapeHtml(text)}</button>`);
    
    if (onClick) {
      this.eventHandlers.push({
        elementId: buttonId,
        event: 'click',
        actions: [onClick]
      });
    }
    
    return buttonId;
  }

  // إضافة حقل إدخال
  addInput(placeholder: string, type: string = 'text') {
    this.ensurePageOpen();
    const inputId = this.generateElementId('input');
    this.htmlParts.push(`<input id="${inputId}" type="${type}" placeholder="${this.escapeHtml(placeholder)}" class="input-field">`);
    return inputId;
  }

  // إضافة تنبيه
  addAlert(text: string, type: string = 'info') {
    this.ensurePageOpen();
    this.htmlParts.push(`<div class="alert alert-${type}">${this.escapeHtml(text)}</div>`);
  }

  // إضافة بطاقة
  addCard(title: string, content: string) {
    this.ensurePageOpen();
    this.htmlParts.push('<div class="card">');
    if (title) {
      this.htmlParts.push(`<div class="card-header">${this.escapeHtml(title)}</div>`);
    }
    this.htmlParts.push(`<div class="card-body">${this.escapeHtml(content)}</div>`);
    this.htmlParts.push('</div>');
  }

  // إضافة عداد
  addCounter(initialValue: number = 0, label?: string) {
    this.ensurePageOpen();
    const counterId = this.generateElementId('counter');
    const labelText = label ? `${label}: ` : '';
    this.htmlParts.push(`<div id="${counterId}" class="counter">${labelText}<span id="${counterId}_value">${initialValue}</span></div>`);
    
    // إضافة متغير العداد
    this.variables.push({
      name: `${counterId}_count`,
      value: initialValue,
      type: 'عدد'
    });
    
    return counterId;
  }

  // بدء قائمة
  startList() {
    this.ensurePageOpen();
    this.htmlParts.push('<ul>');
    this.listStack.push('ul');
  }

  // بدء قائمة مرقمة
  startOrderedList() {
    this.ensurePageOpen();
    this.htmlParts.push('<ol>');
    this.listStack.push('ol');
  }

  // إنهاء قائمة
  endList() {
    if (this.listStack.length === 0) {
      throw new Error('لا توجد قائمة مفتوحة');
    }
    const listType = this.listStack.pop();
    this.htmlParts.push(`</${listType}>`);
  }

  // إضافة عنصر قائمة
  addListItem(text: string) {
    if (this.listStack.length === 0) {
      throw new Error('يجب بدء قائمة أولاً');
    }
    this.htmlParts.push(`<li>${this.escapeHtml(text)}</li>`);
  }

  // إضافة خط فاصل
  addHorizontalRule() {
    this.ensurePageOpen();
    this.htmlParts.push('<hr>');
  }

  // إضافة مسافة
  addSpace() {
    this.ensurePageOpen();
    this.htmlParts.push('<br>');
  }

  // بدء قسم
  startSection(className?: string) {
    this.ensurePageOpen();
    const classAttr = className ? ` class="${className}"` : ' class="section"';
    this.htmlParts.push(`<div${classAttr}>`);
    this.sectionStack.push('div');
  }

  // إنهاء قسم
  endSection() {
    if (this.sectionStack.length === 0) {
      throw new Error('لا توجد أقسام مفتوحة');
    }
    this.sectionStack.pop();
    this.htmlParts.push('</div>');
  }

  // تغيير لون الخلفية
  changeBackgroundColor(color: string) {
    this.addStyle('body', 'background-color', color);
  }

  // تغيير لون النص
  changeTextColor(color: string) {
    this.addStyle('body', 'color', color);
  }

  // تغيير الخط
  changeFont(font: string) {
    this.addStyle('body', 'font-family', font);
  }

  // إضافة نمط CSS مخصص
  addStyle(selector: string, property: string, value: string) {
    let existingStyle = this.customStyles.find(s => s.selector === selector);
    if (!existingStyle) {
      existingStyle = { selector, properties: {} };
      this.customStyles.push(existingStyle);
    }
    existingStyle.properties[property] = value;
  }

  // إضافة متغير
  addVariable(name: string, value: any, type: 'عدد' | 'نص' | 'منطقي') {
    this.variables.push({ name, value, type });
  }

  // إضافة كود JavaScript مخصص
  addScript(script: string) {
    this.scriptParts.push(script);
  }

  // الحصول على HTML النهائي
  getHtml(): string {
    return this.htmlParts.join('\n');
  }

  // التحقق من اكتمال الصفحة
  isPageComplete(): boolean {
    return this.pageOpened && this.pageClosed;
  }

  // التأكد من فتح الصفحة
  private ensurePageOpen() {
    if (!this.pageOpened) {
      throw new Error('يجب فتح صفحة أولاً');
    }
    if (this.pageClosed) {
      throw new Error('الصفحة مغلقة بالفعل');
    }
  }

  // تنظيف HTML
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// فئة الأوامر المحسنة
class EnhancedWahyCommands {
  private commandMap: Record<string, (args: string[], generator: EnhancedWahyGenerator) => void>;

  constructor() {
    this.commandMap = {
      // أوامر الصفحة
      'افتح_صفحة': this.openPage,
      'افتح': this.openPage,
      'صفحة': this.openPage,
      'أغلق_صفحة': this.closePage,
      'اغلق_صفحة': this.closePage,
      'أغلق': this.closePage,

      // أوامر المحتوى
      'أضف_عنوان': this.addHeading,
      'عنوان': this.addHeading,
      'أضف_عنوان_فرعي': this.addSubheading,
      'عنوان_فرعي': this.addSubheading,
      'أضف_فقرة': this.addParagraph,
      'فقرة': this.addParagraph,
      'أضف_رابط': this.addLink,
      'رابط': this.addLink,
      'أضف_صورة': this.addImage,
      'صورة': this.addImage,

      // أوامر التفاعل
      'أضف_زر': this.addButton,
      'زر': this.addButton,
      'أضف_حقل_إدخال': this.addInput,
      'حقل_إدخال': this.addInput,
      'أضف_تنبيه': this.addAlert,
      'تنبيه': this.addAlert,
      'أضف_بطاقة': this.addCard,
      'بطاقة': this.addCard,
      'أضف_عداد': this.addCounter,
      'عداد': this.addCounter,

      // أوامر القوائم
      'ابدأ_قائمة': this.startList,
      'أنهِ_قائمة': this.endList,
      'انهي_قائمة': this.endList,
      'ابدأ_قائمة_مرقمة': this.startOrderedList,
      'أنهِ_قائمة_مرقمة': this.endList,
      'انهي_قائمة_مرقمة': this.endList,
      'أضف_عنصر': this.addListItem,
      'عنصر': this.addListItem,

      // أوامر التخطيط
      'أضف_خط_فاصل': this.addHorizontalRule,
      'خط_فاصل': this.addHorizontalRule,
      'أضف_مسافة': this.addSpace,
      'مسافة': this.addSpace,
      'ابدأ_قسم': this.startSection,
      'أنهِ_قسم': this.endSection,
      'انهي_قسم': this.endSection,

      // أوامر التنسيق
      'غيّر_لون_الخلفية': this.changeBackgroundColor,
      'لون_الخلفية': this.changeBackgroundColor,
      'غيّر_لون_النص': this.changeTextColor,
      'لون_النص': this.changeTextColor,
      'غيّر_الخط': this.changeFont,
      'الخط': this.changeFont,

      // أوامر المتغيرات والبرمجة
      'اجعل': this.createVariable,
      'متغير': this.createVariable,
      'عند_الضغط': this.onButtonClick,
      'عند_النقر': this.onButtonClick,
      'نفّذ': this.executeAction,
      'نفذ': this.executeAction,
    };
  }

  executeCommand(command: string, args: string[], generator: EnhancedWahyGenerator): boolean {
    const handler = this.commandMap[command];
    if (handler) {
      handler.call(this, args, generator);
      return true;
    }
    return false;
  }

  private openPage = (args: string[], generator: EnhancedWahyGenerator) => {
    const title = args[0] || 'صفحة جديدة';
    generator.openPage(title);
  };

  private closePage = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.closePage();
  };

  private addHeading = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || '';
    const level = parseInt(args[1]) || 1;
    generator.addHeading(text, level);
  };

  private addSubheading = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || '';
    generator.addSubheading(text);
  };

  private addParagraph = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || '';
    const className = args[1];
    generator.addParagraph(text, className);
  };

  private addLink = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || '';
    const url = args[1] || '#';
    generator.addLink(text, url);
  };

  private addImage = (args: string[], generator: EnhancedWahyGenerator) => {
    const url = args[0] || '';
    const alt = args[1] || 'صورة';
    generator.addImage(url, alt);
  };

  private addButton = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || 'زر';
    const style = args[1] || 'primary';
    const onClick = args[2];
    generator.addButton(text, style, onClick);
  };

  private addInput = (args: string[], generator: EnhancedWahyGenerator) => {
    const placeholder = args[0] || '';
    const type = args[1] || 'text';
    generator.addInput(placeholder, type);
  };

  private addAlert = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || '';
    const type = args[1] || 'info';
    generator.addAlert(text, type);
  };

  private addCard = (args: string[], generator: EnhancedWahyGenerator) => {
    const title = args[0] || '';
    const content = args[1] || '';
    generator.addCard(title, content);
  };

  private addCounter = (args: string[], generator: EnhancedWahyGenerator) => {
    const initialValue = parseInt(args[0]) || 0;
    const label = args[1];
    generator.addCounter(initialValue, label);
  };

  private startList = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.startList();
  };

  private startOrderedList = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.startOrderedList();
  };

  private endList = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.endList();
  };

  private addListItem = (args: string[], generator: EnhancedWahyGenerator) => {
    const text = args[0] || '';
    generator.addListItem(text);
  };

  private addHorizontalRule = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.addHorizontalRule();
  };

  private addSpace = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.addSpace();
  };

  private startSection = (args: string[], generator: EnhancedWahyGenerator) => {
    const className = args[0];
    generator.startSection(className);
  };

  private endSection = (args: string[], generator: EnhancedWahyGenerator) => {
    generator.endSection();
  };

  private changeBackgroundColor = (args: string[], generator: EnhancedWahyGenerator) => {
    const color = args[0] || 'white';
    generator.changeBackgroundColor(color);
  };

  private changeTextColor = (args: string[], generator: EnhancedWahyGenerator) => {
    const color = args[0] || 'black';
    generator.changeTextColor(color);
  };

  private changeFont = (args: string[], generator: EnhancedWahyGenerator) => {
    const font = args[0] || 'Arial';
    generator.changeFont(font);
  };

  private createVariable = (args: string[], generator: EnhancedWahyGenerator) => {
    const name = args[0] || '';
    const value = args[2] || '';
    let type: 'عدد' | 'نص' | 'منطقي' = 'نص';
    
    if (!isNaN(Number(value))) {
      type = 'عدد';
    } else if (value === 'صحيح' || value === 'خطأ') {
      type = 'منطقي';
    }
    
    generator.addVariable(name, value, type);
  };

  private onButtonClick = (args: string[], generator: EnhancedWahyGenerator) => {
    // سيتم تنفيذ هذا في المفسر الرئيسي
  };

  private executeAction = (args: string[], generator: EnhancedWahyGenerator) => {
    const action = args.join(' ');
    generator.addScript(action);
  };
}

// المفسر الرئيسي المحسن
export class EnhancedWahyInterpreter {
  private commands = new EnhancedWahyCommands();
  private htmlGenerator = new EnhancedWahyGenerator();
  private currentLine = 0;

  parseCommand(line: string): { command: string; args: string[] } | null {
    const trimmedLine = line.trim();
    
    // تجاهل الأسطر الفارغة والتعليقات
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
      return null;
    }

    // تحليل الأوامر بأنماط مختلفة
    const patterns = [
      // نمط: أمر "معامل1" "معامل2"
      /^(\S+)\s+"([^"]+)"\s+"([^"]+)"$/,
      // نمط: أمر "معامل"
      /^(\S+)\s+"([^"]+)"$/,
      // نمط: أمر معامل1 معامل2
      /^(\S+)\s+(.+)$/,
      // نمط: أمر فقط
      /^(\S+)$/
    ];

    for (const pattern of patterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        const command = match[1];
        const args = match.slice(2).filter(arg => arg !== undefined);
        
        // تحليل المعاملات المتعددة للنمط الثالث
        if (match.length === 3 && !trimmedLine.includes('"')) {
          const splitArgs = match[2].split(/\s+/);
          return { command, args: splitArgs };
        }
        
        return { command, args };
      }
    }

    return null;
  }

  interpretCode(lines: string[]): InterpretationResult {
    try {
      this.htmlGenerator.reset();
      this.currentLine = 0;

      for (let i = 0; i < lines.length; i++) {
        this.currentLine = i + 1;
        const line = lines[i];
        const parsed = this.parseCommand(line);
        
        if (parsed) {
          const { command, args } = parsed;
          const success = this.commands.executeCommand(command, args, this.htmlGenerator);
          
          if (!success) {
            return {
              success: false,
              error: `أمر غير معروف: ${command}`,
              lineNumber: this.currentLine
            };
          }
        }
      }

      const html = this.htmlGenerator.getHtml();
      return {
        success: true,
        html: html
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير محدد',
        lineNumber: this.currentLine
      };
    }
  }
}

// دالة مساعدة لتفسير كود وحي
export function interpretWahyCode(code: string): InterpretationResult {
  const interpreter = new EnhancedWahyInterpreter();
  const lines = code.split('\n');
  return interpreter.interpretCode(lines);
}