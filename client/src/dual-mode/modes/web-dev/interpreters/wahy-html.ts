/**
 * مفسر HTML محسن للويب - وضع تطوير الويب
 * Enhanced HTML Interpreter for Web Development Mode
 */

interface HTMLGeneratorState {
  htmlParts: string[];
  pageOpened: boolean;
  pageClosed: boolean;
  currentTitle: string;
  listStack: string[];
  sectionStack: string[];
  styles: Record<string, string>;
}

export class WahyHTMLInterpreter {
  private state: HTMLGeneratorState;
  private commands: Map<string, (args: string[]) => void>;

  constructor() {
    this.state = {
      htmlParts: [],
      pageOpened: false,
      pageClosed: false,
      currentTitle: '',
      listStack: [],
      sectionStack: [],
      styles: {}
    };

    this.initializeCommands();
  }

  /**
   * تهيئة أوامر HTML المتاحة
   */
  private initializeCommands(): void {
    this.commands = new Map([
      // أوامر الصفحة الأساسية
      ['افتح_صفحة', this.openPage.bind(this)],
      ['اغلق_صفحة', this.closePage.bind(this)],
      
      // أوامر النصوص
      ['اضف_عنوان', this.addHeading.bind(this)],
      ['اضف_عنوان_فرعي', this.addSubheading.bind(this)],
      ['اضف_فقرة', this.addParagraph.bind(this)],
      
      // أوامر الروابط والوسائط
      ['اضف_رابط', this.addLink.bind(this)],
      ['اضف_صورة', this.addImage.bind(this)],
      
      // أوامر القوائم
      ['ابدا_قائمة', this.startList.bind(this)],
      ['اغلق_قائمة', this.endList.bind(this)],
      ['ابدا_قائمة_مرقمة', this.startOrderedList.bind(this)],
      ['اغلق_قائمة_مرقمة', this.endOrderedList.bind(this)],
      ['اضف_عنصر_قائمة', this.addListItem.bind(this)],
      
      // أوامر التخطيط
      ['اضف_خط_فاصل', this.addHorizontalRule.bind(this)],
      ['اضف_مسافة', this.addSpace.bind(this)],
      ['ابدا_قسم', this.startSection.bind(this)],
      ['اغلق_قسم', this.endSection.bind(this)],
      
      // أوامر التنسيق
      ['غير_لون_الخلفية', this.changeBackgroundColor.bind(this)],
      ['غير_لون_النص', this.changeTextColor.bind(this)],
      ['غير_الخط', this.changeFont.bind(this)],
      
      // أوامر HTML5 المتقدمة
      ['اضف_فيديو', this.addVideo.bind(this)],
      ['اضف_صوت', this.addAudio.bind(this)],
      ['اضف_جدول', this.addTable.bind(this)],
      ['اضف_نموذج', this.addForm.bind(this)],
      ['اضف_زر', this.addButton.bind(this)]
    ]);
  }

  /**
   * تفسير سطر من كود وحي HTML
   */
  interpretLine(line: string): { success: boolean; error?: string } {
    try {
      const trimmedLine = line.trim();
      
      // تجاهل الأسطر الفارغة والتعليقات
      if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#')) {
        return { success: true };
      }

      // تحليل الأمر والمعاملات
      const parts = this.parseCommand(trimmedLine);
      if (!parts) {
        return { success: false, error: `تنسيق الأمر غير صحيح: ${trimmedLine}` };
      }

      const { command, args } = parts;

      // تنفيذ الأمر
      const commandFunction = this.commands.get(command);
      if (!commandFunction) {
        return { success: false, error: `أمر غير معروف: ${command}` };
      }

      commandFunction(args);
      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  /**
   * تحليل الأمر إلى اسم ومعاملات
   */
  private parseCommand(line: string): { command: string; args: string[] } | null {
    // دعم التنسيق: أمر "معامل1" "معامل2"
    const regex = /^(\S+)(?:\s+(.+))?$/;
    const match = line.match(regex);
    
    if (!match) return null;

    const command = match[1];
    const argsString = match[2] || '';
    
    // تحليل المعاملات مع دعم النصوص المحاطة بعلامات التنصيص
    const args: string[] = [];
    const argRegex = /"([^"]+)"|'([^']+)'|(\S+)/g;
    let argMatch;
    
    while ((argMatch = argRegex.exec(argsString)) !== null) {
      args.push(argMatch[1] || argMatch[2] || argMatch[3]);
    }
    
