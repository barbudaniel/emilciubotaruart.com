"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ArtLibraryPanel } from "@/screens/admin/ArtLibraryPanel";

export default function ArtworksPage() {
  return (
    <>
      <AdminHeader 
        title="Bibliotecă Artă" 
        subtitle="Gestionează lucrările de artă, categoriile și colecțiile."
        actions={<AdminPageActions />}
      />
      <div className="p-6 space-y-6">
        <ArtLibraryPanel />
      </div>
    </>
  );
}
