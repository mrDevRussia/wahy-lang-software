/**
 * مفسر أساسي لجميع مفسرات لغة وحي
 * Base Interpreter for all Wahy language interpreters
 */

export interface InterpretationContext {
  variables: Map<string, any>;
  functions: Map<string, Function>;
  currentScope: string[];
  output: string[];
  errors: string[];
  warnings: string[];
}

export interface InterpretationResult {
  success: boolean;
  output?: string;
  context?: InterpretationContext;
  error?: string;
  lineNumber?: number;
  type: 'html' | 'css' | 'javascript' | 'python' | 'mixed';
}

export abstract class BaseInterpreter {
  protected context: InterpretationContext;
  protected currentLine: number = 0;

  constructor() {
    this.context = {
      variables: new Map(),
      functions: new Map(),
      currentScope: ['global'],
      output: [],
      errors: [],
      warnings: []
    };
  }

  abstract interpret(code: string): InterpretationResult;
  abstract getType(): 'html' | 'css' | 'javascript' | 'python';

  protected reset() {
    this.context = {
      variables: new Map(),
      functions: new Map(),
      currentScope: ['global'],
      output: [],
      errors: [],
      warnings: []
    };
    this.currentLine = 0;
  }

  protected addError(message: string, lineNumber?: number) {
    this.context.errors.push(`خطأ في السطر ${lineNumber || this.currentLine}: ${message}`);
  }

  protected addWarning(message: string, lineNumber?: number) {
    this.context.warnings.push(`تحذير في السطر ${lineNumber || this.currentLine}: ${message}`);
  }

  protected addOutput(content: string) {
    this.context.output.push(content);
  }

  protected setVariable(name: string, value: any) {
    this.context.variables.set(name, value);
  }

  protected getVariable(name: string): any {
    return this.context.variables.get(name);
  }

  protected setFunction(name: string, func: Function) {
    this.context.functions.set(name, func);
  }

  protected getFunction(name: string): Function | undefined {
    return this.context.functions.get(name);
  }

  protected escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  protected parseQuotedStrings(line: string): { command: string; args: string[] } | null {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) {
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

    // Determine command and arguments based on Arabic patterns
    let command: string;
    let args: string[];

    // Multi-word commands
    if (words.length >= 2 && ['صفحة', 'عنوان', 'فقرة', 'رابط', 'صورة', 'عنصر', 'زر', 'نص'].includes(words[1])) {
      command = words.slice(0, 2).join(' ');
      args = words.slice(2);
    } else if (words.length >= 3 && words[0] === 'غيّر') {
      command = words.slice(0, 3).join(' ');
      args = words.slice(3);
    } else if (['ابدأ', 'أنهِ', 'عند', 'إذا', 'طالما', 'كرر', 'لكل'].includes(words[0])) {
      command = words.length >= 2 ? words.slice(0, 2).join(' ') : words[0];
      args = words.slice(words.length >= 2 ? 2 : 1);
    } else if (words[0] === 'دالة' && words.length >= 2) {
      command = 'دالة';
      args = words.slice(1);
    } else {
      command = words[0];
      args = words.slice(1);
    }

    return { command, args };
  }
}