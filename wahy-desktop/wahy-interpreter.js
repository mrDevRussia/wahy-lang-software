/**
 * Wahy Language Interpreter
 * مفسر لغة وحي للبرمجة العربية
 */

class WahyInterpreter {
  constructor() {
    this.htmlParts = [];
    this.isPageOpen = false;
    this.currentListType = null;
    this.openTags = [];
    this.variables = new Map();
  }

  interpret(code) {
    try {
      this.reset();
      const lines = code.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line || line.startsWith('#') || line.startsWith('//')) {
          continue;
        }

        this.processLine(line);
      }

      // إغلاق الصفحة تلقائياً إذا لم تُغلق
      if (this.isPageOpen) {
        this.closePage();
      }

      return {
        success: true,
        html: this.htmlParts.join('\n')
      };

    } catch (error) {
      return {
        success: false,
        error: `خطأ في السطر: ${error.message}`
      };
    }
  }

  reset() {
    this.htmlParts = [];
    this.isPageOpen = false;
    this.currentListType = null;
    this.openTags = [];
    this.variables.clear();
  }

  processLine(line) {
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
      case 'أضف زر':
        this.addButton(args[0] || 'زر', args[1] || '');
        break;

      case 'أضف_نص':
        this.addText(args[0] || '');
        break;

      case 'ابدأ قائمة':
        this.startList('ul');
        break;

      case 'ابدأ قائمة_مرقمة':
        this.startList('ol');
        break;

      case 'أضف عنصر':
        this.addListItem(args[0] || '');
        break;

      case 'أنهِ قائمة':
      case 'أنهِ قائمة_مرقمة':
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

      case 'غيّر الخط':
        this.changeFont(args[1] || args[0] || 'Arial');
        break;

      case 'اطبع':
        this.addConsoleLog(args[0] || '');
        break;

      case 'متغير':
        this.declareVariable(args[0], args[1]);
        break;

      default:
        console.warn(`أمر غير معروف: ${command}`);
    }
  }

  parseCommand(line) {
    // استخراج النصوص المقتبسة
    const quotesPattern = /"([^"]*)"/g;
    const quotedStrings = [];
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
    let command, args;

    if (words.length >= 2 && ['صفحة', 'عنوان', 'فقرة', 'رابط', 'صورة', 'عنصر', 'زر', 'نص'].includes(words[1])) {
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

  openPage(title) {
    if (this.isPageOpen) {
      throw new Error('الصفحة مفتوحة بالفعل');
    }

    this.isPageOpen = true;
    this.htmlParts.push('<!DOCTYPE html>');
    this.htmlParts.push('<html lang="ar" dir="rtl">');
    this.htmlParts.push('<head>');
    this.htmlParts.push('<meta charset="UTF-8">');
    this.htmlParts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    this.htmlParts.push(`<title>${this.escapeHtml(title)}</title>`);
    this.htmlParts.push('<style>');
    this.htmlParts.push('body { font-family: "Arial", sans-serif; margin: 20px; background: white; color: black; line-height: 1.6; }');
    this.htmlParts.push('h1, h2, h3 { color: #333; margin: 10px 0; }');
    this.htmlParts.push('p { margin: 10px 0; }');
    this.htmlParts.push('ul, ol { margin: 10px 0; padding-right: 20px; }');
    this.htmlParts.push('li { margin: 5px 0; }');
    this.htmlParts.push('a { color: #007bff; text-decoration: none; }');
    this.htmlParts.push('a:hover { text-decoration: underline; }');
    this.htmlParts.push('img { max-width: 100%; height: auto; margin: 10px 0; }');
    this.htmlParts.push('.wahy-button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }');
    this.htmlParts.push('.wahy-button:hover { background: #0056b3; }');
    this.htmlParts.push('hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }');
    this.htmlParts.push('</style>');
    this.htmlParts.push('</head>');
    this.htmlParts.push('<body>');
  }

  closePage() {
    if (!this.isPageOpen) {
      return;
    }

    // إغلاق أي عناصر مفتوحة
    while (this.openTags.length > 0) {
      const tag = this.openTags.pop();
      this.htmlParts.push(`</${tag}>`);
    }

    this.htmlParts.push('</body>');
    this.htmlParts.push('</html>');
    this.isPageOpen = false;
  }

  addHeading(text, level) {
    this.ensurePageOpen();
    this.htmlParts.push(`<h${level}>${this.escapeHtml(text)}</h${level}>`);
  }

  addParagraph(text) {
    this.ensurePageOpen();
    this.htmlParts.push(`<p>${this.escapeHtml(text)}</p>`);
  }

  addLink(text, url) {
    this.ensurePageOpen();
    this.htmlParts.push(`<a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(text)}</a>`);
  }

  addImage(url, alt) {
    this.ensurePageOpen();
    this.htmlParts.push(`<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(alt)}">`);
  }

  addButton(text, onclick) {
    this.ensurePageOpen();
    const onclickAttr = onclick ? ` onclick="${this.escapeHtml(onclick)}"` : '';
    this.htmlParts.push(`<button class="wahy-button"${onclickAttr}>${this.escapeHtml(text)}</button>`);
  }

  addText(text) {
    this.ensurePageOpen();
    this.htmlParts.push(`<span>${this.escapeHtml(text)}</span>`);
  }

  startList(type) {
    this.ensurePageOpen();
    this.currentListType = type;
    this.htmlParts.push(`<${type}>`);
    this.openTags.push(type);
  }

  addListItem(text) {
    if (!this.currentListType) {
      throw new Error('يجب بدء قائمة أولاً');
    }
    this.htmlParts.push(`<li>${this.escapeHtml(text)}</li>`);
  }

  endList() {
    if (!this.currentListType) {
      return;
    }
    const tag = this.openTags.pop();
    this.htmlParts.push(`</${tag}>`);
    this.currentListType = null;
  }

  addHorizontalRule() {
    this.ensurePageOpen();
    this.htmlParts.push('<hr>');
  }

  addSpace() {
    this.ensurePageOpen();
    this.htmlParts.push('<br>');
  }

  changeBackgroundColor(color) {
    this.ensurePageOpen();
    this.htmlParts.push(`<style>body { background-color: ${color}; }</style>`);
  }

  changeTextColor(color) {
    this.ensurePageOpen();
    this.htmlParts.push(`<style>body { color: ${color}; }</style>`);
  }

  changeFont(font) {
    this.ensurePageOpen();
    this.htmlParts.push(`<style>body { font-family: '${font}', sans-serif; }</style>`);
  }

  addConsoleLog(message) {
    console.log(`[وحي]: ${message}`);
  }

  declareVariable(name, value) {
    this.variables.set(name, value);
  }

  ensurePageOpen() {
    if (!this.isPageOpen) {
      this.openPage('صفحة وحي');
    }
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

// تصدير المفسر للاستخدام في الواجهة
if (typeof window !== 'undefined') {
  window.WahyInterpreter = WahyInterpreter;
} else if (typeof module !== 'undefined') {
  module.exports = WahyInterpreter;
}