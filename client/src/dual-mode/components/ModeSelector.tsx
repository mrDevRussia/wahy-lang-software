/**
 * واجهة اختيار وضع وحي - Web Dual Mode
 * Mode Selector للتبديل بين أوضاع تطوير الويب والأمن السيبراني
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Shield, 
  Zap, 
  HardDrive, 
  Clock,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import WebModeManager, { WahyWebMode } from '../core/mode-manager';

interface ModeSelectorProps {
  onModeSelect: (modeId: string) => void;
  currentMode?: string | null;
  className?: string;
}

export default function ModeSelector({ onModeSelect, currentMode, className }: ModeSelectorProps) {
  const [modeManager] = useState(() => new WebModeManager());
  const [availableModes, setAvailableModes] = useState<WahyWebMode[]>([]);
  const [loadingMode, setLoadingMode] = useState<string | null>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // تهيئة الأوضاع المتاحة
    setAvailableModes(modeManager.getAvailableModes());
    
    // تحديث إحصائيات الأداء كل ثانية
    const statsInterval = setInterval(() => {
      setPerformanceStats(modeManager.getPerformanceStats());
    }, 1000);

    // الاستماع لأحداث تبديل الوضع
    modeManager.on('mode-switched', (data: any) => {
      setLoadingMode(null);
      setError(null);
      console.log('🎉 تم تبديل الوضع بنجاح:', data);
    });

    modeManager.on('mode-switch-error', (data: any) => {
      setLoadingMode(null);
      setError(data.error);
      console.error('❌ خطأ في تبديل الوضع:', data);
    });

    return () => {
      clearInterval(statsInterval);
      modeManager.cleanup();
    };
  }, [modeManager]);

  const handleModeSelect = async (modeId: string) => {
    if (loadingMode || modeId === currentMode) return;

    setLoadingMode(modeId);
    setError(null);

    try {
      const result = await modeManager.switchMode(modeId);
      
      if (result.success) {
        onModeSelect(modeId);
      } else {
        setError(result.error || 'خطأ في تبديل الوضع');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoadingMode(null);
    }
  };

  const getModeIcon = (modeId: string) => {
    switch (modeId) {
      case 'web-dev':
        return <Globe className="w-8 h-8" />;
      case 'cybersecurity':
        return <Shield className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  };

  const formatMemoryUsage = (memory: number): string => {
    return `${memory.toFixed(1)} MB`;
  };

  const getPerformanceColor = (usage: number, max: number): string => {
    const percentage = (usage / max) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          اختر وضع العمل
        </h2>
        <p className="text-muted-foreground">
          اختر بين وضع تطوير الويب أو وضع الأمن السيبراني للبدء
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">خطأ في التبديل:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Stats */}
      {performanceStats && (
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 space-x-reverse">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span>إحصائيات الأداء</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">الوضع الحالي</p>
                <p className="font-medium">
                  {performanceStats.currentMode || 'لم يتم الاختيار'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">الذاكرة المستخدمة</p>
                <p className="font-medium">
                  {formatMemoryUsage(performanceStats.totalMemoryUsed)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">الأوضاع المحملة</p>
                <p className="font-medium">
                  {performanceStats.loadedModes.length}
                </p>
              </div>
            </div>
            
            {performanceStats.browserMemory && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ذاكرة المتصفح</span>
                  <span>
                    {(performanceStats.browserMemory.usedJSHeapSize / (1024 * 1024)).toFixed(1)} MB
                    /
                    {(performanceStats.browserMemory.totalJSHeapSize / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
                <Progress 
                  value={(performanceStats.browserMemory.usedJSHeapSize / performanceStats.browserMemory.totalJSHeapSize) * 100}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mode Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableModes.map((mode) => {
          const isSelected = currentMode === mode.id;
          const isLoading = loadingMode === mode.id;
          const memoryUsage = performanceStats?.memoryUsage[mode.id] || 0;

          return (
            <Card 
              key={mode.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group ${
                isSelected 
                  ? 'ring-2 ring-blue-500 border-blue-200' 
                  : 'hover:border-gray-300'
              } ${
                isLoading ? 'opacity-75' : ''
              }`}
              onClick={() => !isLoading && handleModeSelect(mode.id)}
            >
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">جاري التحميل...</span>
                  </div>
                </div>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${mode.color}15`, color: mode.color }}
                    >
                      {getModeIcon(mode.id)}
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {mode.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mode.nameEn}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {mode.description}
                </p>

                <Separator />

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">المميزات:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {mode.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {mode.features.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{mode.features.length - 3} ميزة أخرى
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Technical Info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <HardDrive className="w-3 h-3" />
                      <span className={getPerformanceColor(memoryUsage, mode.maxMemory)}>
                        {formatMemoryUsage(memoryUsage)} / {formatMemoryUsage(mode.maxMemory)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-3 h-3" />
                      <span>{mode.estimatedSize}KB</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={isSelected ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {isSelected ? 'نشط' : 'متاح'}
                  </Badge>
                </div>

                {/* Memory Usage Progress */}
                {memoryUsage > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>استخدام الذاكرة</span>
                      <span>{((memoryUsage / mode.maxMemory) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(memoryUsage / mode.maxMemory) * 100}
                      className="h-1.5"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Button */}
      {currentMode && (
        <div className="text-center">
          <Button 
            onClick={() => onModeSelect(currentMode)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Zap className="w-5 h-5 mr-2" />
            ابدأ العمل في الوضع المختار
          </Button>
        </div>
      )}
    </div>
  );
}