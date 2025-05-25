import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Lightbulb, 
  Zap, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Brain,
  Target
} from 'lucide-react';

interface SmartSuggestion {
  id: string;
  text: string;
  description: string;
  category: 'structure' | 'styling' | 'content' | 'list' | 'section';
  confidence: number;
  insertText: string;
}

interface CodePattern {
  pattern: string;
  frequency: number;
  lastUsed: number;
  context: string[];
}

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  userPatterns: CodePattern[];
  isAnalyzing: boolean;
  onSuggestionSelect: (suggestion: SmartSuggestion) => void;
}

const categoryIcons = {
  structure: '🏗️',
  styling: '🎨', 
  content: '📝',
  list: '📋',
  section: '📦'
};

const categoryNames = {
  structure: 'هيكل الصفحة',
  styling: 'التصميم',
  content: 'المحتوى', 
  list: 'القوائم',
  section: 'الأقسام'
};

export default function SmartSuggestions({ 
  suggestions, 
  userPatterns, 
  isAnalyzing, 
  onSuggestionSelect 
}: SmartSuggestionsProps) {
  const [showPatterns, setShowPatterns] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSuggestions = selectedCategory 
    ? suggestions.filter(s => s.category === selectedCategory)
    : suggestions;

  const categories = suggestions.map(s => s.category).filter((category, index, array) => array.indexOf(category) === index);
  const topPatterns = userPatterns
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'مؤكد';
    if (confidence >= 0.6) return 'محتمل';
    if (confidence >= 0.4) return 'مقترح';
    return 'اختياري';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-slate-700">الاقتراحات الذكية</h3>
          {isAnalyzing && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>يحلل...</span>
            </div>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {suggestions.length} اقتراح
        </Badge>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="h-7 text-xs"
          >
            الكل
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-7 text-xs"
            >
              {categoryIcons[category as keyof typeof categoryIcons]} {categoryNames[category as keyof typeof categoryNames]}
            </Button>
          ))}
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد اقتراحات حالياً</p>
            <p className="text-xs">ابدأ بكتابة الكود للحصول على اقتراحات ذكية</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors"
              onClick={() => onSuggestionSelect(suggestion)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {categoryIcons[suggestion.category]}
                      </span>
                      <code className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {suggestion.text}
                      </code>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                    >
                      {getConfidenceText(suggestion.confidence)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-slate-500">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* User Patterns Section */}
      {topPatterns.length > 0 && (
        <>
          <Separator />
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPatterns(!showPatterns)}
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">أنماطك المتكررة</span>
                <Badge variant="outline" className="text-xs">
                  {topPatterns.length}
                </Badge>
              </div>
              {showPatterns ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showPatterns && (
              <div className="mt-2 space-y-1">
                {topPatterns.map((pattern, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-blue-600" />
                      <code className="text-sm font-mono text-blue-700">
                        {pattern.pattern}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {pattern.frequency}×
                      </Badge>
                      <span className="text-xs text-blue-600">
                        {Math.round((Date.now() - pattern.lastUsed) / (1000 * 60))} دق
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Tip */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-800 mb-1">
              💡 نصيحة ذكية
            </p>
            <p className="text-xs text-purple-700 leading-relaxed">
              الاقتراحات تتحسن كلما استخدمت البرنامج أكثر. النظام يتعلم من أنماط البرمجة الخاصة بك!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}