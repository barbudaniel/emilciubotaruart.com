"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useCmsData } from "@/providers/cms-data-provider";

const statusCopy: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" }> = {
  loading: { label: "Se încarcă", variant: "outline" },
  ready: { label: "Live în browser", variant: "secondary" },
  error: { label: "Eroare", variant: "destructive" },
};

type AdminHeaderProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export const AdminHeader = ({ title = "Website CMS", subtitle, actions }: AdminHeaderProps) => {
  const { status, lastSavedAt } = useCmsData();

  const statusMeta = statusCopy[status] ?? statusCopy.loading;
  const lastSaved = lastSavedAt ? new Intl.DateTimeFormat("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(lastSavedAt) : "încă nesalvat";
  const resolvedSubtitle = subtitle ?? `Ultima salvare locală: ${lastSaved}`;

  return (
    <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{resolvedSubtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
};
