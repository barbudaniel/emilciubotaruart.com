import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}






