"use client";

import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { useCmsData } from "@/providers/cms-data-provider";
import { createId, slugify } from "@/lib/utils";
import { MediaUploader } from "@/components/admin/MediaUploader";

const statusOptions = [
  { value: "upcoming", label: "În curând" },
  { value: "current", label: "În desfășurare" },
  { value: "archived", label: "Arhivată" },
];

const dateToday = () => new Date().toISOString().slice(0, 10);

export const ExpositionsPanel = () => {
  const {
    data: {
      expositions,
      artLibrary: { artworks },
    },
    updateExpositions,
  } = useCmsData();

  const updateExpo = (id: string, updater: (expo: (typeof expositions)[number]) => (typeof expositions)[number]) => {
    updateExpositions((prev) => prev.map((expo) => (expo.id === id ? updater(expo) : expo)));
  };

  const handleFieldChange = (id: string, field: keyof (typeof expositions)[number], value: unknown) => {
    updateExpo(id, (expo) => ({ ...expo, [field]: value }));
  };

  const handleTitleChange = (id: string, value: string) => {
    updateExpo(id, (expo) => {
      const nextTitle = value;
      const nextSlug = slugify(value || "expo");
      const titleDerivedSlug = slugify(expo.title || "expo");
      const shouldSyncSlug = expo.slug === titleDerivedSlug;
      return {
        ...expo,
        title: nextTitle,
        slug: shouldSyncSlug ? nextSlug : expo.slug,
      };
    });
  };

  const handleHeroChange = (id: string, patch: { src?: string; alt?: string }) => {
    updateExpo(id, (expo) => ({
      ...expo,
      heroImage: {
        id: expo.heroImage?.id ?? createId("expo-hero"),
        type: "image",
        src: patch.src ?? expo.heroImage?.src ?? "",
        alt: patch.alt ?? expo.heroImage?.alt ?? expo.title,
      },
    }));
  };

  const handleToggleArtwork = (expoId: string, artworkId: string, checked: boolean) => {
    updateExpo(expoId, (expo) => ({
      ...expo,
      featuredArtworkIds: checked ? Array.from(new Set([...expo.featuredArtworkIds, artworkId])) : expo.featuredArtworkIds.filter((id) => id !== artworkId),
    }));
  };

  const handleAddLink = (expoId: string) => {
    updateExpo(expoId, (expo) => ({
      ...expo,
      links: [
        ...expo.links,
        {
          id: createId("expo-link"),
          label: "Link",
          url: "https://",
        },
      ],
    }));
  };

  const handleLinkChange = (expoId: string, linkId: string, patch: { label?: string; url?: string }) => {
    updateExpo(expoId, (expo) => ({
      ...expo,
      links: expo.links.map((link) => (link.id === linkId ? { ...link, ...patch } : link)),
    }));
  };

  const handleRemoveLink = (expoId: string, linkId: string) => {
    updateExpo(expoId, (expo) => ({
      ...expo,
      links: expo.links.filter((link) => link.id !== linkId),
    }));
  };

  const handleAddExpo = () => {
    const id = createId("expo");
    updateExpositions((prev) => [
      ...prev,
      {
        id,
        title: "Noua expoziție",
        slug: slugify(`expo-${Date.now()}`),
        venue: "",
        location: "",
        startDate: dateToday(),
        endDate: dateToday(),
        description: "",
        featuredArtworkIds: [],
        heroImage: {
          id: createId("expo-hero"),
          type: "image",
          src: "/placeholder.jpg",
          alt: "Expoziție",
        },
        links: [],
        status: "upcoming",
      },
    ]);
  };

  const handleRemoveExpo = (id: string) => {
    updateExpositions((prev) => prev.filter((expo) => expo.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Expoziții & Activități</CardTitle>
          <CardDescription>Gestionează cronologia expozițiilor, instalațiilor și evenimentelor artistice.</CardDescription>
        </div>
        <Button type="button" onClick={handleAddExpo}>
          <Plus className="mr-2 h-4 w-4" />
          Adaugă expoziție
        </Button>
      </CardHeader>
      <CardContent>
        {expositions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nu există expoziții înregistrate încă. Adaugă prima intrare pentru a o afișa pe site.</p>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {expositions.map((expo, index) => (
              <AccordionItem key={expo.id} value={expo.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3">
                  <div className="flex w-full flex-col text-left md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{expo.title || `Expoziție fără titlu #${index + 1}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {expo.startDate} – {expo.endDate} · {expo.status === "upcoming" ? "În curând" : expo.status === "current" ? "În desfășurare" : "Arhivată"}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Locație: {expo.location || "—"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">Detalii generale</p>
                      <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveExpo(expo.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Elimină
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Titlu</label>
                        <Input value={expo.title} onChange={(event) => handleTitleChange(expo.id, event.target.value)} placeholder="Numele expoziției" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Slug</label>
                        <Input value={expo.slug} onChange={(event) => handleFieldChange(expo.id, "slug", slugify(event.target.value))} placeholder="slug-expozitie" />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Spațiu / Galerie</label>
                        <Input value={expo.venue} onChange={(event) => handleFieldChange(expo.id, "venue", event.target.value)} placeholder="Galeria Centrală" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Oraș, Țară</label>
                        <Input value={expo.location} onChange={(event) => handleFieldChange(expo.id, "location", event.target.value)} placeholder="Iași, România" />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <Select value={expo.status} onValueChange={(value) => handleFieldChange(expo.id, "status", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Început</label>
                        <Input type="date" value={expo.startDate} onChange={(event) => handleFieldChange(expo.id, "startDate", event.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Sfârșit</label>
                        <Input type="date" value={expo.endDate} onChange={(event) => handleFieldChange(expo.id, "endDate", event.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Descriere</label>
                      <Textarea value={expo.description} onChange={(event) => handleFieldChange(expo.id, "description", event.target.value)} rows={4} placeholder="Rezumatul expoziției, context, colaboratori..." />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Imagine principală</label>
                        <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted/40">
                          {expo.heroImage?.src ? (
                            <Image src={expo.heroImage.src} alt={expo.heroImage.alt || expo.title} fill className="object-contain" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Fără imagine</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input value={expo.heroImage?.src ?? ""} onChange={(event) => handleHeroChange(expo.id, { src: event.target.value })} placeholder="URL..." />
                          </div>
                          <MediaUploader
                            label="Upload"
                            directory={`expositions/${expo.id}`}
                            onUploaded={(url) => handleHeroChange(expo.id, { src: url })}
                          />
                        </div>
                        <Input
                          value={expo.heroImage?.alt ?? ""}
                          onChange={(event) => handleHeroChange(expo.id, { alt: event.target.value })}
                          placeholder="Descriere imagine"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Lucrări evidențiate</p>
                        <div className="grid gap-2 max-h-60 overflow-y-auto rounded-md border p-3 bg-background">
                          {artworks.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nu există lucrări în bibliotecă.</p>
                          ) : (
                            artworks.map((art) => (
                              <label key={art.id} className="flex items-center gap-3 rounded-md border p-2 text-sm cursor-pointer hover:bg-accent/50 transition-colors">
                                <Checkbox checked={expo.featuredArtworkIds.includes(art.id)} onCheckedChange={(checked) => handleToggleArtwork(expo.id, art.id, Boolean(checked))} />
                                <div className="relative h-8 w-8 overflow-hidden rounded-sm bg-muted">
                                  {art.heroImage?.src && (
                                    <Image 
                                      src={art.heroImage.src} 
                                      alt={art.title} 
                                      fill 
                                      className="object-cover" 
                                    />
                                  )}
                                </div>
                                <span className="line-clamp-1 flex-1">{art.title}</span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Linkuri suplimentare (press kit, bilete, etc.)</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddLink(expo.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Link nou
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {expo.links.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nu ai adăugat linkuri suplimentare.</p>
                        ) : (
                          expo.links.map((link) => (
                            <div key={link.id} className="grid gap-3 md:grid-cols-[1fr,2fr,auto]">
                              <Input value={link.label} onChange={(event) => handleLinkChange(expo.id, link.id, { label: event.target.value })} placeholder="Label" />
                              <Input value={link.url} onChange={(event) => handleLinkChange(expo.id, link.id, { url: event.target.value })} placeholder="https://..." />
                              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveLink(expo.id, link.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
      <CardFooter>{expositions.length > 0 ? <p className="text-xs text-muted-foreground">Ordinea de mai sus determină cronologia afișată pe homepage.</p> : null}</CardFooter>
    </Card>
  );
};
