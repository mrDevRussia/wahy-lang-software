/**
 * مفسر HTML للغة وحي
 * HTML Interpreter for Wahy Programming Language
 */

import { BaseInterpreter, InterpretationResult } from './base-interpreter';

export class HTMLInterpreter extends BaseInterpreter {
  private htmlContent: string[] = [];
  private isPageOpen: boolean = false;
  private currentListType: 'ul' | 'ol' | null = null;
  private openTags: string[] = [];

  getType(): 'html' {
    return 'html';
  }

  interpret(code: string): InterpretationResult {
    this.reset();
    this.htmlContent = [];
    this.isPageOpen = false;
    this.currentListType = null;
    this.openTags = [];

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

      if (this.isPageOpen) {
        this.closePage();
      }

      const result = this.generateFinalHTML();
      
      return {
        success: this.context.errors.length === 0,
        output: result,
        context: this.context,
        type: 'html'
      };

    } catch (error) {
      this.addError(`خطأ غير متوقع: ${error}`);
      return {
        success: false,
        error: `خطأ في التفسير: ${error}`,
        type: 'html'
      };
    }
  }

  private executeCommand(command: string, args: string[]) {
    switch (command) {
      // أوامر الصفحة
      case 'افتح صفحة':
      case 'أنشئ صفحة':
      case 'ابدأ صفحة':
        this.openPage(args[0] || 'صفحة وحي');
        break;

      case 'أغلق صفحة':
      case 'أنهِ صفحة':
        this.closePage();
        break;

      // أوامر المحتوى
      case 'أضف عنوان':
      case 'أضف عنوانًا':
      case 'عنوان':
        this.addHeading(args[0] || '', 1);
        break;

      case 'أضف عنوان_فرعي':
      case 'أضف عنوانًا_فرعيًا':
      case 'عنوان فرعي':
        this.addHeading(args[0] || '', 2);
        break;

      case 'أضف فقرة':
      case 'فقرة':
        this.addParagraph(args[0] || '');
        break;

      case 'أضف رابط':
      case 'رابط':
        this.addLink(args[0] || '', args[1] || '#');
        break;

      case 'أضف صورة':
      case 'صورة':
        this.addImage(args[1] || '', args[0] || 'صورة');
        break;

      case 'أضف زر':
      case 'زر':
      case 'أنشئ زر':
        this.addButton(args[0] || 'زر', args[1] || '');
        break;

      case 'أضف نص':
      case 'نص':
        this.addText(args[0] || '');
        break;

      // أوامر التنسيق
      case 'غيّر لون_الخلفية':
      case 'لون الخلفية':
        this.changeBackgroundColor(args[1] || args[0] || 'white');
        break;

      case 'غيّر لون_النص':
      case 'لون النص':
        this.changeTextColor(args[1] || args[0] || 'black');
        break;

      case 'غيّر الخط':
      case 'الخط':
        this.changeFont(args[1] || args[0] || 'Arial');
        break;

      // أوامر القوائم
      case 'ابدأ قائمة':
      case 'أنشئ قائمة':
        this.startList('ul');
        break;

      case 'ابدأ قائمة_مرقمة':
      case 'أنشئ قائمة_مرقمة':
        this.startList('ol');
        break;

      case 'أضف عنصر':
      case 'عنصر':
        this.addListItem(args[0] || '');
        break;

      case 'أنهِ قائمة':
      case 'أغلق قائمة':
        this.endList();
        break;

      case 'أنهِ قائمة_مرقمة':
        this.endList();
        break;

      // أوامر التخطيط
      case 'ابدأ قسم':
      case 'أنشئ قسم':
        this.startSection(args[0]);
        break;

      case 'أنهِ قسم':
      case 'أغلق قسم':
        this.endSection();
        break;

      case 'أضف خط_فاصل':
      case 'خط فاصل':
        this.addHorizontalRule();
        break;

      case 'أضف مسافة':
      case 'مسافة':
        this.addSpace();
        break;

      // أوامر النماذج
      case 'أضف مدخل_نص':
      case 'مدخل نص':
        this.addTextInput(args[0] || '', args[1] || '');
        break;

      case 'أضف مدخل_كلمة_سر':
      case 'كلمة سر':
        this.addPasswordInput(args[0] || '', args[1] || '');
        break;

      case 'أضف مربع_اختيار':
      case 'مربع اختيار':
        this.addCheckbox(args[0] || '', args[1] || '');
        break;

      // أوامر الجداول
      case 'ابدأ جدول':
      case 'أنشئ جدول':
        this.startTable();
        break;

      case 'أضف صف':
      case 'صف':
        this.addTableRow();
        break;

      case 'أضف خانة':
      case 'خانة':
        this.addTableCell(args[0] || '');
        break;

      case 'أنهِ جدول':
        this.endTable();
        break;

      default:
        this.addWarning(`أمر غير معروف: ${command}`);
    }
  }

  private openPage(title: string) {
    if (this.isPageOpen) {
      this.addWarning('تم فتح صفحة بالفعل');
      return;
    }
    this.isPageOpen = true;
    this.htmlContent.push(`<!DOCTYPE html>`);
    this.htmlContent.push(`<html lang="ar" dir="rtl">`);
    this.htmlContent.push(`<head>`);
    this.htmlContent.push(`  <meta charset="UTF-8">`);
    this.htmlContent.push(`  <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    this.htmlContent.push(`  <title>${this.escapeHtml(title)}</title>`);
    this.htmlContent.push(`  <style>`);
    this.htmlContent.push(`    body { font-family: 'Arial', sans-serif; margin: 20px; background-color: white; color: black; }`);
    this.htmlContent.push(`    .wahy-section { margin: 10px 0; }`);
    this.htmlContent.push(`    .wahy-button { padding: 10px 20px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }`);
    this.htmlContent.push(`    .wahy-input { padding: 8px; margin: 5px; border: 1px solid #ccc; border-radius: 3px; }`);
    this.htmlContent.push(`    table { border-collapse: collapse; width: 100%; margin: 10px 0; }`);
    this.htmlContent.push(`    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }`);
    this.htmlContent.push(`  </style>`);
    this.htmlContent.push(`</head>`);
    this.htmlContent.push(`<body>`);
  }

  private closePage() {
    if (!this.isPageOpen) {
      this.addWarning('لا توجد صفحة مفتوحة لإغلاقها');
      return;
    }

    // Close any open tags
    while (this.openTags.length > 0) {
      const tag = this.openTags.pop();
      this.htmlContent.push(`</${tag}>`);
    }

    this.htmlContent.push(`</body>`);
    this.htmlContent.push(`</html>`);
    this.isPageOpen = false;
  }

  private addHeading(text: string, level: number = 1) {
    this.ensurePageOpen();
    this.htmlContent.push(`<h${level}>${this.escapeHtml(text)}</h${level}>`);
  }

  private addParagraph(text: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<p>${this.escapeHtml(text)}</p>`);
  }

  private addLink(text: string, url: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(text)}</a>`);
  }

  private addImage(url: string, alt: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(alt)}" style="max-width: 100%; height: auto;">`);
  }

  private addButton(text: string, onclick: string = '') {
    this.ensurePageOpen();
    const onclickAttr = onclick ? ` onclick="${this.escapeHtml(onclick)}"` : '';
    this.htmlContent.push(`<button class="wahy-button"${onclickAttr}>${this.escapeHtml(text)}</button>`);
  }

  private addText(text: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<span>${this.escapeHtml(text)}</span>`);
  }

  private changeBackgroundColor(color: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<style>body { background-color: ${color}; }</style>`);
  }

  private changeTextColor(color: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<style>body { color: ${color}; }</style>`);
  }

  private changeFont(font: string) {
    this.ensurePageOpen();
    this.htmlContent.push(`<style>body { font-family: '${font}', sans-serif; }</style>`);
  }

  private startList(type: 'ul' | 'ol') {
    this.ensurePageOpen();
    this.currentListType = type;
    this.htmlContent.push(`<${type}>`);
    this.openTags.push(type);
  }

  private addListItem(text: string) {
    if (!this.currentListType) {
      this.addWarning('يجب بدء قائمة أولاً قبل إضافة عنصر');
      return;
    }
    this.htmlContent.push(`  <li>${this.escapeHtml(text)}</li>`);
  }

  private endList() {
    if (!this.currentListType) {
      this.addWarning('لا توجد قائمة مفتوحة لإنهائها');
      return;
    }
    const tag = this.openTags.pop();
    this.htmlContent.push(`</${tag}>`);
    this.currentListType = null;
  }

  private startSection(className?: string) {
    this.ensurePageOpen();
    const classAttr = className ? ` class="wahy-section ${className}"` : ' class="wahy-section"';
    this.htmlContent.push(`<div${classAttr}>`);
    this.openTags.push('div');
  }

  private endSection() {
    if (this.openTags.length === 0) {
      this.addWarning('لا يوجد قسم مفتوح لإنهائه');
      return;
    }
    const tag = this.openTags.pop();
    this.htmlContent.push(`</${tag}>`);
  }

  private addHorizontalRule() {
    this.ensurePageOpen();
    this.htmlContent.push(`<hr>`);
  }

  private addSpace() {
    this.ensurePageOpen();
    this.htmlContent.push(`<br>`);
  }

  private addTextInput(name: string, placeholder: string = '') {
    this.ensurePageOpen();
    const placeholderAttr = placeholder ? ` placeholder="${this.escapeHtml(placeholder)}"` : '';
    this.htmlContent.push(`<input type="text" name="${this.escapeHtml(name)}" class="wahy-input"${placeholderAttr}>`);
  }

  private addPasswordInput(name: string, placeholder: string = '') {
    this.ensurePageOpen();
    const placeholderAttr = placeholder ? ` placeholder="${this.escapeHtml(placeholder)}"` : '';
    this.htmlContent.push(`<input type="password" name="${this.escapeHtml(name)}" class="wahy-input"${placeholderAttr}>`);
  }

  private addCheckbox(name: string, label: string = '') {
    this.ensurePageOpen();
    const id = `checkbox_${Date.now()}`;
    this.htmlContent.push(`<input type="checkbox" id="${id}" name="${this.escapeHtml(name)}">`);
    if (label) {
      this.htmlContent.push(`<label for="${id}">${this.escapeHtml(label)}</label>`);
    }
  }

  private startTable() {
    this.ensurePageOpen();
    this.htmlContent.push(`<table>`);
    this.openTags.push('table');
  }

  private addTableRow() {
    this.htmlContent.push(`<tr>`);
    this.openTags.push('tr');
  }

  private addTableCell(content: string) {
    this.htmlContent.push(`<td>${this.escapeHtml(content)}</td>`);
  }

  private endTable() {
    // Close any open tr tags
    while (this.openTags.length > 0 && this.openTags[this.openTags.length - 1] === 'tr') {
      this.openTags.pop();
      this.htmlContent.push(`</tr>`);
    }
    
    if (this.openTags.length > 0 && this.openTags[this.openTags.length - 1] === 'table') {
      this.openTags.pop();
      this.htmlContent.push(`</table>`);
    }
  }

  private ensurePageOpen() {
    if (!this.isPageOpen) {
      this.openPage('صفحة وحي');
    }
  }

  private generateFinalHTML(): string {
    if (!this.isPageOpen && this.htmlContent.length === 0) {
      // إنشاء صفحة بسيطة إذا لم يتم إنشاء أي محتوى
      this.openPage('صفحة فارغة');
      this.addParagraph('مرحباً بك في لغة وحي!');
      this.closePage();
    }

    return this.htmlContent.join('\n');
  }
}