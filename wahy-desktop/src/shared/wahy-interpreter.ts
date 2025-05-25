/**
 * Wahy Language Interpreter for Desktop
 * مفسر لغة وحي لتطبيق سطح المكتب
 */

export interface InterpretationResult {
  success: boolean;
  html?: string;
  css?: string;
  javascript?: string;
  combinedOutput?: string;
  error?: string;
  warnings?: string[];
  type?: 'html' | 'css' | 'javascript' | 'mixed';
}

export class WahyInterpreter {
  private currentCode: string = '';
  private htmlParts: string[] = [];
  private cssParts: string[] = [];
  private jsParts: string[] = [];

  interpret(code: string): InterpretationResult {
    this.currentCode = code;
    this.reset();

    try {
      const lines = code.split('\n');
      let currentMode: 'html' | 'css' | 'js' = 'html';
      let pageOpened = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line || line.startsWith('#') || line.startsWith('//')) {
          continue;
        }

        // تحديد نوع القسم
        if (line === 'ابدأ_CSS' || line === 'بداية_CSS') {
          currentMode = 'css';
          continue;
        }
        if (line === 'أنهِ_CSS' || line === 'نهاية_CSS') {
          currentMode = 'html';
          continue;
        }
        if (line === 'ابدأ_JS' || line === 'بداية_JS' || line === 'ابدأ_JavaScript') {
          currentMode = 'js';
          continue;
        }
        if (line === 'أنهِ_JS' || line === 'نهاية_JS' || line === 'أنهِ_JavaScript') {
          currentMode = 'html';
          continue;
        }

        // تفسير الأوامر حسب النوع
        switch (currentMode) {
          case 'html':
            this.processHTMLCommand(line);
            if (line.includes('افتح صفحة')) pageOpened = true;
            break;
          case 'css':
            this.processCSSCommand(line);
            break;
          case 'js':
            this.processJSCommand(line);
            break;
        }
      }

      // إغلاق الصفحة إذا لم تُغلق
      if (pageOpened && !this.htmlParts.join('').includes('</html>')) {
        this.htmlParts.push('</body>');
        this.htmlParts.push('</html>');
      }