    return { command, args };
  }

  // === أوامر الصفحة الأساسية ===

  private openPage(args: string[]): void {
    if (this.state.pageOpened) {
      throw new Error('الصفحة مفتوحة بالفعل. استخدم "اغلق_صفحة" أولاً');
    }

    const title = args[0] || 'صفحة وحي';
    this.state.currentTitle = title;
    this.state.pageOpened = true;
    this.state.pageClosed = false;

    this.state.htmlParts = [
      '<!DOCTYPE html>',
      '<html lang="ar" dir="rtl">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `  <title>${this.escapeHtml(title)}</title>`,
      '  <style>',
      '    body { font-family: "Segoe UI", Tahoma, Arial, sans-serif; margin: 40px; line-height: 1.6; }',
      '    .section { margin: 20px 0; padding: 15px; border-radius: 8px; }',
      '    img { max-width: 100%; height: auto; border-radius: 4px; }',
      '    table { border-collapse: collapse; width: 100%; margin: 20px 0; }',
      '    th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }',
      '    th { background-color: #f2f2f2; }',
      '  </style>',
      '</head>',
      '<body>'
    ];
  }

  private closePage(args: string[]): void {
    if (!this.state.pageOpened) {
      throw new Error('لا توجد صفحة مفتوحة');
    }

    // إغلاق أي عناصر مفتوحة
    while (this.state.listStack.length > 0) {
      this.endList([]);
    }
    while (this.state.sectionStack.length > 0) {
      this.endSection([]);
    }

    this.state.htmlParts.push('</body>', '</html>');
    this.state.pageClosed = true;
  }

  // === أوامر النصوص ===

  private addHeading(args: string[]): void {
    this.ensurePageOpen();
    const text = args[0] || 'عنوان';
    const level = parseInt(args[1]) || 1;
    const clampedLevel = Math.max(1, Math.min(6, level));
    
    this.state.htmlParts.push(`<h${clampedLevel}>${this.escapeHtml(text)}</h${clampedLevel}>`);
  }

  private addSubheading(args: string[]): void {
    this.ensurePageOpen();
    const text = args[0] || 'عنوان فرعي';
    this.state.htmlParts.push(`<h2>${this.escapeHtml(text)}</h2>`);
  }

  private addParagraph(args: string[]): void {
    this.ensurePageOpen();
    const text = args[0] || 'فقرة نصية';
    this.state.htmlParts.push(`<p>${this.escapeHtml(text)}</p>`);
  }

  // === أوامر الروابط والوسائط ===

  private addLink(args: string[]): void {
    this.ensurePageOpen();
    const text = args[0] || 'رابط';
    const url = args[1] || '#';
    
    this.state.htmlParts.push(
      `<a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(text)}</a>`
    );
  }

  private addImage(args: string[]): void {
    this.ensurePageOpen();
    const url = args[0] || 'https://via.placeholder.com/300x200?text=صورة+تجريبية';
    const alt = args[1] || 'صورة';
    
    this.state.htmlParts.push(
      `<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(alt)}" />`
    );
  }

  private addVideo(args: string[]): void {
    this.ensurePageOpen();
    const url = args[0] || '';
    const width = args[1] || '640';
    const height = args[2] || '360';
    
    this.state.htmlParts.push(
      `<video width="${width}" height="${height}" controls>`,
      `  <source src="${this.escapeHtml(url)}" type="video/mp4">`,
      '  متصفحك لا يدعم عرض الفيديو.',
      '</video>'
    );
  }

  private addAudio(args: string[]): void {
    this.ensurePageOpen();
    const url = args[0] || '';
    
    this.state.htmlParts.push(
      '<audio controls>',
      `  <source src="${this.escapeHtml(url)}" type="audio/mpeg">`,
      '  متصفحك لا يدعم تشغيل الصوت.',
      '</audio>'
    );
  }

  // === أوامر القوائم ===

  private startList(args: string[]): void {
    this.ensurePageOpen();
    this.state.listStack.push('ul');
    this.state.htmlParts.push('<ul>');
  }

  private startOrderedList(args: string[]): void {
    this.ensurePageOpen();
    this.state.listStack.push('ol');
    this.state.htmlParts.push('<ol>');
  }

  private endList(args: string[]): void {
    if (this.state.listStack.length === 0) {
      throw new Error('لا توجد قائمة مفتوحة');
    }

    const listType = this.state.listStack.pop();
    this.state.htmlParts.push(`</${listType}>`);
  }

  private endOrderedList(args: string[]): void {
    this.endList(args);
  }

  private addListItem(args: string[]): void {
    if (this.state.listStack.length === 0) {
      throw new Error('يجب فتح قائمة أولاً');
    }

    const text = args[0] || 'عنصر قائمة';
    this.state.htmlParts.push(`  <li>${this.escapeHtml(text)}</li>`);
  }

  // === أوامر التخطيط ===

  private addHorizontalRule(args: string[]): void {
    this.ensurePageOpen();
    this.state.htmlParts.push('<hr>');
  }

  private addSpace(args: string[]): void {
    this.ensurePageOpen();
    this.state.htmlParts.push('<br>');
  }

  private startSection(args: string[]): void {
    this.ensurePageOpen();
    const cssClass = args[0] || '';
    const classAttr = cssClass ? ` class="${this.escapeHtml(cssClass)}"` : '';
    
    this.state.sectionStack.push('div');
    this.state.htmlParts.push(`<div${classAttr}>`);
  }

  private endSection(args: string[]): void {
    if (this.state.sectionStack.length === 0) {
      throw new Error('لا يوجد قسم مفتوح');
    }

    this.state.sectionStack.pop();
    this.state.htmlParts.push('</div>');
  }

  // === أوامر التنسيق ===

  private changeBackgroundColor(args: string[]): void {
    this.ensurePageOpen();
    const color = args[0] || '#ffffff';
    this.state.styles['background-color'] = color;
    this.updateBodyStyles();
  }

  private changeTextColor(args: string[]): void {
    this.ensurePageOpen();
    const color = args[0] || '#000000';
    this.state.styles['color'] = color;
    this.updateBodyStyles();
  }

  private changeFont(args: string[]): void {
    this.ensurePageOpen();
    const font = args[0] || 'Arial';
    this.state.styles['font-family'] = `'${font}', sans-serif`;
    this.updateBodyStyles();
  }

  // === أوامر HTML5 المتقدمة ===

  private addTable(args: string[]): void {
    this.ensurePageOpen();
    const headers = args[0]?.split(',') || ['العمود 1', 'العمود 2'];
    
    this.state.htmlParts.push('<table>');
    this.state.htmlParts.push('  <thead>');
    this.state.htmlParts.push('    <tr>');
    
    headers.forEach(header => {
      this.state.htmlParts.push(`      <th>${this.escapeHtml(header.trim())}</th>`);
    });
    
    this.state.htmlParts.push('    </tr>');
    this.state.htmlParts.push('  </thead>');
    this.state.htmlParts.push('  <tbody>');
    this.state.htmlParts.push('    <tr>');
    
    headers.forEach(() => {
      this.state.htmlParts.push('      <td>بيانات</td>');
    });
    
    this.state.htmlParts.push('    </tr>');
    this.state.htmlParts.push('  </tbody>');
    this.state.htmlParts.push('</table>');
  }

  private addForm(args: string[]): void {
    this.ensurePageOpen();
    const action = args[0] || '#';
    
    this.state.htmlParts.push(
      `<form action="${this.escapeHtml(action)}" method="post">`,
      '  <label for="input1">الحقل الأول:</label>',
      '  <input type="text" id="input1" name="input1" required>',
      '  <br><br>',
      '  <label for="input2">الحقل الثاني:</label>',
      '  <textarea id="input2" name="input2" rows="4" cols="50"></textarea>',
      '  <br><br>',
      '  <input type="submit" value="إرسال">',
      '</form>'
    );
  }

  private addButton(args: string[]): void {
    this.ensurePageOpen();
    const text = args[0] || 'زر';
    const onclick = args[1] || '';
    const onclickAttr = onclick ? ` onclick="${this.escapeHtml(onclick)}"` : '';
    
    this.state.htmlParts.push(
      `<button type="button"${onclickAttr}>${this.escapeHtml(text)}</button>`
    );
  }

  // === مساعدات ===

  private ensurePageOpen(): void {
    if (!this.state.pageOpened) {
      this.openPage(['صفحة وحي']);
    }
  }

  private updateBodyStyles(): void {
    // تحديث الأنماط في head الصفحة
    const styleIndex = this.state.htmlParts.findIndex(part => part.includes('<style>'));
    if (styleIndex !== -1) {
      let bodyStyle = 'body { font-family: "Segoe UI", Tahoma, Arial, sans-serif; margin: 40px; line-height: 1.6;';
      
      Object.entries(this.state.styles).forEach(([property, value]) => {
        bodyStyle += ` ${property}: ${value};`;
      });
      
      bodyStyle += ' }';
      
      // استبدال نمط body
      for (let i = styleIndex; i < this.state.htmlParts.length; i++) {
        if (this.state.htmlParts[i].includes('body {')) {
          this.state.htmlParts[i] = `    ${bodyStyle}`;
          break;
        }
      }
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

  // === API العامة ===

  /**
   * الحصول على HTML المُنتج
   */
  getHtml(): string {
    if (!this.state.pageClosed && this.state.pageOpened) {
      // إنشاء نسخة مؤقتة مع إغلاق الصفحة
      const tempParts = [...this.state.htmlParts];
      
      // إغلاق أي عناصر مفتوحة
      const tempListStack = [...this.state.listStack];
      const tempSectionStack = [...this.state.sectionStack];
      
      while (tempListStack.length > 0) {
        const listType = tempListStack.pop();
        tempParts.push(`</${listType}>`);
      }
      
      while (tempSectionStack.length > 0) {
        tempSectionStack.pop();
        tempParts.push('</div>');
      }
      
      tempParts.push('</body>', '</html>');
      return tempParts.join('\n');
    }

    return this.state.htmlParts.join('\n');
  }

  /**
   * إعادة تعيين المفسر
   */
  reset(): void {
    this.state = {
      htmlParts: [],
      pageOpened: false,
      pageClosed: false,
      currentTitle: '',
      listStack: [],
      sectionStack: [],
      styles: {}
    };
  }

  /**
   * التحقق من اكتمال الصفحة
   */
  isPageComplete(): boolean {
    return this.state.pageOpened && this.state.pageClosed;
  }

  /**
   * الحصول على الأوامر المتاحة
   */
  getAvailableCommands(): string[] {
    return Array.from(this.commands.keys());
  }
}