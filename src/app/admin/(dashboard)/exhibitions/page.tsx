"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ExpositionsPanel } from "@/screens/admin/ExpositionsPanel";

export default function ExhibitionsPage() {
  return (
    <>
      <AdminHeader 
        title="Expoziții & Evenimente" 
        subtitle="Gestionează lista expozițiilor și evenimentelor."
        actions={<AdminPageActions />}
      />
      <div className="p-6 space-y-6">
        <ExpositionsPanel />
      </div>
    </>
  );
}

