"use client";

import { SiteIdentityPanel } from "./SiteIdentityPanel";
import { HomepageSectionsPanel } from "./HomepageSectionsPanel";
import { AboutPanel } from "./AboutPanel";
import { ArtLibraryPanel } from "./ArtLibraryPanel";
import { ExpositionsPanel } from "./ExpositionsPanel";
import { ContactPanel } from "./ContactPanel";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCmsData } from "@/providers/cms-data-provider";
import { MessageSquare } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const AdminPage = () => {
  const { error } = useCmsData();
  const [mounted, setMounted] = useState(false);
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted ? (
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Se încarcă panoul administrativ...
        </div>
      ) : (
        <div className="min-h-[100dvh] bg-muted/40">
          <AdminHeader
            actions={
              supabaseConfigured ? (
                <Link href="/admin/contact-submissions">
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Mesaje Contact
                  </Button>
                </Link>
              ) : null
            }
          />

          <div className="container mx-auto px-4 py-8 space-y-8">
            {error ? (
              <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            ) : null}

            <Tabs defaultValue="site" className="space-y-8">
              <TabsList className="grid w-full grid-cols-1 gap-2 md:grid-cols-5">
                <TabsTrigger value="site">Identitate & Navigație</TabsTrigger>
                <TabsTrigger value="contact">Pagina de contact</TabsTrigger>
                <TabsTrigger value="homepage">Homepage & About</TabsTrigger>
                <TabsTrigger value="expos">Expoziții & evenimente</TabsTrigger>
                <TabsTrigger value="art">Bibliotecă artă</TabsTrigger>
              </TabsList>
              <TabsContent value="site" className="space-y-8">
                <SiteIdentityPanel />
              </TabsContent>
              <TabsContent value="contact">
                <ContactPanel />
              </TabsContent>
              <TabsContent value="homepage" className="space-y-8">
                <HomepageSectionsPanel />
                <AboutPanel />
              </TabsContent>
              <TabsContent value="expos" className="space-y-8">
                <ExpositionsPanel />
              </TabsContent>
              <TabsContent value="art" className="space-y-8">
                <ArtLibraryPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};
