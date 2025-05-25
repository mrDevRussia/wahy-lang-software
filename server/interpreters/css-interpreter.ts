/**
 * مفسر CSS للغة وحي
 * CSS Interpreter for Wahy Programming Language
 */

import { BaseInterpreter, InterpretationResult } from './base-interpreter';

export class CSSInterpreter extends BaseInterpreter {
  private cssRules: string[] = [];
  private currentSelector: string = '';

  getType(): 'css' {
    return 'css';
  }

  interpret(code: string): InterpretationResult {
    this.reset();
    this.cssRules = [];
    this.currentSelector = '';

    const lines = code.split('\n');
    
    try {
      for (let i = 0; i < lines.length; i++) {
        this.currentLine = i + 1;
        const line = lines[i].trim();
        
        if (!line || line.startsWith('#') || line.startsWith('//')) {
          continue;
        }

        const parsed = this.parseQuotedStrings(line);
        if (!parsed) continue;

        const { command, args } = parsed;
        this.executeCommand(command, args);
      }

      const result = this.generateFinalCSS();
      
      return {
        success: this.context.errors.length === 0,
        output: result,
        context: this.context,
        type: 'css'
      };

    } catch (error) {
      this.addError(`خطأ غير متوقع: ${error}`);
      return {
        success: false,
        error: `خطأ في التفسير: ${error}`,
        type: 'css'
      };
    }
  }

  private executeCommand(command: string, args: string[]) {
    switch (command) {
      // اختيار العناصر
      case 'اختر':
      case 'حدد':
        this.selectElement(args[0] || 'body');
        break;

      case 'اختر_الكل':
      case 'حدد_الكل':
        this.selectAll(args[0] || '*');
        break;

      // خصائص الألوان
      case 'لون':
      case 'لون_النص':
        this.setColor(args[0] || 'black');
        break;

      case 'لون_الخلفية':
      case 'خلفية':
        this.setBackgroundColor(args[0] || 'white');
        break;

      case 'لون_الحدود':
        this.setBorderColor(args[0] || 'gray');
        break;

      // خصائص النصوص
      case 'الخط':
      case 'نوع_الخط':
        this.setFontFamily(args[0] || 'Arial');
        break;

      case 'حجم_الخط':
        this.setFontSize(args[0] || '16px');
        break;

      case 'وزن_الخط':
        this.setFontWeight(args[0] || 'normal');
        break;

      case 'محاذاة_النص':
        this.setTextAlign(args[0] || 'right');
        break;

      case 'تزيين_النص':
        this.setTextDecoration(args[0] || 'none');
        break;

      // خصائص التخطيط
      case 'العرض':
      case 'width':
        this.setWidth(args[0] || 'auto');
        break;

      case 'الارتفاع':
      case 'height':
        this.setHeight(args[0] || 'auto');
        break;

      case 'الهامش':
      case 'margin':
        this.setMargin(args[0] || '0');
        break;

      case 'البطانة':
      case 'padding':
        this.setPadding(args[0] || '0');
        break;

      case 'النوع':
      case 'display':
        this.setDisplay(args[0] || 'block');
        break;

      case 'الموضع':
      case 'position':
        this.setPosition(args[0] || 'static');
        break;

      // خصائص الحدود
      case 'الحدود':
      case 'border':
        this.setBorder(args[0] || '1px solid black');
        break;

      case 'سماكة_الحدود':
        this.setBorderWidth(args[0] || '1px');
        break;

      case 'نوع_الحدود':
        this.setBorderStyle(args[0] || 'solid');
        break;

      case 'استدارة_الحدود':
        this.setBorderRadius(args[0] || '0');
        break;

      // خصائص Flexbox
      case 'فلكس':
      case 'flexbox':
        this.setFlex();
        break;

      case 'اتجاه_الفلكس':
        this.setFlexDirection(args[0] || 'row');
        break;

      case 'محاذاة_الفلكس':
        this.setJustifyContent(args[0] || 'flex-start');
        break;

      case 'محاذاة_العناصر':
        this.setAlignItems(args[0] || 'stretch');
        break;

      // خصائص Grid
      case 'الشبكة':
      case 'grid':
        this.setGrid();
        break;

      case 'أعمدة_الشبكة':
        this.setGridColumns(args[0] || '1fr');
        break;

      case 'صفوف_الشبكة':
        this.setGridRows(args[0] || '1fr');
        break;

      case 'فجوة_الشبكة':
        this.setGridGap(args[0] || '10px');
        break;

      // خصائص التأثيرات
      case 'الظل':
      case 'shadow':
        this.setBoxShadow(args[0] || '0 2px 4px rgba(0,0,0,0.1)');
        break;

      case 'الشفافية':
      case 'opacity':
        this.setOpacity(args[0] || '1');
        break;

      case 'التحويل':
      case 'transform':
        this.setTransform(args[0] || 'none');
        break;

      case 'الانتقال':
      case 'transition':
        this.setTransition(args[0] || 'all 0.3s ease');
        break;

      // خصائص الخلفية
      case 'صورة_الخلفية':
        this.setBackgroundImage(args[0] || 'none');
        break;

      case 'حجم_الخلفية':
        this.setBackgroundSize(args[0] || 'auto');
        break;

      case 'تكرار_الخلفية':
        this.setBackgroundRepeat(args[0] || 'repeat');
        break;

      case 'موضع_الخلفية':
        this.setBackgroundPosition(args[0] || 'top left');
        break;

      // متجاوبية
      case 'استعلام_الوسائط':
      case 'media_query':
        this.startMediaQuery(args[0] || 'screen');
        break;

      case 'أنهِ_الاستعلام':
        this.endMediaQuery();
        break;

      // خصائص متقدمة
      case 'المؤشر':
      case 'cursor':
        this.setCursor(args[0] || 'default');
        break;

      case 'الفيض':
      case 'overflow':
        this.setOverflow(args[0] || 'visible');
        break;

      case 'الرؤية':
      case 'visibility':
        this.setVisibility(args[0] || 'visible');
        break;

      case 'المؤشر_z':
      case 'z_index':
        this.setZIndex(args[0] || 'auto');
        break;

      default:
        this.addWarning(`أمر CSS غير معروف: ${command}`);
    }
  }

