import { useState, useEffect, useRef } from 'react';

interface CodePattern {
  pattern: string;
  frequency: number;
  lastUsed: number;
  context: string[];
}

interface SmartSuggestion {
  id: string;
  text: string;
  description: string;
  category: 'structure' | 'styling' | 'content' | 'list' | 'section';
  confidence: number;
  insertText: string;
}

export function useSmartSuggestions(code: string, cursorPosition: number) {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [userPatterns, setUserPatterns] = useState<CodePattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisTimeout = useRef<NodeJS.Timeout>();

  // تحليل أنماط المستخدم
  const analyzeUserPatterns = (userCode: string) => {
    const lines = userCode.split('\n');
    const patterns: Record<string, CodePattern> = {};

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // استخراج الأوامر الأساسية
      const command = trimmedLine.split(' ')[0];
      if (command) {
        const context = lines.slice(Math.max(0, index - 2), index + 3)
          .map(l => l.trim())
          .filter(l => l);

        const key = command;
        if (patterns[key]) {
          patterns[key].frequency++;
          patterns[key].lastUsed = Date.now();
          const uniqueContext = [...patterns[key].context, ...context];
          patterns[key].context = uniqueContext.filter((item, index) => uniqueContext.indexOf(item) === index);
        } else {
          patterns[key] = {
            pattern: command,
            frequency: 1,
            lastUsed: Date.now(),
            context
          };
        }
      }
    });

    return Object.values(patterns);
  };

  // توليد اقتراحات ذكية بناءً على السياق
  const generateSmartSuggestions = (currentCode: string, cursor: number): SmartSuggestion[] => {
    const lines = currentCode.split('\n');
    const currentLineIndex = currentCode.substring(0, cursor).split('\n').length - 1;
    const currentLine = lines[currentLineIndex] || '';
    const previousLines = lines.slice(Math.max(0, currentLineIndex - 3), currentLineIndex);
    
    const suggestions: SmartSuggestion[] = [];

    // اقتراحات بناءً على السياق الحالي
    if (currentLine.trim() === '' || currentLine.trim().endsWith(' ')) {
      
      // إذا لم يتم فتح صفحة بعد
      if (!currentCode.includes('افتح صفحة')) {
        suggestions.push({
          id: 'open-page',
          text: 'افتح صفحة "عنوان الصفحة"',
          description: 'بدء صفحة ويب جديدة',
          category: 'structure',
          confidence: 0.9,
          insertText: 'افتح صفحة "عنوان الصفحة"'
        });
      }

      // إذا تم فتح صفحة ولكن لم يتم إضافة محتوى
      if (currentCode.includes('افتح صفحة') && !currentCode.includes('أضف عنوان')) {
        suggestions.push({
          id: 'add-title',
          text: 'أضف عنوان "العنوان الرئيسي"',
          description: 'إضافة عنوان رئيسي للصفحة',
          category: 'content',
          confidence: 0.8,
          insertText: 'أضف عنوان "العنوان الرئيسي"'
        });
      }

      // اقتراحات بناءً على السطر السابق
      const lastLine = previousLines[previousLines.length - 1]?.trim();
      
      if (lastLine?.startsWith('أضف عنوان')) {
        suggestions.push({
          id: 'add-paragraph',
          text: 'أضف فقرة "محتوى الفقرة"',
          description: 'إضافة فقرة نصية',
          category: 'content',
          confidence: 0.7,
          insertText: 'أضف فقرة "محتوى الفقرة"'
        });

        suggestions.push({
          id: 'add-subheading',
          text: 'أضف عنوان فرعي "العنوان الفرعي"',
          description: 'إضافة عنوان فرعي',
          category: 'content',
          confidence: 0.6,
          insertText: 'أضف عنوان فرعي "العنوان الفرعي"'
        });
      }

      if (lastLine?.startsWith('أضف فقرة')) {
        suggestions.push({
          id: 'start-list',
          text: 'ابدأ قائمة',
          description: 'بدء قائمة نقطية',
          category: 'list',
          confidence: 0.6,
          insertText: 'ابدأ قائمة'
        });

        suggestions.push({
          id: 'add-link',
          text: 'أضف رابط "نص الرابط" "https://example.com"',
          description: 'إضافة رابط',
          category: 'content',
          confidence: 0.5,
          insertText: 'أضف رابط "نص الرابط" "https://example.com"'
        });
      }

      if (lastLine === 'ابدأ قائمة') {
        suggestions.push({
          id: 'add-list-item',
          text: 'أضف عنصر قائمة "العنصر الأول"',
          description: 'إضافة عنصر للقائمة',
          category: 'list',
          confidence: 0.9,
          insertText: 'أضف عنصر قائمة "العنصر الأول"'
        });
      }

      if (lastLine?.startsWith('أضف عنصر قائمة')) {
        suggestions.push({
          id: 'add-another-item',
          text: 'أضف عنصر قائمة "العنصر التالي"',
          description: 'إضافة عنصر آخر للقائمة',
          category: 'list',
          confidence: 0.8,
          insertText: 'أضف عنصر قائمة "العنصر التالي"'
        });

        suggestions.push({
          id: 'end-list',
          text: 'أنه القائمة',
          description: 'إنهاء القائمة الحالية',
          category: 'list',
          confidence: 0.7,
          insertText: 'أنه القائمة'
        });
      }

      // اقتراحات التصميم
      if (currentCode.includes('أضف') && !currentCode.includes('غير لون')) {
        suggestions.push({
          id: 'change-bg-color',
          text: 'غير لون الخلفية "أزرق فاتح"',
          description: 'تغيير لون خلفية الصفحة',
          category: 'styling',
          confidence: 0.4,
          insertText: 'غير لون الخلفية "أزرق فاتح"'
        });
      }

      // اقتراح إغلاق الصفحة
      if (currentCode.includes('افتح صفحة') && 
          !currentCode.includes('أغلق الصفحة') && 
          currentCode.split('\n').length > 3) {
        suggestions.push({
          id: 'close-page',
          text: 'أغلق الصفحة',
          description: 'إنهاء وإغلاق الصفحة',
          category: 'structure',
          confidence: 0.5,
          insertText: 'أغلق الصفحة'
        });
      }
    }

    // اقتراحات بناءً على الأنماط المتكررة للمستخدم
    userPatterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3)
      .forEach((pattern, index) => {
        if (!suggestions.find(s => s.insertText.includes(pattern.pattern))) {
          suggestions.push({
            id: `pattern-${index}`,
            text: `${pattern.pattern} (مقترح من أنماطك)`,
            description: `أمر تستخدمه كثيراً (${pattern.frequency} مرة)`,
            category: 'content',
            confidence: Math.min(0.9, pattern.frequency * 0.1),
            insertText: pattern.pattern
          });
        }
      });

    return suggestions.slice(0, 6); // أقصى 6 اقتراحات
  };

  // تحديث الاقتراحات عند تغيير الكود
  useEffect(() => {
    if (analysisTimeout.current) {
      clearTimeout(analysisTimeout.current);
    }

    setIsAnalyzing(true);
    
    analysisTimeout.current = setTimeout(() => {
      // تحليل أنماط المستخدم
      const patterns = analyzeUserPatterns(code);
      setUserPatterns(patterns);

      // توليد اقتراحات ذكية
      const newSuggestions = generateSmartSuggestions(code, cursorPosition);
      setSuggestions(newSuggestions);
      
      setIsAnalyzing(false);
    }, 300); // تأخير قصير لتجنب التحليل المفرط

    return () => {
      if (analysisTimeout.current) {
        clearTimeout(analysisTimeout.current);
      }
    };
  }, [code, cursorPosition]);

  return {
    suggestions,
    userPatterns,
    isAnalyzing
  };
}