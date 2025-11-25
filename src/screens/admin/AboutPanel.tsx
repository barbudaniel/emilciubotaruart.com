"use client";

import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Plus, Trash2 } from "lucide-react";

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
import { createId } from "@/lib/utils";
import type { AboutContent } from "@/lib/cms";
import { useCmsData } from "@/providers/cms-data-provider";
import { MediaUploader } from "@/components/admin/MediaUploader";

export const AboutPanel = () => {
  const {
    data: {
      homepage: { about },
    },
    updateHomepage,
  } = useCmsData();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleAboutChange = (patch: Partial<AboutContent>) => {
    updateHomepage((prev) => ({
      ...prev,
      about: { ...prev.about, ...patch },
    }));
  };

  const handleBlockChange = (id: string, patch: Partial<AboutContent["blocks"][number]>) => {
    handleAboutChange({
      blocks: about.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = about.blocks.findIndex((block) => block.id === active.id);
    const newIndex = about.blocks.findIndex((block) => block.id === over.id);
    handleAboutChange({
      blocks: arrayMove(about.blocks, oldIndex, newIndex),
    });
  };

  const handleAddBlock = () => {
    handleAboutChange({
      blocks: [
        ...about.blocks,
        {
          id: createId("about-block"),
          title: "Titlu secțiune",
          body: "",
          media: undefined,
        },
      ],
    });
  };

  const handleRemoveBlock = (id: string) => {
    handleAboutChange({
      blocks: about.blocks.filter((block) => block.id !== id),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Secțiune &ldquo;Despre&rdquo;</CardTitle>
          <CardDescription>Editează textul introductiv și blocurile narative.</CardDescription>
        </div>
        <Button variant="outline" onClick={handleAddBlock}>
          <Plus className="mr-2 h-4 w-4" />
          Bloc nou
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Headline</label>
            <Input value={about.headline} onChange={(event) => handleAboutChange({ headline: event.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Rezumat</label>
            <Input value={about.summary} onChange={(event) => handleAboutChange({ summary: event.target.value })} />
          </div>
        </div>

        {about.blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Adaugă un bloc pentru a începe.</p>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={about.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {about.blocks.map((block) => (
                  <AboutBlockCard
                    key={block.id}
                    block={block}
                    onChange={handleBlockChange}
                    onRemove={handleRemoveBlock}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};

const AboutBlockCard = ({
  block,
  onChange,
  onRemove,
}: {
  block: AboutContent["blocks"][number];
  onChange: (id: string, patch: Partial<AboutContent["blocks"][number]>) => void;
  onRemove: (id: string) => void;
}) => {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border">
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
        <div className="flex-1">
          <p className="font-semibold">{block.title || "Bloc fără titlu"}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Secțiune despre</p>
        </div>
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onRemove(block.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Titlu</label>
            <Input value={block.title} onChange={(event) => onChange(block.id, { title: event.target.value })} />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Imagine</label>
            <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted/40">
              {block.media?.src ? (
                <Image 
                  src={block.media.src} 
                  alt={block.media.alt || block.title} 
                  fill 
                  className="object-contain" 
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Fără imagine</div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={block.media?.src ?? ""}
                onChange={(event) =>
                  onChange(block.id, {
                    media: event.target.value
                      ? {
                          id: block.media?.id ?? createId("about-media"),
                          type: "image",
                          src: event.target.value,
                          alt: block.media?.alt ?? block.title,
                        }
                      : undefined,
                  })
                }
                placeholder="URL imagine..."
                className="flex-1"
              />
              <MediaUploader
                label="Upload"
                directory={`about/${block.id}`}
                onUploaded={(url) =>
                  onChange(block.id, {
                    media: {
                      id: block.media?.id ?? createId("about-media"),
                      type: "image",
                      src: url,
                      alt: block.media?.alt ?? block.title,
                    },
                  })
                }
              />
            </div>
            {block.media && (
              <div className="grid gap-2 md:grid-cols-[1fr,auto]">
                <Input 
                  value={block.media.alt} 
                  onChange={(event) => onChange(block.id, { media: { ...block.media!, alt: event.target.value } })}
                  placeholder="Alt text (descriere)"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onChange(block.id, { media: undefined })}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Șterge imaginea
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Descriere</label>
          <Textarea value={block.body} onChange={(event) => onChange(block.id, { body: event.target.value })} rows={6} />
        </div>
      </div>
    </div>
  );
};