  private selectElement(selector: string) {
    if (this.currentSelector) {
      this.cssRules.push('}');
    }
    this.currentSelector = selector;
    this.cssRules.push(`${selector} {`);
  }

  private selectAll(selector: string) {
    this.selectElement(`* ${selector}`);
  }

  private addRule(property: string, value: string) {
    if (!this.currentSelector) {
      this.selectElement('body');
    }
    this.cssRules.push(`  ${property}: ${value};`);
  }

  // Color properties
  private setColor(color: string) {
    this.addRule('color', color);
  }

  private setBackgroundColor(color: string) {
    this.addRule('background-color', color);
  }

  private setBorderColor(color: string) {
    this.addRule('border-color', color);
  }

  // Font properties
  private setFontFamily(font: string) {
    this.addRule('font-family', `'${font}', sans-serif`);
  }

  private setFontSize(size: string) {
    this.addRule('font-size', size);
  }

  private setFontWeight(weight: string) {
    this.addRule('font-weight', weight);
  }

  private setTextAlign(align: string) {
    const alignments: { [key: string]: string } = {
      'يمين': 'right',
      'يسار': 'left',
      'وسط': 'center',
      'ضبط': 'justify'
    };
    this.addRule('text-align', alignments[align] || align);
  }

  private setTextDecoration(decoration: string) {
    const decorations: { [key: string]: string } = {
      'خط_تحت': 'underline',
      'خط_فوق': 'overline',
      'خط_وسط': 'line-through',
      'بلا': 'none'
    };
    this.addRule('text-decoration', decorations[decoration] || decoration);
  }

  // Layout properties
  private setWidth(width: string) {
    this.addRule('width', width);
  }

  private setHeight(height: string) {
    this.addRule('height', height);
  }

  private setMargin(margin: string) {
    this.addRule('margin', margin);
  }

  private setPadding(padding: string) {
    this.addRule('padding', padding);
  }

  private setDisplay(display: string) {
    const displays: { [key: string]: string } = {
      'كتلة': 'block',
      'سطري': 'inline',
      'سطري_كتلة': 'inline-block',
      'فلكس': 'flex',
      'شبكة': 'grid',
      'مخفي': 'none'
    };
    this.addRule('display', displays[display] || display);
  }

  private setPosition(position: string) {
    const positions: { [key: string]: string } = {
      'ثابت': 'static',
      'نسبي': 'relative',
      'مطلق': 'absolute',
      'مثبت': 'fixed',
      'لاصق': 'sticky'
    };
    this.addRule('position', positions[position] || position);
  }

  // Border properties
  private setBorder(border: string) {
    this.addRule('border', border);
  }

  private setBorderWidth(width: string) {
    this.addRule('border-width', width);
  }

  private setBorderStyle(style: string) {
    const styles: { [key: string]: string } = {
      'صلب': 'solid',
      'منقط': 'dotted',
      'متقطع': 'dashed',
      'مزدوج': 'double',
      'محفور': 'groove',
      'مرتفع': 'ridge'
    };
    this.addRule('border-style', styles[style] || style);
  }

  private setBorderRadius(radius: string) {
    this.addRule('border-radius', radius);
  }

