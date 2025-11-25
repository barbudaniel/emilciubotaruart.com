"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { HomepageSectionsPanel } from "@/screens/admin/HomepageSectionsPanel";

export default function HomepagePage() {
  return (
    <>
      <AdminHeader 
        title="Homepage" 
        subtitle="Editează secțiunile și conținutul primei pagini."
        actions={<AdminPageActions />}
      />
      <div className="p-6 space-y-6">
        <HomepageSectionsPanel />
      </div>
    </>
  );
}