      return this.generateResult();

    } catch (error) {
      return {
        success: false,
        error: `خطأ في التفسير: ${error}`,
        type: 'html'
      };
    }
  }

  private reset(): void {
    this.htmlParts = [];
    this.cssParts = [];
    this.jsParts = [];
  }

  private processHTMLCommand(line: string): void {
    const { command, args } = this.parseCommand(line);

    switch (command) {
      case 'افتح صفحة':
      case 'أنشئ صفحة':
        this.openPage(args[0] || 'صفحة وحي');
        break;

      case 'أغلق صفحة':
        this.closePage();
        break;

      case 'أضف عنوان':
        this.addHeading(args[0] || '', 1);
        break;

      case 'أضف عنوان_فرعي':
        this.addHeading(args[0] || '', 2);
        break;

      case 'أضف فقرة':
        this.addParagraph(args[0] || '');
        break;

      case 'أضف رابط':
        this.addLink(args[0] || '', args[1] || '#');
        break;

      case 'أضف صورة':
        this.addImage(args[1] || '', args[0] || 'صورة');
        break;

      case 'أنشئ_زر':
        this.addButton(args[0] || 'زر', args[1] || '');
        break;

      case 'أضف_نص':
        this.addText(args[0] || '');
        break;

      case 'ابدأ قائمة':
        this.startList();
        break;

      case 'أضف عنصر':
        this.addListItem(args[0] || '');
        break;

      case 'أنهِ قائمة':
        this.endList();
        break;

      case 'أضف خط_فاصل':
        this.addHorizontalRule();
        break;

      case 'أضف مسافة':
        this.addSpace();
        break;

      case 'غيّر لون_الخلفية':
        this.changeBackgroundColor(args[1] || args[0] || 'white');
        break;

      case 'غيّر لون_النص':
        this.changeTextColor(args[1] || args[0] || 'black');
        break;

      case 'اطبع':
        this.addConsoleLog(args[0] || '');
        break;
    }
  }

  private processCSSCommand(line: string): void {
    const { command, args } = this.parseCommand(line);

    switch (command) {
      case 'اختر':
        this.cssParts.push(`${args[0]} {`);
        break;

      case 'لون':
      case 'لون_النص':
        this.cssParts.push(`  color: ${args[0]};`);
        break;

      case 'لون_الخلفية':
        this.cssParts.push(`  background-color: ${args[0]};`);
        break;

      case 'الخط':
        this.cssParts.push(`  font-family: '${args[0]}', sans-serif;`);
        break;

      case 'حجم_الخط':
        this.cssParts.push(`  font-size: ${args[0]};`);
        break;

      case 'العرض':
        this.cssParts.push(`  width: ${args[0]};`);
        break;

      case 'الارتفاع':
        this.cssParts.push(`  height: ${args[0]};`);
        break;

      case 'الهامش':
        this.cssParts.push(`  margin: ${args[0]};`);
        break;

      case 'البطانة':
        this.cssParts.push(`  padding: ${args[0]};`);
        break;

      case '}':
        this.cssParts.push('}');
        break;
    }
  }

  private processJSCommand(line: string): void {
    const { command, args } = this.parseCommand(line);

    switch (command) {
      case 'متغير':
        this.jsParts.push(`let ${args[0]} = ${this.processValue(args[1] || 'null')};`);
        break;

      case 'اطبع':
        this.jsParts.push(`console.log(${this.processValue(args[0] || '')});`);
        break;

      case 'أظهر_رسالة':
        this.jsParts.push(`alert(${this.processValue(args[0] || '')});`);
        break;

      case 'دالة':
        this.jsParts.push(`function ${args[0]}() {`);
        break;

      case 'أنهِ_دالة':
        this.jsParts.push('}');
        break;

      case 'إذا':
        this.jsParts.push(`if (${this.processCondition(args[0] || 'true')}) {`);
        break;

      case 'وإلا':
        this.jsParts.push('} else {');
        break;

      case 'أنهِ_إذا':
        this.jsParts.push('}');
        break;

      case 'كرر':
        const count = args[0] || '1';
        this.jsParts.push(`for (let i = 0; i < ${count}; i++) {`);
        break;

      case 'طالما':
        this.jsParts.push(`while (${this.processCondition(args[0] || 'false')}) {`);
        break;

      case 'أنهِ_حلقة':
        this.jsParts.push('}');
        break;

      case 'عند_الضغط':
        const elementId = args[0] || '';
        const action = args[1] || '';
        this.jsParts.push(`document.getElementById('${elementId}').onclick = function() {`);
        this.jsParts.push(`  ${action};`);
        this.jsParts.push('};');
        break;
    }
  }

  private parseCommand(line: string): { command: string; args: string[] } {
    // استخراج النصوص المقتبسة
    const quotesPattern = /"([^"]*)"/g;
    const quotedStrings: string[] = [];
    let match;
    while ((match = quotesPattern.exec(line)) !== null) {
      quotedStrings.push(match[1]);
    }

    // إزالة النصوص المقتبسة مؤقتاً
    let tempLine = line.replace(quotesPattern, '___QUOTED___');
    const words = tempLine.split(/\s+/);

    // استبدال العناصر النائبة بالنصوص الفعلية
    let quoteIndex = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i] === '___QUOTED___') {
        if (quoteIndex < quotedStrings.length) {
          words[i] = quotedStrings[quoteIndex];
          quoteIndex++;
        }
      }
    }

    // تحديد الأمر والمعاملات
    let command: string;
    let args: string[];

    if (words.length >= 2 && ['صفحة', 'عنوان', 'فقرة', 'رابط', 'صورة'].includes(words[1])) {
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

  private processValue(value: string): string {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value;
    }
    if (!isNaN(Number(value))) {
      return value;
    }
    if (value === 'صحيح') return 'true';
    if (value === 'خطأ') return 'false';
    return `"${value}"`;
  }

  private processCondition(condition: string): string {
    let jsCondition = condition;
    jsCondition = jsCondition.replace(/أكبر_من/g, '>');
    jsCondition = jsCondition.replace(/أصغر_من/g, '<');
    jsCondition = jsCondition.replace(/يساوي/g, '==');
    jsCondition = jsCondition.replace(/و/g, '&&');
    jsCondition = jsCondition.replace(/أو/g, '||');
    return jsCondition;
  }

  private openPage(title: string): void {
    this.htmlParts.push('<!DOCTYPE html>');
    this.htmlParts.push('<html lang="ar" dir="rtl">');
    this.htmlParts.push('<head>');
    this.htmlParts.push('<meta charset="UTF-8">');
    this.htmlParts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    this.htmlParts.push(`<title>${this.escapeHtml(title)}</title>`);
    this.htmlParts.push('<style>');
    this.htmlParts.push('body { font-family: "Arial", sans-serif; margin: 20px; background: white; color: black; }');
    this.htmlParts.push('.wahy-button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }');
    this.htmlParts.push('.wahy-button:hover { background: #0056b3; }');
    this.htmlParts.push('</style>');
    this.htmlParts.push('</head>');
    this.htmlParts.push('<body>');
  }

  private closePage(): void {
    this.htmlParts.push('</body>');
    this.htmlParts.push('</html>');
  }

  private addHeading(text: string, level: number): void {
    this.htmlParts.push(`<h${level}>${this.escapeHtml(text)}</h${level}>`);
  }

  private addParagraph(text: string): void {
    this.htmlParts.push(`<p>${this.escapeHtml(text)}</p>`);
  }

  private addLink(text: string, url: string): void {
    this.htmlParts.push(`<a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(text)}</a>`);
  }

  private addImage(url: string, alt: string): void {
    this.htmlParts.push(`<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(alt)}" style="max-width: 100%; height: auto;">`);
  }

  private addButton(text: string, onclick: string): void {
    const onclickAttr = onclick ? ` onclick="${this.escapeHtml(onclick)}"` : '';
    this.htmlParts.push(`<button class="wahy-button"${onclickAttr}>${this.escapeHtml(text)}</button>`);
  }

  private addText(text: string): void {
    this.htmlParts.push(`<span>${this.escapeHtml(text)}</span>`);
  }

  private startList(): void {
    this.htmlParts.push('<ul>');
  }

  private addListItem(text: string): void {
    this.htmlParts.push(`<li>${this.escapeHtml(text)}</li>`);
  }

  private endList(): void {
    this.htmlParts.push('</ul>');
  }

  private addHorizontalRule(): void {
    this.htmlParts.push('<hr>');
  }

  private addSpace(): void {
    this.htmlParts.push('<br>');
  }

  private changeBackgroundColor(color: string): void {
    this.htmlParts.push(`<style>body { background-color: ${color}; }</style>`);
  }

  private changeTextColor(color: string): void {
    this.htmlParts.push(`<style>body { color: ${color}; }</style>`);
  }

  private addConsoleLog(message: string): void {
    this.jsParts.push(`console.log(${this.processValue(message)});`);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  private generateResult(): InterpretationResult {
    const html = this.htmlParts.join('\n');
    const css = this.cssParts.join('\n');
    const javascript = this.jsParts.join('\n');

    // دمج النتائج
    let combinedOutput = html;

    // إدراج CSS إذا وُجد
    if (css && html.includes('</head>')) {
      const cssSection = `\n<style>\n${css}\n</style>`;
      combinedOutput = combinedOutput.replace('</head>', cssSection + '\n</head>');
    }

    // إدراج JavaScript إذا وُجد
    if (javascript && html.includes('</body>')) {
      const jsSection = `\n<script>\n${javascript}\n</script>`;
      combinedOutput = combinedOutput.replace('</body>', jsSection + '\n</body>');
    }

    return {
      success: true,
      html,
      css,
      javascript,
      combinedOutput,
      type: 'mixed'
    };
  }
}