interface InterpretationResult {
  success: boolean;
  html?: string;
  error?: string;
  lineNumber?: number;
}

// واجهة لتخزين المتغيرات والوظائف
interface WahyVariable {
  name: string;
  value: any;
  type: 'number' | 'string' | 'boolean';
}

interface WahyFunction {
  name: string;
  element: string;
  event: string;
  actions: string[];
}

// واجهة لتخزين أنماط CSS
interface WahyStyle {
  selector: string;
  properties: Record<string, string>;
}

class WahyHTMLGenerator {
  private htmlParts: string[] = [];
  private pageOpened = false;
  private pageClosed = false;
  private customStyles: WahyStyle[] = [];
  private variables: WahyVariable[] = [];
  private functions: WahyFunction[] = [];
  private listStack: string[] = [];
  private sectionStack: string[] = [];
  private elementCounter = 0;
  private scriptParts: string[] = [];

  reset() {
    this.htmlParts = [];
    this.pageOpened = false;
    this.pageClosed = false;
    this.customStyles = [];
    this.variables = [];
    this.functions = [];
    this.listStack = [];
    this.sectionStack = [];
    this.elementCounter = 0;
    this.scriptParts = [];
  }

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
    this.htmlParts.push('body { font-family: "Noto Sans Arabic", "Arial", sans-serif; margin: 20px; padding: 20px; background-color: white; color: #333; }');
    this.htmlParts.push('h1, h2, h3, h4, h5, h6 { color: #333; margin: 15px 0; }');
    this.htmlParts.push('p { line-height: 1.6; margin: 10px 0; }');
    this.htmlParts.push('ul, ol { margin: 10px 0; padding-right: 20px; }');
    this.htmlParts.push('li { margin: 5px 0; }');
    this.htmlParts.push('a { color: #007bff; text-decoration: none; transition: color 0.3s; }');
    this.htmlParts.push('a:hover { text-decoration: underline; color: #0056b3; }');
    this.htmlParts.push('img { max-width: 100%; height: auto; margin: 10px 0; border-radius: 5px; }');
    this.htmlParts.push('hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }');
    this.htmlParts.push('.section { margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; background: #f9f9f9; }');
    this.htmlParts.push('button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; font-family: inherit; transition: all 0.3s; }');
    this.htmlParts.push('button:hover { opacity: 0.8; transform: translateY(-2px); }');
    this.htmlParts.push('.btn-primary { background-color: #007bff; color: white; }');
    this.htmlParts.push('.btn-success { background-color: #28a745; color: white; }');
    this.htmlParts.push('.btn-danger { background-color: #dc3545; color: white; }');
    this.htmlParts.push('.btn-warning { background-color: #ffc107; color: #333; }');
    this.htmlParts.push('.center-text { text-align: center; }');
    this.htmlParts.push('.large-text { font-size: 1.5em; }');
    this.htmlParts.push('.small-text { font-size: 0.8em; }');
    this.htmlParts.push('.bold-text { font-weight: bold; }');
    this.htmlParts.push('.counter { font-size: 2em; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }');

