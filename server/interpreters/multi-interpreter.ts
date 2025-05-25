/**
 * مفسر متعدد الأنواع للغة وحي
 * Multi-Type Interpreter for Wahy Programming Language
 */

import { BaseInterpreter, InterpretationResult, InterpretationContext } from './base-interpreter';
import { HTMLInterpreter } from './html-interpreter';
import { CSSInterpreter } from './css-interpreter';
import { JavaScriptInterpreter } from './javascript-interpreter';

export interface MultiInterpretationResult {
  success: boolean;
  html?: string;
  css?: string;
  javascript?: string;
  combinedOutput?: string;
  errors: string[];
  warnings: string[];
  type: 'mixed';
}

export class MultiInterpreter extends BaseInterpreter {
  private htmlInterpreter: HTMLInterpreter;
  private cssInterpreter: CSSInterpreter;
  private jsInterpreter: JavaScriptInterpreter;

  constructor() {
    super();
    this.htmlInterpreter = new HTMLInterpreter();
    this.cssInterpreter = new CSSInterpreter();
    this.jsInterpreter = new JavaScriptInterpreter();
  }

  getType(): 'mixed' {
    return 'mixed';
  }

  interpret(code: string): InterpretationResult {
    this.reset();
    
    const sections = this.parseCodeSections(code);
    const results: { [key: string]: InterpretationResult } = {};

    try {
      // تفسير HTML
      if (sections.html) {
        results.html = this.htmlInterpreter.interpret(sections.html);
      }

      // تفسير CSS
      if (sections.css) {
        results.css = this.cssInterpreter.interpret(sections.css);
      }

      // تفسير JavaScript
      if (sections.javascript) {
        results.javascript = this.jsInterpreter.interpret(sections.javascript);
      }

      // إذا لم يكن هناك أقسام محددة، افترض HTML
      if (!sections.html && !sections.css && !sections.javascript) {
        results.html = this.htmlInterpreter.interpret(code);
      }

      // دمج النتائج
      const combinedResult = this.combineResults(results);
      
      return {
        success: combinedResult.success,
        output: combinedResult.combinedOutput,
        context: this.mergeContexts(results),
        type: 'mixed'
      };

    } catch (error) {
      this.addError(`خطأ في التفسير المتعدد: ${error}`);
      return {
        success: false,
        error: `خطأ في التفسير: ${error}`,
        type: 'mixed'
      };
    }
  }

