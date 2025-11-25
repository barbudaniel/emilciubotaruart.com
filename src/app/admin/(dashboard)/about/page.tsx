"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { AboutPanel } from "@/screens/admin/AboutPanel";

export default function AboutPage() {
  return (
    <>
      <AdminHeader 
        title="Despre Artist" 
        subtitle="Editează biografia și imaginea de profil."
        actions={<AdminPageActions />}
      />
      <div className="p-6 space-y-6">
        <AboutPanel />
      </div>
    </>
  );
}