    this.pageOpened = true;
  }

  closePage() {
    if (!this.pageOpened) {
      throw new Error('لا يوجد صفحة مفتوحة للإغلاق');
    }
    if (this.pageClosed) {
      throw new Error('الصفحة مغلقة بالفعل');
    }

    // Close any open lists
    while (this.listStack.length > 0) {
      const listType = this.listStack.pop();
      this.htmlParts.push(`</${listType}>`);
    }

    // Close any open sections
    while (this.sectionStack.length > 0) {
      this.sectionStack.pop();
      this.htmlParts.push('</div>');
    }

    // Add dynamic styles
    if (Object.keys(this.styles).length > 0) {
      this.htmlParts.push('<style>');
      for (const [selector, properties] of Object.entries(this.styles)) {
        const styleRules = Object.entries(properties)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');
        this.htmlParts.push(`${selector} { ${styleRules}; }`);
      }
      this.htmlParts.push('</style>');
    }

    this.htmlParts.push('</body>');
    this.htmlParts.push('</html>');

    this.pageClosed = true;
  }

  addHeading(text: string, level: number = 1) {
    this.ensurePageOpen();
    level = Math.max(1, Math.min(6, level));
    this.htmlParts.push(`<h${level}>${this.escapeHtml(text)}</h${level}>`);
  }

  addSubheading(text: string) {
    this.addHeading(text, 2);
  }

  addParagraph(text: string) {
    this.ensurePageOpen();
    this.htmlParts.push(`<p>${this.escapeHtml(text)}</p>`);
  }

  addLink(text: string, url: string) {
    this.ensurePageOpen();
    const safeUrl = this.escapeHtml(url);
    const safeText = this.escapeHtml(text);
    this.htmlParts.push(`<a href="${safeUrl}">${safeText}</a>`);
  }

  addImage(url: string, altText: string) {
    this.ensurePageOpen();
    const safeUrl = this.escapeHtml(url);
    const safeAlt = this.escapeHtml(altText);
    this.htmlParts.push(`<img src="${safeUrl}" alt="${safeAlt}">`);
  }

  startList() {
    this.ensurePageOpen();
    this.htmlParts.push('<ul>');
    this.listStack.push('ul');
  }

  startOrderedList() {
    this.ensurePageOpen();
    this.htmlParts.push('<ol>');
    this.listStack.push('ol');
  }

  endList() {
    this.ensurePageOpen();
    if (this.listStack.length === 0) {
      throw new Error('لا توجد قائمة مفتوحة لإنهائها');
    }

    const listType = this.listStack.pop();
    this.htmlParts.push(`</${listType}>`);
  }

  addListItem(text: string) {
    this.ensurePageOpen();
    if (this.listStack.length === 0) {
      throw new Error('لا توجد قائمة مفتوحة لإضافة عنصر إليها');
    }

    this.htmlParts.push(`<li>${this.escapeHtml(text)}</li>`);
  }

  addHorizontalRule() {
    this.ensurePageOpen();
    this.htmlParts.push('<hr>');
  }

  addSpace() {
    this.ensurePageOpen();
    this.htmlParts.push('<br>');
  }

  startSection(cssClass?: string) {
    this.ensurePageOpen();
    if (cssClass) {
      this.htmlParts.push(`<div class="${this.escapeHtml(cssClass)}">`);
    } else {
      this.htmlParts.push('<div class="section">');
    }
    this.sectionStack.push(cssClass || 'section');
  }

  endSection() {
    this.ensurePageOpen();
    if (this.sectionStack.length === 0) {
      throw new Error('لا يوجد قسم مفتوح لإنهائه');
    }

    this.sectionStack.pop();
    this.htmlParts.push('</div>');
  }

  changeBackgroundColor(color: string) {
    this.ensurePageOpen();
    if (!this.styles['body']) {
      this.styles['body'] = {};
    }
    this.styles['body']['background-color'] = color;
  }

  changeTextColor(color: string) {
    this.ensurePageOpen();
    if (!this.styles['body']) {
      this.styles['body'] = {};
    }
    this.styles['body']['color'] = color;
  }

  changeFont(font: string) {
    this.ensurePageOpen();
    if (!this.styles['body']) {
      this.styles['body'] = {};
    }
    this.styles['body']['font-family'] = font;
  }

  getHtml(): string {
    return this.htmlParts.join('\n');
  }

  isPageComplete(): boolean {
    return this.pageOpened && this.pageClosed;
  }

  private ensurePageOpen() {
    if (!this.pageOpened) {
      throw new Error('يجب فتح صفحة أولاً باستخدام "افتح صفحة"');
    }
    if (this.pageClosed) {
      throw new Error('الصفحة مغلقة. لا يمكن إضافة محتوى جديد');
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

class WahyCommands {
  private commandMap: Record<string, (args: string[], generator: WahyHTMLGenerator) => void>;

  constructor() {
    this.commandMap = {
      'افتح صفحة': this.openPage,
      'أغلق صفحة': this.closePage,
      'أضف عنوان': this.addHeading,
      'أضف فقرة': this.addParagraph,
      'أضف رابط': this.addLink,
      'أضف صورة': this.addImage,
      'غيّر لون_الخلفية إلى': this.changeBackgroundColor,
      'غيّر لون_النص إلى': this.changeTextColor,
      'غيّر الخط إلى': this.changeFont,
      'ابدأ قائمة': this.startList,
      'أنهِ قائمة': this.endList,
      'أضف عنصر': this.addListItem,
      'ابدأ قائمة_مرقمة': this.startOrderedList,
      'أنهِ قائمة_مرقمة': this.endOrderedList,
      'أضف عنوان_فرعي': this.addSubheading,
      'أضف خط_فاصل': this.addHorizontalRule,
      'أضف مسافة': this.addSpace,
      'ابدأ قسم': this.startSection,
      'أنهِ قسم': this.endSection,
    };
  }

  executeCommand(command: string, args: string[], generator: WahyHTMLGenerator): boolean {
    if (command in this.commandMap) {
      try {
        this.commandMap[command](args, generator);
        return true;
      } catch (error) {
        throw new Error(`خطأ في تنفيذ الأمر "${command}": ${(error as Error).message}`);
      }
    }
    return false;
  }

  private openPage = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "افتح صفحة" يحتاج إلى عنوان الصفحة');
    }
    generator.openPage(args[0]);
  };

  private closePage = (args: string[], generator: WahyHTMLGenerator) => {
    generator.closePage();
  };

  private addHeading = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "أضف عنوان" يحتاج إلى نص العنوان');
    }
    generator.addHeading(args[0]);
  };

  private addSubheading = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "أضف عنوان_فرعي" يحتاج إلى نص العنوان');
    }
    generator.addSubheading(args[0]);
  };

  private addParagraph = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "أضف فقرة" يحتاج إلى نص الفقرة');
    }
    generator.addParagraph(args[0]);
  };

  private addLink = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 2) {
      throw new Error('أمر "أضف رابط" يحتاج إلى نص الرابط و URL');
    }
    generator.addLink(args[0], args[1]);
  };

  private addImage = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 2) {
      throw new Error('أمر "أضف صورة" يحتاج إلى URL الصورة ووصف');
    }
    generator.addImage(args[0], args[1]);
  };

  private changeBackgroundColor = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "غيّر لون_الخلفية" يحتاج إلى اسم اللون');
    }
    generator.changeBackgroundColor(args[0]);
  };

  private changeTextColor = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "غيّر لون_النص" يحتاج إلى اسم اللون');
    }
    generator.changeTextColor(args[0]);
  };

  private changeFont = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "غيّر الخط" يحتاج إلى اسم نوع الخط');
    }
    generator.changeFont(args[0]);
  };

  private startList = (args: string[], generator: WahyHTMLGenerator) => {
    generator.startList();
  };

  private endList = (args: string[], generator: WahyHTMLGenerator) => {
    generator.endList();
  };

  private startOrderedList = (args: string[], generator: WahyHTMLGenerator) => {
    generator.startOrderedList();
  };

  private endOrderedList = (args: string[], generator: WahyHTMLGenerator) => {
    generator.endList();
  };

  private addListItem = (args: string[], generator: WahyHTMLGenerator) => {
    if (args.length < 1) {
      throw new Error('أمر "أضف عنصر" يحتاج إلى نص العنصر');
    }
    generator.addListItem(args[0]);
  };

  private addHorizontalRule = (args: string[], generator: WahyHTMLGenerator) => {
    generator.addHorizontalRule();
  };

  private addSpace = (args: string[], generator: WahyHTMLGenerator) => {
    generator.addSpace();
  };

  private startSection = (args: string[], generator: WahyHTMLGenerator) => {
    const cssClass = args.length > 0 ? args[0] : undefined;
    generator.startSection(cssClass);
  };

  private endSection = (args: string[], generator: WahyHTMLGenerator) => {
    generator.endSection();
  };
}

