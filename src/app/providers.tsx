"use client";

import { ReactNode } from "react";

import { CmsDataProvider } from "@/providers/cms-data-provider";
import type { CmsData } from "@/lib/cms";

export function AppProviders({ children, initialData }: { children: ReactNode; initialData?: CmsData }) {
  return <CmsDataProvider initialData={initialData}>{children}</CmsDataProvider>;
}
