'use client';

import { useEffect, useState } from 'react';

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

  const circumference = 2 * Math.PI * 35;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ overflow: 'hidden' }}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo circle with progress */}
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-muted opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-300 ease-out motion-reduce:transition-none"
              strokeLinecap="round"
            />
          </svg>

          {/* Logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 40 40"
              fill="none"
              className="text-primary animate-pulse motion-reduce:animate-none"
            >
              <path
                d="M20 5L25 15H15L20 5Z M20 35L15 25H25L20 35Z M5 20L15 15V25L5 20Z M35 20L25 25V15L35 20Z"
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="mt-6 text-sm font-medium text-muted-foreground tabular-nums">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
