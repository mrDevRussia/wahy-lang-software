/**
 * مفسر JavaScript للغة وحي
 * JavaScript Interpreter for Wahy Programming Language
 */

import { BaseInterpreter, InterpretationResult } from './base-interpreter';

export class JavaScriptInterpreter extends BaseInterpreter {
  private jsCode: string[] = [];
  private currentScope: string = 'global';
  private insideFunction: boolean = false;
  private indentLevel: number = 0;

  getType(): 'javascript' {
    return 'javascript';
  }

  interpret(code: string): InterpretationResult {
    this.reset();
    this.jsCode = [];
    this.currentScope = 'global';
    this.insideFunction = false;
    this.indentLevel = 0;

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

      const result = this.generateFinalJS();
      
      return {
        success: this.context.errors.length === 0,
        output: result,
        context: this.context,
        type: 'javascript'
      };

    } catch (error) {
      this.addError(`خطأ غير متوقع: ${error}`);
      return {
        success: false,
        error: `خطأ في التفسير: ${error}`,
        type: 'javascript'
      };
    }
  }

  private executeCommand(command: string, args: string[]) {
    switch (command) {
      // متغيرات
      case 'متغير':
      case 'أنشئ_متغير':
        this.declareVariable(args[0] || '', args[1] || '');
        break;

      case 'اعط':
      case 'اجعل':
        this.assignValue(args[0] || '', args[1] || '');
        break;

      // دوال
      case 'دالة':
      case 'أنشئ_دالة':
        this.createFunction(args[0] || '', args.slice(1));
        break;

      case 'أنهِ_دالة':
      case 'انتهاء_دالة':
        this.endFunction();
        break;

      case 'استدعي':
      case 'نادِ':
        this.callFunction(args[0] || '', args.slice(1));
        break;

      case 'ارجع':
      case 'أرجع':
        this.returnValue(args[0] || '');
        break;

      // طباعة ورسائل
      case 'اطبع':
      case 'أظهر':
        this.print(args[0] || '');
        break;

      case 'أظهر_رسالة':
      case 'رسالة':
        this.showAlert(args[0] || '');
        break;

      case 'اسأل':
      case 'استفسر':
        this.prompt(args[0] || '', args[1] || '');
        break;

      // شروط
      case 'إذا':
        this.ifStatement(args[0] || '', args.slice(1));
        break;

      case 'وإلا':
      case 'else':
        this.elseStatement();
        break;

      case 'وإلا_إذا':
      case 'else_if':
        this.elseIfStatement(args[0] || '', args.slice(1));
        break;

      case 'أنهِ_إذا':
      case 'انتهاء_إذا':
        this.endIf();
        break;

      // حلقات
      case 'كرر':
      case 'حلقة':
        this.forLoop(args[0] || '', args[1] || '', args[2] || '');
        break;

      case 'طالما':
      case 'while':
        this.whileLoop(args[0] || '');
        break;

      case 'لكل':
      case 'for_each':
        this.forEachLoop(args[0] || '', args[1] || '');
        break;

      case 'أنهِ_حلقة':
      case 'انتهاء_حلقة':
        this.endLoop();
        break;

      case 'اكسر':
      case 'توقف':
        this.breakLoop();
        break;

      case 'تابع':
      case 'استمر':
        this.continueLoop();
        break;

      // أحداث DOM
      case 'عند_الضغط':
      case 'onclick':
        this.onClick(args[0] || '', args[1] || '');
        break;

      case 'عند_التحميل':
      case 'onload':
        this.onLoad(args[0] || '');
        break;

      case 'عند_التغيير':
      case 'onchange':
        this.onChange(args[0] || '', args[1] || '');
        break;

      case 'عند_الإدخال':
      case 'oninput':
        this.onInput(args[0] || '', args[1] || '');
        break;

      // عمليات DOM
      case 'اختر_عنصر':
      case 'getElementById':
        this.getElementById(args[0] || '', args[1] || '');
        break;

      case 'اختر_عناصر':
      case 'querySelectorAll':
        this.querySelectorAll(args[0] || '', args[1] || '');
        break;

      case 'غيّر_نص':
      case 'innerHTML':
        this.changeHTML(args[0] || '', args[1] || '');
        break;

      case 'غيّر_قيمة':
      case 'value':
        this.changeValue(args[0] || '', args[1] || '');
        break;

      case 'غيّر_نمط':
      case 'style':
        this.changeStyle(args[0] || '', args[1] || '', args[2] || '');
        break;

      case 'أضف_فئة':
      case 'addClass':
        this.addClass(args[0] || '', args[1] || '');
        break;

      case 'احذف_فئة':
      case 'removeClass':
        this.removeClass(args[0] || '', args[1] || '');
        break;

      // عمليات حسابية
      case 'اجمع':
      case 'plus':
        this.mathOperation(args[0] || '', args[1] || '', args[2] || '', '+');
        break;

      case 'اطرح':
      case 'minus':
        this.mathOperation(args[0] || '', args[1] || '', args[2] || '', '-');
        break;

      case 'اضرب':
      case 'multiply':
        this.mathOperation(args[0] || '', args[1] || '', args[2] || '', '*');
        break;

      case 'اقسم':
      case 'divide':
        this.mathOperation(args[0] || '', args[1] || '', args[2] || '', '/');
        break;

      // عمليات المصفوفات
      case 'مصفوفة':
      case 'array':
        this.createArray(args[0] || '', args.slice(1));
        break;

      case 'أضف_للمصفوفة':
      case 'push':
        this.pushToArray(args[0] || '', args[1] || '');
        break;

      case 'احذف_من_المصفوفة':
      case 'pop':
        this.popFromArray(args[0] || '');
        break;

      case 'طول_المصفوفة':
      case 'length':
        this.getArrayLength(args[0] || '', args[1] || '');
        break;

      // عمليات الكائنات
      case 'كائن':
      case 'object':
        this.createObject(args[0] || '');
        break;

      case 'خاصية':
      case 'property':
        this.setProperty(args[0] || '', args[1] || '', args[2] || '');
        break;

      // JSON operations
      case 'تحويل_لنص':
      case 'stringify':
        this.jsonStringify(args[0] || '', args[1] || '');
        break;

      case 'تحليل_النص':
      case 'parse':
        this.jsonParse(args[0] || '', args[1] || '');
        break;

      // وقت وتاريخ
      case 'الوقت_الحالي':
      case 'now':
        this.getCurrentTime(args[0] || '');
        break;

      case 'انتظر':
      case 'setTimeout':
        this.setTimeout(args[0] || '', args[1] || '1000');
        break;

      case 'تكرار_دوري':
      case 'setInterval':
        this.setInterval(args[0] || '', args[1] || '1000');
        break;

      // تعليقات وأكواد خام
      case 'تعليق':
      case 'comment':
        this.addComment(args.join(' '));
        break;

      case 'كود_خام':
      case 'raw_code':
        this.addRawCode(args.join(' '));
        break;

      default:
        this.addWarning(`أمر JavaScript غير معروف: ${command}`);
    }
  }

  private addIndent(): string {
    return '  '.repeat(this.indentLevel);
  }

  private addLine(code: string) {
    this.jsCode.push(this.addIndent() + code);
  }

  // Variables
  private declareVariable(name: string, value: string = '') {
    if (value) {
      this.addLine(`let ${name} = ${this.processValue(value)};`);
    } else {
      this.addLine(`let ${name};`);
    }
    this.setVariable(name, value);
  }

  private assignValue(name: string, value: string) {
    this.addLine(`${name} = ${this.processValue(value)};`);
    this.setVariable(name, value);
  }

  // Functions
  private createFunction(name: string, params: string[]) {
    const paramList = params.join(', ');
    this.addLine(`function ${name}(${paramList}) {`);
    this.indentLevel++;
    this.insideFunction = true;
    this.setFunction(name, () => {});
  }

  private endFunction() {
    if (this.insideFunction) {
      this.indentLevel--;
      this.addLine('}');
      this.insideFunction = false;
    }
  }

  private callFunction(name: string, args: string[]) {
    const argList = args.map(arg => this.processValue(arg)).join(', ');
    this.addLine(`${name}(${argList});`);
  }

  private returnValue(value: string) {
    this.addLine(`return ${this.processValue(value)};`);
  }

  // Output
  private print(message: string) {
    this.addLine(`console.log(${this.processValue(message)});`);
  }

  private showAlert(message: string) {
    this.addLine(`alert(${this.processValue(message)});`);
  }

  private prompt(message: string, variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = prompt(${this.processValue(message)});`);
    } else {
      this.addLine(`prompt(${this.processValue(message)});`);
    }
  }

  // Conditionals
  private ifStatement(condition: string, thenCommands: string[]) {
    this.addLine(`if (${this.processCondition(condition)}) {`);
    this.indentLevel++;
  }

  private elseStatement() {
    this.indentLevel--;
    this.addLine('} else {');
    this.indentLevel++;
  }

  private elseIfStatement(condition: string, thenCommands: string[]) {
    this.indentLevel--;
    this.addLine(`} else if (${this.processCondition(condition)}) {`);
    this.indentLevel++;
  }

  private endIf() {
    this.indentLevel--;
    this.addLine('}');
  }

  // Loops
  private forLoop(variable: string, start: string, end: string) {
    this.addLine(`for (let ${variable} = ${start}; ${variable} <= ${end}; ${variable}++) {`);
    this.indentLevel++;
  }

  private whileLoop(condition: string) {
    this.addLine(`while (${this.processCondition(condition)}) {`);
    this.indentLevel++;
  }

  private forEachLoop(variable: string, array: string) {
    this.addLine(`for (let ${variable} of ${array}) {`);
    this.indentLevel++;
  }

  private endLoop() {
    this.indentLevel--;
    this.addLine('}');
  }

  private breakLoop() {
    this.addLine('break;');
  }

  private continueLoop() {
    this.addLine('continue;');
  }

  // DOM Events
  private onClick(element: string, action: string) {
    this.addLine(`document.getElementById('${element}').onclick = function() {`);
    this.indentLevel++;
    this.addLine(action + ';');
    this.indentLevel--;
    this.addLine('};');
  }

  private onLoad(action: string) {
    this.addLine(`window.onload = function() {`);
    this.indentLevel++;
    this.addLine(action + ';');
    this.indentLevel--;
    this.addLine('};');
  }

  private onChange(element: string, action: string) {
    this.addLine(`document.getElementById('${element}').onchange = function() {`);
    this.indentLevel++;
    this.addLine(action + ';');
    this.indentLevel--;
    this.addLine('};');
  }

  private onInput(element: string, action: string) {
    this.addLine(`document.getElementById('${element}').oninput = function() {`);
    this.indentLevel++;
    this.addLine(action + ';');
    this.indentLevel--;
    this.addLine('};');
  }

  // DOM Operations
  private getElementById(id: string, variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = document.getElementById('${id}');`);
    } else {
      this.addLine(`document.getElementById('${id}');`);
    }
  }

  private querySelectorAll(selector: string, variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = document.querySelectorAll('${selector}');`);
    } else {
      this.addLine(`document.querySelectorAll('${selector}');`);
    }
  }

  private changeHTML(element: string, content: string) {
    this.addLine(`document.getElementById('${element}').innerHTML = ${this.processValue(content)};`);
  }

  private changeValue(element: string, value: string) {
    this.addLine(`document.getElementById('${element}').value = ${this.processValue(value)};`);
  }

  private changeStyle(element: string, property: string, value: string) {
    this.addLine(`document.getElementById('${element}').style.${property} = ${this.processValue(value)};`);
  }

  private addClass(element: string, className: string) {
    this.addLine(`document.getElementById('${element}').classList.add('${className}');`);
  }

  private removeClass(element: string, className: string) {
    this.addLine(`document.getElementById('${element}').classList.remove('${className}');`);
  }

  // Math Operations
  private mathOperation(result: string, operand1: string, operand2: string, operator: string) {
    this.addLine(`let ${result} = ${this.processValue(operand1)} ${operator} ${this.processValue(operand2)};`);
  }

  // Arrays
  private createArray(name: string, elements: string[]) {
    const elementList = elements.map(el => this.processValue(el)).join(', ');
    this.addLine(`let ${name} = [${elementList}];`);
  }

  private pushToArray(array: string, element: string) {
    this.addLine(`${array}.push(${this.processValue(element)});`);
  }

  private popFromArray(array: string) {
    this.addLine(`${array}.pop();`);
  }

  private getArrayLength(array: string, variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = ${array}.length;`);
    } else {
      this.addLine(`${array}.length;`);
    }
  }

  // Objects
  private createObject(name: string) {
    this.addLine(`let ${name} = {};`);
  }

  private setProperty(object: string, property: string, value: string) {
    this.addLine(`${object}.${property} = ${this.processValue(value)};`);
  }

  // JSON
  private jsonStringify(object: string, variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = JSON.stringify(${object});`);
    } else {
      this.addLine(`JSON.stringify(${object});`);
    }
  }

  private jsonParse(jsonString: string, variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = JSON.parse(${this.processValue(jsonString)});`);
    } else {
      this.addLine(`JSON.parse(${this.processValue(jsonString)});`);
    }
  }

  // Time and Date
  private getCurrentTime(variable: string) {
    if (variable) {
      this.addLine(`let ${variable} = new Date();`);
    } else {
      this.addLine(`new Date();`);
    }
  }

  private setTimeout(action: string, delay: string) {
    this.addLine(`setTimeout(function() {`);
    this.indentLevel++;
    this.addLine(action + ';');
    this.indentLevel--;
    this.addLine(`}, ${delay});`);
  }

  private setInterval(action: string, interval: string) {
    this.addLine(`setInterval(function() {`);
    this.indentLevel++;
    this.addLine(action + ';');
    this.indentLevel--;
    this.addLine(`}, ${interval});`);
  }

  // Utilities
  private addComment(text: string) {
    this.addLine(`// ${text}`);
  }

  private addRawCode(code: string) {
    this.addLine(code);
  }

  private processValue(value: string): string {
    // Check if it's a string literal
    if (value.startsWith('"') && value.endsWith('"')) {
      return value;
    }
    
    // Check if it's a number
    if (!isNaN(Number(value))) {
      return value;
    }
    
    // Check if it's a boolean
    if (value === 'صحيح' || value === 'true') {
      return 'true';
    }
    if (value === 'خطأ' || value === 'false') {
      return 'false';
    }
    
    // Check if it's null or undefined
    if (value === 'فارغ' || value === 'null') {
      return 'null';
    }
    if (value === 'غير_محدد' || value === 'undefined') {
      return 'undefined';
    }
    
    // Otherwise, treat as variable name
    return value;
  }

  private processCondition(condition: string): string {
    // Replace Arabic comparison operators
    condition = condition.replace(/يساوي/g, '==');
    condition = condition.replace(/لا_يساوي/g, '!=');
    condition = condition.replace(/أكبر_من/g, '>');
    condition = condition.replace(/أصغر_من/g, '<');
    condition = condition.replace(/أكبر_أو_يساوي/g, '>=');
    condition = condition.replace(/أصغر_أو_يساوي/g, '<=');
    condition = condition.replace(/و/g, '&&');
    condition = condition.replace(/أو/g, '||');
    condition = condition.replace(/ليس/g, '!');
    
    return condition;
  }

  private generateFinalJS(): string {
    if (this.jsCode.length === 0) {
      return '// لا يوجد كود JavaScript';
    }

    return this.jsCode.join('\n');
  }
}