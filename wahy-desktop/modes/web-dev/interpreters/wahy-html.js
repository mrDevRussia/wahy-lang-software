/**
 * Wahy Web Development Mode - HTML Interpreter
 * مفسر HTML لوضع تطوير الويب
 */

class WahyHTMLInterpreter {
    constructor() {
        this.htmlParts = [];
        this.pageOpened = false;
        this.pageClosed = false;
        this.currentTitle = '';
        this.styles = {};
        this.listStack = [];
        this.sectionStack = [];
    }

    /**
     * تهيئة المفسر
     */
    async initialize() {
        console.log('🌐 تم تهيئة مفسر HTML لوضع تطوير الويب');
        this.reset();
    }

    /**
     * إعادة تعيين المفسر
     */
    reset() {
        this.htmlParts = [];
        this.pageOpened = false;
        this.pageClosed = false;
        this.currentTitle = '';
        this.styles = {};
        this.listStack = [];
        this.sectionStack = [];
    }

    /**
     * تفسير كود وحي HTML
     */
    interpret(code) {
        try {
            this.reset();
            const lines = code.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line || line.startsWith('//')) continue;
                
                this.processLine(line, i + 1);
            }

            return {
                success: true,
                html: this.getHtml(),
                type: 'html',
                interpreter: 'wahy-html'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                type: 'html',
                interpreter: 'wahy-html'
            };
        }
    }

    /**
     * معالجة سطر واحد
     */
    processLine(line, lineNumber) {
        const parts = this.parseLine(line);
        if (!parts) return;

        const [command, ...args] = parts;

        switch (command) {
            case 'افتح':
            case 'open':
                if (args[0] === 'صفحة' || args[0] === 'page') {
                    this.openPage(args.slice(1).join(' ').replace(/['"]/g, ''));
                }
                break;

            case 'أغلق':
            case 'close':
                if (args[0] === 'الصفحة' || args[0] === 'page') {
                    this.closePage();
                }
                break;

            case 'أضف':
            case 'add':
                this.handleAddCommand(args);
                break;

            case 'غير':
            case 'change':
                this.handleChangeCommand(args);
                break;

            case 'ابدأ':
            case 'start':
                this.handleStartCommand(args);
                break;

            case 'أنه':
            case 'end':
                this.handleEndCommand(args);
                break;

            default:
                throw new Error(`أمر غير معروف في السطر ${lineNumber}: ${command}`);
        }
    }

    /**
     * تحليل السطر إلى أجزاء
     */
    parseLine(line) {
        const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
        const parts = [];
        let match;

        while ((match = regex.exec(line)) !== null) {
            parts.push(match[1] || match[2] || match[3]);
        }

        return parts.length > 0 ? parts : null;
    }

    /**
     * معالجة أوامر الإضافة
     */
    handleAddCommand(args) {
        const [type, ...content] = args;
        const text = content.join(' ').replace(/['"]/g, '');

        switch (type) {
            case 'عنوان':
            case 'heading':
                this.addHeading(text);
                break;
            case 'عنوان_فرعي':
            case 'subheading':
                this.addSubheading(text);
                break;
            case 'فقرة':
            case 'paragraph':
                this.addParagraph(text);
                break;
            case 'رابط':
            case 'link':
                const [linkText, url] = content;
                this.addLink(linkText?.replace(/['"]/g, ''), url?.replace(/['"]/g, ''));
                break;
            case 'صورة':
            case 'image':
                const [imageUrl, altText] = content;
                this.addImage(imageUrl?.replace(/['"]/g, ''), altText?.replace(/['"]/g, ''));
                break;
            case 'عنصر_قائمة':
            case 'list_item':
                this.addListItem(text);
                break;
            case 'خط_فاصل':
            case 'horizontal_rule':
                this.addHorizontalRule();
                break;
            case 'مسافة':
            case 'space':
                this.addSpace();
                break;
        }
    }

    /**
     * معالجة أوامر التغيير
     */
    handleChangeCommand(args) {
        const [type, ...value] = args;
        const content = value.join(' ').replace(/['"]/g, '');

        switch (type) {
            case 'لون_الخلفية':
            case 'background_color':
                this.changeBackgroundColor(content);
                break;
            case 'لون_النص':
            case 'text_color':
                this.changeTextColor(content);
                break;
            case 'الخط':
            case 'font':
                this.changeFont(content);
                break;
        }
    }

    /**
     * معالجة أوامر البداية
     */
    handleStartCommand(args) {
        const [type] = args;

        switch (type) {
            case 'قائمة':
            case 'list':
                this.startList();
                break;
            case 'قائمة_مرقمة':
            case 'ordered_list':
                this.startOrderedList();
                break;
            case 'قسم':
            case 'section':
                this.startSection();
                break;
        }
    }

    /**
     * معالجة أوامر النهاية
     */
    handleEndCommand(args) {
        const [type] = args;

        switch (type) {
            case 'القائمة':
            case 'list':
                this.endList();
                break;
            case 'القسم':
            case 'section':
                this.endSection();
                break;
        }
    }

    /**
     * فتح صفحة جديدة
     */
    openPage(title) {
        if (this.pageOpened) {
            throw new Error('الصفحة مفتوحة بالفعل');
        }

        this.currentTitle = title || 'صفحة وحي';
        this.pageOpened = true;
        
        this.htmlParts.push(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(this.currentTitle)}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1, h2, h3, h4, h5, h6 {
            color: #333;
            margin-top: 0;
        }
        p {
            color: #666;
            margin-bottom: 1em;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        ul, ol {
            padding-right: 20px;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
        }
        .section {
            margin: 20px 0;
            padding: 15px;
            border-right: 4px solid #007bff;
            background: #f8f9fa;
        }
        hr {
            border: none;
            height: 2px;
            background: linear-gradient(to right, #007bff, transparent);
            margin: 20px 0;
        }
    </style>
</head>
<body>
<div class="container">`);
    }

    /**
     * إغلاق الصفحة
     */
    closePage() {
        this.ensurePageOpen();
        
        // إغلاق أي عناصر مفتوحة
        while (this.listStack.length > 0) {
            this.endList();
        }
        while (this.sectionStack.length > 0) {
            this.endSection();
        }

        this.htmlParts.push('</div></body></html>');
        this.pageClosed = true;
    }

    /**
     * إضافة عنوان
     */
    addHeading(text, level = 1) {
        this.ensurePageOpen();
        this.htmlParts.push(`<h${level}>${this.escapeHtml(text)}</h${level}>`);
    }

    /**
     * إضافة عنوان فرعي
     */
    addSubheading(text) {
        this.addHeading(text, 2);
    }

    /**
     * إضافة فقرة
     */
    addParagraph(text) {
        this.ensurePageOpen();
        this.htmlParts.push(`<p>${this.escapeHtml(text)}</p>`);
    }

    /**
     * إضافة رابط
     */
    addLink(text, url) {
        this.ensurePageOpen();
        if (!url) {
            throw new Error('الرابط يحتاج إلى عنوان URL');
        }
        this.htmlParts.push(`<a href="${this.escapeHtml(url)}">${this.escapeHtml(text)}</a>`);
    }

    /**
     * إضافة صورة
     */
    addImage(url, altText = '') {
        this.ensurePageOpen();
        this.htmlParts.push(`<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(altText)}">`);
    }

    /**
     * بدء قائمة
     */
    startList() {
        this.ensurePageOpen();
        this.htmlParts.push('<ul>');
        this.listStack.push('ul');
    }

    /**
     * بدء قائمة مرقمة
     */
    startOrderedList() {
        this.ensurePageOpen();
        this.htmlParts.push('<ol>');
        this.listStack.push('ol');
    }

    /**
     * إنهاء قائمة
     */
    endList() {
        if (this.listStack.length === 0) {
            throw new Error('لا توجد قائمة مفتوحة لإنهائها');
        }
        
        const listType = this.listStack.pop();
        this.htmlParts.push(`</${listType}>`);
    }

    /**
     * إضافة عنصر قائمة
     */
    addListItem(text) {
        this.ensurePageOpen();
        if (this.listStack.length === 0) {
            throw new Error('يجب بدء قائمة أولاً قبل إضافة عناصر');
        }
        this.htmlParts.push(`<li>${this.escapeHtml(text)}</li>`);
    }

    /**
     * إضافة خط فاصل
     */
    addHorizontalRule() {
        this.ensurePageOpen();
        this.htmlParts.push('<hr>');
    }

    /**
     * إضافة مسافة
     */
    addSpace() {
        this.ensurePageOpen();
        this.htmlParts.push('<br>');
    }

    /**
     * بدء قسم
     */
    startSection() {
        this.ensurePageOpen();
        this.htmlParts.push('<div class="section">');
        this.sectionStack.push('section');
    }

    /**
     * إنهاء قسم
     */
    endSection() {
        if (this.sectionStack.length === 0) {
            throw new Error('لا يوجد قسم مفتوح لإنهائه');
        }
        
        this.sectionStack.pop();
        this.htmlParts.push('</div>');
    }

    /**
     * تغيير لون الخلفية
     */
    changeBackgroundColor(color) {
        this.ensurePageOpen();
        this.styles.backgroundColor = color;
        this.updateStyles();
    }

    /**
     * تغيير لون النص
     */
    changeTextColor(color) {
        this.ensurePageOpen();
        this.styles.color = color;
        this.updateStyles();
    }

    /**
     * تغيير الخط
     */
    changeFont(font) {
        this.ensurePageOpen();
        this.styles.fontFamily = font;
        this.updateStyles();
    }

    /**
     * تحديث الأنماط
     */
    updateStyles() {
        const styleString = Object.entries(this.styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
        
        if (styleString) {
            this.htmlParts.push(`<style>body { ${styleString}; }</style>`);
        }
    }

    /**
     * الحصول على HTML النهائي
     */
    getHtml() {
        if (this.pageOpened && !this.pageClosed) {
            this.closePage();
        }
        
        return this.htmlParts.join('\n');
    }

    /**
     * التأكد من فتح الصفحة
     */
    ensurePageOpen() {
        if (!this.pageOpened) {
            throw new Error('يجب فتح صفحة أولاً باستخدام: افتح صفحة "العنوان"');
        }
    }

    /**
     * تشفير HTML
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

module.exports = WahyHTMLInterpreter;