  // Flexbox properties
  private setFlex() {
    this.addRule('display', 'flex');
  }

  private setFlexDirection(direction: string) {
    const directions: { [key: string]: string } = {
      'صف': 'row',
      'صف_عكسي': 'row-reverse',
      'عمود': 'column',
      'عمود_عكسي': 'column-reverse'
    };
    this.addRule('flex-direction', directions[direction] || direction);
  }

  private setJustifyContent(justify: string) {
    const justifications: { [key: string]: string } = {
      'بداية': 'flex-start',
      'نهاية': 'flex-end',
      'وسط': 'center',
      'متباعد': 'space-between',
      'متوزع': 'space-around',
      'متوزع_بالتساوي': 'space-evenly'
    };
    this.addRule('justify-content', justifications[justify] || justify);
  }

  private setAlignItems(align: string) {
    const alignments: { [key: string]: string } = {
      'بداية': 'flex-start',
      'نهاية': 'flex-end',
      'وسط': 'center',
      'امتداد': 'stretch',
      'خط_أساسي': 'baseline'
    };
    this.addRule('align-items', alignments[align] || align);
  }

  // Grid properties
  private setGrid() {
    this.addRule('display', 'grid');
  }

  private setGridColumns(columns: string) {
    this.addRule('grid-template-columns', columns);
  }

  private setGridRows(rows: string) {
    this.addRule('grid-template-rows', rows);
  }

  private setGridGap(gap: string) {
    this.addRule('gap', gap);
  }

  // Effect properties
  private setBoxShadow(shadow: string) {
    this.addRule('box-shadow', shadow);
  }

  private setOpacity(opacity: string) {
    this.addRule('opacity', opacity);
  }

  private setTransform(transform: string) {
    this.addRule('transform', transform);
  }

  private setTransition(transition: string) {
    this.addRule('transition', transition);
  }

  // Background properties
  private setBackgroundImage(image: string) {
    this.addRule('background-image', `url(${image})`);
  }

  private setBackgroundSize(size: string) {
    const sizes: { [key: string]: string } = {
      'غطاء': 'cover',
      'احتواء': 'contain',
      'تلقائي': 'auto'
    };
    this.addRule('background-size', sizes[size] || size);
  }

  private setBackgroundRepeat(repeat: string) {
    const repeats: { [key: string]: string } = {
      'تكرار': 'repeat',
      'بلا_تكرار': 'no-repeat',
      'تكرار_س': 'repeat-x',
      'تكرار_ص': 'repeat-y'
    };
    this.addRule('background-repeat', repeats[repeat] || repeat);
  }

  private setBackgroundPosition(position: string) {
    const positions: { [key: string]: string } = {
      'أعلى_يمين': 'top right',
      'أعلى_يسار': 'top left',
      'أعلى_وسط': 'top center',
      'أسفل_يمين': 'bottom right',
      'أسفل_يسار': 'bottom left',
      'أسفل_وسط': 'bottom center',
      'وسط': 'center'
    };
    this.addRule('background-position', positions[position] || position);
  }

  // Media queries
  private startMediaQuery(query: string) {
    if (this.currentSelector) {
      this.cssRules.push('}');
      this.currentSelector = '';
    }
    this.cssRules.push(`@media ${query} {`);
  }

  private endMediaQuery() {
    if (this.currentSelector) {
      this.cssRules.push('}');
      this.currentSelector = '';
    }
    this.cssRules.push('}');
  }

  // Advanced properties
  private setCursor(cursor: string) {
    const cursors: { [key: string]: string } = {
      'مؤشر': 'pointer',
      'نص': 'text',
      'تحريك': 'move',
      'انتظار': 'wait',
      'مساعدة': 'help',
      'ممنوع': 'not-allowed'
    };
    this.addRule('cursor', cursors[cursor] || cursor);
  }

  private setOverflow(overflow: string) {
    const overflows: { [key: string]: string } = {
      'مرئي': 'visible',
      'مخفي': 'hidden',
      'تمرير': 'scroll',
      'تلقائي': 'auto'
    };
    this.addRule('overflow', overflows[overflow] || overflow);
  }

  private setVisibility(visibility: string) {
    const visibilities: { [key: string]: string } = {
      'مرئي': 'visible',
      'مخفي': 'hidden'
    };
    this.addRule('visibility', visibilities[visibility] || visibility);
  }

  private setZIndex(zIndex: string) {
    this.addRule('z-index', zIndex);
  }

  private generateFinalCSS(): string {
    if (this.currentSelector) {
      this.cssRules.push('}');
    }
    
    if (this.cssRules.length === 0) {
      return '/* لا توجد قواعد CSS */';
    }

    return this.cssRules.join('\n');
  }
}