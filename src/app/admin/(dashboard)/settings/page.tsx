"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { SiteIdentityPanel } from "@/screens/admin/SiteIdentityPanel";
import { ContactPanel } from "@/screens/admin/ContactPanel";

export default function SettingsPage() {
  return (
    <>
      <AdminHeader 
        title="Setări & Navigație" 
        subtitle="Configurează identitatea site-ului, meniul și datele de contact."
        actions={<AdminPageActions />}
      />
      <div className="p-6 space-y-6">
        <SiteIdentityPanel />
        <ContactPanel />
      </div>
    </>
  );
}