  private parseCodeSections(code: string): { html?: string; css?: string; javascript?: string } {
    const sections: { html?: string; css?: string; javascript?: string } = {};
    const lines = code.split('\n');
    
    let currentSection: 'html' | 'css' | 'javascript' | 'none' = 'none';
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // تحديد بداية الأقسام
      if (trimmedLine === 'ابدأ_HTML' || trimmedLine === 'بداية_HTML' || trimmedLine === '<!-- HTML -->') {
        if (currentSection !== 'none') {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = 'html';
        currentContent = [];
        continue;
      }
      
      if (trimmedLine === 'ابدأ_CSS' || trimmedLine === 'بداية_CSS' || trimmedLine === '/* CSS */') {
        if (currentSection !== 'none') {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = 'css';
        currentContent = [];
        continue;
      }
      
      if (trimmedLine === 'ابدأ_JS' || trimmedLine === 'بداية_JS' || trimmedLine === 'ابدأ_JavaScript' || trimmedLine === '// JavaScript') {
        if (currentSection !== 'none') {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = 'javascript';
        currentContent = [];
        continue;
      }

      // تحديد نهاية الأقسام
      if (trimmedLine === 'أنهِ_HTML' || trimmedLine === 'نهاية_HTML' || 
          trimmedLine === 'أنهِ_CSS' || trimmedLine === 'نهاية_CSS' ||
          trimmedLine === 'أنهِ_JS' || trimmedLine === 'نهاية_JS' || trimmedLine === 'أنهِ_JavaScript') {
        if (currentSection !== 'none') {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = 'none';
        currentContent = [];
        continue;
      }

      // إضافة السطر للقسم الحالي
      if (currentSection !== 'none') {
        currentContent.push(line);
      } else {
        // إذا لم نكن في قسم محدد، تعامل مع السطر كـ HTML
        if (!sections.html) {
          sections.html = '';
        }
        sections.html += line + '\n';
      }
    }

    // إضافة القسم الأخير
    if (currentSection !== 'none' && currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n');
    }

    return sections;
  }

  private combineResults(results: { [key: string]: InterpretationResult }): MultiInterpretationResult {
    const combined: MultiInterpretationResult = {
      success: true,
      errors: [],
      warnings: [],
      type: 'mixed'
    };

    let html = '';
    let css = '';
    let javascript = '';

    // جمع النتائج من كل مفسر
    if (results.html && results.html.success) {
      html = results.html.output || '';
      combined.html = html;
    } else if (results.html) {
      combined.success = false;
      combined.errors.push(...(results.html.context?.errors || []));
    }

    if (results.css && results.css.success) {
      css = results.css.output || '';
      combined.css = css;
    } else if (results.css) {
      combined.warnings.push(...(results.css.context?.warnings || []));
    }

    if (results.javascript && results.javascript.success) {
      javascript = results.javascript.output || '';
      combined.javascript = javascript;
    } else if (results.javascript) {
      combined.warnings.push(...(results.javascript.context?.warnings || []));
    }

    // دمج كل شيء في ملف HTML واحد
    combined.combinedOutput = this.createCombinedHTML(html, css, javascript);

    return combined;
  }

  private createCombinedHTML(html: string, css: string, javascript: string): string {
    // إذا كان لدينا HTML جاهز، أدرج CSS و JS فيه
    if (html && html.includes('</head>')) {
      let combinedHTML = html;

      if (css) {
        const cssSection = `\n  <style>\n${css}\n  </style>`;
        combinedHTML = combinedHTML.replace('</head>', cssSection + '\n</head>');
      }

      if (javascript) {
        const jsSection = `\n  <script>\n${javascript}\n  </script>`;
        combinedHTML = combinedHTML.replace('</body>', jsSection + '\n</body>');
      }

      return combinedHTML;
    }

    // إنشاء HTML جديد مع CSS و JS
    const parts = [];
    parts.push('<!DOCTYPE html>');
    parts.push('<html lang="ar" dir="rtl">');
    parts.push('<head>');
    parts.push('  <meta charset="UTF-8">');
    parts.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    parts.push('  <title>مشروع وحي</title>');

    if (css) {
      parts.push('  <style>');
      parts.push(css);
      parts.push('  </style>');
    }

    parts.push('</head>');
    parts.push('<body>');

    if (html) {
      // استخراج محتوى body إذا كان موجوداً
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch) {
        parts.push(bodyMatch[1]);
      } else {
        parts.push('  <h1>مرحباً بك في لغة وحي</h1>');
        parts.push('  <p>تم إنشاء هذه الصفحة باستخدام لغة البرمجة العربية "وحي"</p>');
      }
    } else {
      parts.push('  <h1>مرحباً بك في لغة وحي</h1>');
      parts.push('  <p>تم إنشاء هذه الصفحة باستخدام لغة البرمجة العربية "وحي"</p>');
    }

    if (javascript) {
      parts.push('  <script>');
      parts.push(javascript);
      parts.push('  </script>');
    }

    parts.push('</body>');
    parts.push('</html>');

    return parts.join('\n');
  }

  private mergeContexts(results: { [key: string]: InterpretationResult }): InterpretationContext {
    const mergedContext: InterpretationContext = {
      variables: new Map(),
      functions: new Map(),
      currentScope: ['global'],
      output: [],
      errors: [],
      warnings: []
    };

    Object.values(results).forEach(result => {
      if (result.context) {
        // دمج المتغيرات
        result.context.variables.forEach((value, key) => {
          mergedContext.variables.set(key, value);
        });

        // دمج الدوال
        result.context.functions.forEach((value, key) => {
          mergedContext.functions.set(key, value);
        });

        // دمج المخرجات والأخطاء
        mergedContext.output.push(...result.context.output);
        mergedContext.errors.push(...result.context.errors);
        mergedContext.warnings.push(...result.context.warnings);
      }
    });

    return mergedContext;
  }

  // وظائف مساعدة لتحليل أنواع الأوامر
  public static detectCodeType(code: string): 'html' | 'css' | 'javascript' | 'mixed' {
    const htmlKeywords = ['افتح صفحة', 'أضف عنوان', 'أضف فقرة', 'أضف رابط', 'أغلق صفحة'];
    const cssKeywords = ['اختر', 'لون', 'خلفية', 'الخط', 'العرض', 'الارتفاع'];
    const jsKeywords = ['متغير', 'دالة', 'إذا', 'كرر', 'طالما', 'اطبع'];

    let htmlScore = 0;
    let cssScore = 0;
    let jsScore = 0;

    htmlKeywords.forEach(keyword => {
      if (code.includes(keyword)) htmlScore++;
    });

    cssKeywords.forEach(keyword => {
      if (code.includes(keyword)) cssScore++;
    });

    jsKeywords.forEach(keyword => {
      if (code.includes(keyword)) jsScore++;
    });

    // إذا كان هناك أكثر من نوع واحد، فهو مختلط
    const typesFound = [htmlScore > 0, cssScore > 0, jsScore > 0].filter(Boolean).length;
    if (typesFound > 1) {
      return 'mixed';
    }

    // العثور على النوع الأعلى نقاطاً
    if (htmlScore > cssScore && htmlScore > jsScore) {
      return 'html';
    } else if (cssScore > htmlScore && cssScore > jsScore) {
      return 'css';
    } else if (jsScore > htmlScore && jsScore > cssScore) {
      return 'javascript';
    }

    // الافتراضي هو HTML
    return 'html';
  }
}