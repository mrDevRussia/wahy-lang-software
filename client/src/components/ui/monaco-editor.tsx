import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorPositionChange?: (position: { line: number; column: number }) => void;
  language?: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export default function MonacoEditor({
  value,
  onChange,
  onCursorPositionChange,
  language = 'plaintext',
  theme = 'vs',
  options = {}
}: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Register Wahy language
    monaco.languages.register({ id: 'wahy' });

    // Define syntax highlighting for Wahy
    monaco.languages.setMonarchTokensProvider('wahy', {
      tokenizer: {
        root: [
          // Comments
          [/#.*$/, 'comment'],
          
          // Page commands
          [/افتح صفحة|أغلق صفحة/, 'keyword'],
          
          // Content commands
          [/أضف عنوان|أضف فقرة|أضف رابط|أضف صورة|أضف عنصر|أضف عنوان_فرعي/, 'type'],
          
          // Style commands
          [/غيّر لون_الخلفية إلى|غيّر لون_النص إلى|غيّر الخط إلى/, 'variable'],
          
          // List commands
          [/ابدأ قائمة|أنهِ قائمة|ابدأ قائمة_مرقمة|أنهِ قائمة_مرقمة/, 'number'],
          
          // Other commands
          [/أضف خط_فاصل|أضف مسافة|ابدأ قسم|أنهِ قسم/, 'string'],
          
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          
          // Keywords
          [/إلى/, 'keyword'],
        ],

        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape.invalid'],
          [/"/, 'string', '@pop']
        ],
      },
    });

    // Define Wahy theme
    monaco.editor.defineTheme('wahy-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: '22863a', fontStyle: 'bold' },
        { token: 'type', foreground: '005cc5', fontStyle: 'bold' },
        { token: 'variable', foreground: '6f42c1', fontStyle: 'bold' },
        { token: 'number', foreground: 'e36209', fontStyle: 'bold' },
        { token: 'string', foreground: '032f62' },
        { token: 'string.invalid', foreground: 'cb2431' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorLineNumber.foreground': '#959da5',
        'editorLineNumber.activeForeground': '#24292e',
        'editor.selectionBackground': '#0366d625',
        'editor.selectionHighlightBackground': '#ffd33d22',
      }
    });

    // Create editor
    const editor = monaco.editor.create(containerRef.current, {
      value,
      language: 'wahy',
      theme: 'wahy-theme',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Monaco', 'Consolas', monospace",
      lineNumbers: 'on',
      minimap: { enabled: false },
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      contextmenu: false,
      ...options
    });

    editorRef.current = editor;

    // Set up event handlers
    editor.onDidChangeModelContent(() => {
      const currentValue = editor.getValue();
      onChange(currentValue);
    });

    editor.onDidChangeCursorPosition((e) => {
      if (onCursorPositionChange) {
        onCursorPositionChange({
          line: e.position.lineNumber,
          column: e.position.column
        });
      }
    });

    // Configure RTL support
    editor.updateOptions({
      renderControlCharacters: false,
      renderWhitespace: 'selection'
    });

    return () => {
      editor.dispose();
    };
  }, []);

  // Update value when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ direction: 'ltr' }} // Monaco editor needs LTR
    />
  );
}
