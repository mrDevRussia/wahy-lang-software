import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { InterpretationResult } from '@shared/schema';

export function useWahyInterpreter() {
  const [result, setResult] = useState<InterpretationResult | null>(null);

  const interpretMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/interpret', { code });
      return response.json();
    },
    onSuccess: (data: InterpretationResult) => {
      setResult(data);
    },
    onError: (error) => {
      setResult({
        success: false,
        error: 'فشل في تفسير الكود',
      });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ code, filename }: { code: string; filename: string }) => {
      const response = await apiRequest('POST', '/api/download', { code, filename });
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    },
  });

  return {
    result,
    interpretCode: interpretMutation.mutate,
    downloadHtml: downloadMutation.mutate,
    isInterpreting: interpretMutation.isPending,
    isDownloading: downloadMutation.isPending,
    interpretError: interpretMutation.error,
    downloadError: downloadMutation.error,
  };
}
