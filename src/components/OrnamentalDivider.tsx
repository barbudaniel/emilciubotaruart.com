"use client";

import { Sparkle } from "lucide-react";

export const OrnamentalDivider = () => {
  return (
    <div className="flex items-center justify-center gap-3 py-4 my-4">
      <span className="h-px w-12 bg-border" />
      <Sparkle className="h-4 w-4 text-primary/60" />
      <span className="h-px w-12 bg-border" />
    </div>
  );
};