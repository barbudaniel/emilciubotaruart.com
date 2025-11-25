"use client";

import Image from "next/image";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createId } from "@/lib/utils";
import type { Hero, HomepageSection, Artwork } from "@/lib/cms";
import { useCmsData } from "@/providers/cms-data-provider";
import { MediaUploader } from "@/components/admin/MediaUploader";

const sectionTypes = ["featured-art", "statement", "cta", "expositions", "custom"] as const;
const sectionLayouts = ["full", "split", "grid", "carousel"] as const;

export const HomepageSectionsPanel = () => {
  const {
    data,
    updateHomepage,
  } = useCmsData();
  const sections = data.homepage.sections;
  const artworks = data.artLibrary.artworks;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);

    updateHomepage((prev) => ({
      ...prev,
      sections: arrayMove(prev.sections, oldIndex, newIndex),
    }));
  };

  const handleSectionChange = (id: string, patch: Partial<HomepageSection>) => {
    updateHomepage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)),
    }));
  };

  const handleReferenceToggle = (sectionId: string, artworkId: string, checked: boolean) => {
    handleSectionChange(sectionId, {
      referenceIds: checked
        ? Array.from(new Set(sections.find((section) => section.id === sectionId)?.referenceIds.concat(artworkId) ?? []))
        : sections.find((section) => section.id === sectionId)?.referenceIds.filter((id) => id !== artworkId) ?? [],
    });
  };

  const handleAddSection = () => {
    updateHomepage((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: createId("home-section"),
          title: "Noua secțiune",
          description: "",
          type: "custom",
          layout: "full",
          enabled: true,
          referenceIds: [],
          manualContent: "",
        },
      ],
    }));
  };

  const handleRemoveSection = (id: string) => {
    updateHomepage((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
    }));
  };

  const hero = data.homepage.hero;

  const handleHeroChange = (patch: Partial<Hero>) => {
    updateHomepage((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...patch,
      },
    }));
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Hero Homepage</CardTitle>
          <CardDescription>Editează imaginea de fundal, headline-ul și butoanele principale.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
            <div className="space-y-4">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border bg-muted/40">
                {hero.background?.src ? (
                  <Image 
                    src={hero.background.src} 
                    alt={hero.background.alt || "Hero background"} 
                    fill 
                    className="object-contain" 
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Nicio imagine de fundal
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={hero.background?.src ?? ""}
                    onChange={(event) =>
                      handleHeroChange({
                        background: {
                          ...hero.background,
                          src: event.target.value,
                        },
                      })
                    }
                    placeholder="URL imagine..."
                  />
                </div>
                <MediaUploader
                  label="Upload"
                  directory="hero"
                  onUploaded={(url) =>
                    handleHeroChange({
                      background: {
                        ...hero.background,
                        src: url,
                      },
                    })
                  }
                />
              </div>
              <Input
                value={hero.background?.alt ?? ""}
                onChange={(event) =>
                  handleHeroChange({
                    background: {
                      ...hero.background,
                      alt: event.target.value,
                    },
                  })
                }
                placeholder="Alt text (descriere pentru accesibilitate)"
              />
            </div>

            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Eyebrow</label>
                  <Input value={hero.eyebrow} onChange={(event) => handleHeroChange({ eyebrow: event.target.value })} placeholder="Painter Artist" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Titlu</label>
                  <Input value={hero.title} onChange={(event) => handleHeroChange({ title: event.target.value })} placeholder="Emil Ciubotaru" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descriere</label>
                  <Textarea value={hero.description} onChange={(event) => handleHeroChange({ description: event.target.value })} rows={3} placeholder="Pictez lumina..." />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">CTA principal</p>
                  <Input
                    value={hero.ctaPrimary.label}
                    onChange={(event) => handleHeroChange({ ctaPrimary: { ...hero.ctaPrimary, label: event.target.value } })}
                    placeholder="Vezi galeria"
                  />
                  <Input
                    value={hero.ctaPrimary.href}
                    onChange={(event) => handleHeroChange({ ctaPrimary: { ...hero.ctaPrimary, href: event.target.value } })}
                    placeholder="/painting-art"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">CTA secundar</p>
                  <Switch
                    checked={Boolean(hero.ctaSecondary)}
                    onCheckedChange={(checked) =>
                      handleHeroChange({
                        ctaSecondary: checked ? hero.ctaSecondary ?? { label: "Contact atelier", href: "/contact" } : undefined,
                      })
                    }
                  />
                  {hero.ctaSecondary ? (
                    <div className="space-y-2">
                      <Input
                        value={hero.ctaSecondary.label}
                        onChange={(event) => handleHeroChange({ ctaSecondary: { ...hero.ctaSecondary, label: event.target.value } })}
                        placeholder="Contact"
                      />
                      <Input
                        value={hero.ctaSecondary.href}
                        onChange={(event) => handleHeroChange({ ctaSecondary: { ...hero.ctaSecondary, href: event.target.value } })}
                        placeholder="/contact"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Secțiuni Homepage</CardTitle>
          <CardDescription>Controlează ordinea, tipul și conținutul secțiunilor vizibile pe homepage.</CardDescription>
        </div>
        <Button onClick={handleAddSection} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă secțiune
        </Button>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nu există secțiuni configurate încă.</p>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onChange={handleSectionChange}
                    onRemove={handleRemoveSection}
                    artworks={artworks}
                    onReferenceToggle={handleReferenceToggle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
    </>
  );
};

const SectionCard = ({
  section,
  onChange,
  onRemove,
  artworks,
  onReferenceToggle,
}: {
  section: HomepageSection;
  onChange: (id: string, patch: Partial<HomepageSection>) => void;
  onRemove: (id: string) => void;
  artworks: Artwork[];
  onReferenceToggle: (sectionId: string, artworkId: string, checked: boolean) => void;
}) => {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 border-b p-4">
        <button
          type="button"
          className="rounded-md border bg-muted/60 p-2 text-muted-foreground hover:text-foreground"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div>
          <p className="text-base font-semibold">{section.title || "Secțiune fără titlu"}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{section.type}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Activă</span>
            <Switch checked={section.enabled} onCheckedChange={(checked) => onChange(section.id, { enabled: checked })} />
          </div>
          <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onRemove(section.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Titlu</label>
            <Input value={section.title} onChange={(event) => onChange(section.id, { title: event.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Descriere</label>
            <Input value={section.description} onChange={(event) => onChange(section.id, { description: event.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tip</label>
            <Select value={section.type} onValueChange={(value) => onChange(section.id, { type: value as HomepageSection["type"] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Layout</label>
            <Select value={section.layout} onValueChange={(value) => onChange(section.id, { layout: value as HomepageSection["layout"] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionLayouts.map((layout) => (
                  <SelectItem key={layout} value={layout}>
                    {layout}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Manual content</label>
            <Textarea value={section.manualContent ?? ""} onChange={(event) => onChange(section.id, { manualContent: event.target.value })} rows={2} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Lucrări asociate</p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-60 overflow-y-auto p-1">
            {artworks.map((art) => (
              <label key={art.id} className="flex items-center gap-3 rounded-md border p-2 text-sm cursor-pointer hover:bg-accent/50 transition-colors">
                <Checkbox
                  checked={section.referenceIds.includes(art.id)}
                  onCheckedChange={(checked) => onReferenceToggle(section.id, art.id, Boolean(checked))}
                />
                <div className="relative h-10 w-10 overflow-hidden rounded-sm bg-muted">
                  {art.heroImage?.src && (
                    <Image 
                      src={art.heroImage.src} 
                      alt={art.title} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{art.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{art.collection}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