export class WahyInterpreter {
  private commands = new WahyCommands();
  private htmlGenerator = new WahyHTMLGenerator();
  private currentLine = 0;

  parseCommand(line: string): { command: string; args: string[] } | null {
    line = line.trim();
    if (!line || line.startsWith('#')) {
      return null;
    }

    // Extract quoted strings
    const quotesPattern = /"([^"]*)"/g;
    const quotedStrings: string[] = [];
    let match;
    while ((match = quotesPattern.exec(line)) !== null) {
      quotedStrings.push(match[1]);
    }

    // Remove quoted strings temporarily for command parsing
    let tempLine = line.replace(quotesPattern, '___QUOTED___');

    // Split the line into words
    const words = tempLine.split(/\s+/);

    if (words.length === 0) {
      return null;
    }

    // Reconstruct command by replacing placeholders with actual quotes
    let quoteIndex = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i] === '___QUOTED___') {
        if (quoteIndex < quotedStrings.length) {
          words[i] = quotedStrings[quoteIndex];
          quoteIndex++;
        } else {
          words[i] = '';
        }
      }
    }

    // Determine command and arguments
    let command: string;
    let args: string[];

    if (words.length >= 2 && ['صفحة', 'عنوان', 'فقرة', 'رابط', 'صورة', 'عنصر'].includes(words[1])) {
      command = words.slice(0, 2).join(' ');
      args = words.slice(2);
    } else if (words.length >= 3 && words[0] === 'غيّر') {
      command = words.slice(0, 3).join(' ');
      args = words.slice(3);
    } else if (['ابدأ', 'أنهِ'].includes(words[0])) {
      command = words.length >= 2 ? words.slice(0, 2).join(' ') : words[0];
      args = words.slice(words.length >= 2 ? 2 : 1);
    } else {
      command = words[0];
      args = words.slice(1);
    }

    return { command, args };
  }

  interpretCode(lines: string[]): InterpretationResult {
    this.currentLine = 0;
    this.htmlGenerator.reset();

    for (let i = 0; i < lines.length; i++) {
      this.currentLine = i + 1;

      const parsed = this.parseCommand(lines[i]);
      if (parsed === null) {
        continue;
      }

      const { command, args } = parsed;

      try {
        if (!this.commands.executeCommand(command, args, this.htmlGenerator)) {
          return {
            success: false,
            error: `أمر غير معروف: ${command}`,
            lineNumber: this.currentLine
          };
        }
      } catch (error) {
        return {
          success: false,
          error: `خطأ في السطر ${this.currentLine}: ${(error as Error).message}`,
          lineNumber: this.currentLine
        };
      }
    }

    // Validate that the page was properly closed
    if (!this.htmlGenerator.isPageComplete()) {
      return {
        success: false,
        error: 'الصفحة لم يتم إغلاقها بشكل صحيح. استخدم "أغلق صفحة"',
        lineNumber: lines.length
      };
    }

    const htmlOutput = this.htmlGenerator.getHtml();

    return {
      success: true,
      html: htmlOutput
    };
  }
}

export function interpretWahyCode(code: string): InterpretationResult {
  const interpreter = new WahyInterpreter();
  const lines = code.split('\n');
  return interpreter.interpretCode(lines);
}