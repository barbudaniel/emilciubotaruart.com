"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/supabase/auth";

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<"idle" | "checking" | "allowed">("idle");
  const router = useRouter();
  const pathname = usePathname();
  const supabaseConfigured = Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
  );

  useEffect(() => {
    if (!supabaseConfigured) {
      setStatus("allowed");
      return;
    }

    let mounted = true;
    setStatus("checking");

    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        if (user) {
          setStatus("allowed");
        } else if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        } else {
          setStatus("allowed");
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus("allowed");
        }
      });

    return () => {
      mounted = false;
    };
  }, [pathname, router, supabaseConfigured]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Se verifică accesul...</p>
      </div>
    );
  }

  return <>{children}</>;
};
