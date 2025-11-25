'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-24 w-24 rounded-full border-2 border-border" />
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        <div className="w-48 h-1.5 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground tabular-nums">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};
