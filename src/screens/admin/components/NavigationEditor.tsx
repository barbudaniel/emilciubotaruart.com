"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Info, LinkIcon, Plus, Trash2 } from "lucide-react";

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
import { NavigationItem } from "@/lib/cms";
import { createId, slugify } from "@/lib/utils";

type NavigationEditorProps = {
  items: NavigationItem[];
  onChange: (next: NavigationItem[]) => void;
};

const buildChildHref = (parentHref: string | undefined, label: string) => {
  const slug = slugify(label);
  if (!parentHref || parentHref === "/" || parentHref === "#") {
    return `/${slug}`;
  }
  if (parentHref === "/painting-art" || parentHref === "/abstract-art") {
    return `${parentHref}?category=${slug}`;
  }
  if (parentHref.endsWith("/")) {
    return `${parentHref}${slug}`;
  }
  if (parentHref.includes("?")) {
    const separator = parentHref.includes("category=") ? "&" : "&category=";
    return `${parentHref}${separator}${slug}`;
  }
  return `${parentHref}/${slug}`;
};

const normalizeChildLinks = (collection: NavigationItem[]) =>
  collection.map((item) => ({
    ...item,
    children: item.children.map((child) => ({
      ...child,
      href: buildChildHref(item.href, child.label),
    })),
  }));

export const NavigationEditor = ({ items, onChange }: NavigationEditorProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const applyChange = (mutator: (collection: NavigationItem[]) => NavigationItem[]) => {
    const next = mutator(items);
    onChange(normalizeChildLinks(next));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    applyChange((collection) => arrayMove(collection, oldIndex, newIndex));
  };

  const handleItemChange = (id: string, patch: Partial<NavigationItem>) => {
    applyChange((collection) => updateNavigationTree(collection, id, (item) => ({ ...item, ...patch })));
  };

  const handleRemove = (id: string) => {
    applyChange((collection) => removeNavigationItem(collection, id));
  };

  const handleAddChild = (parentId: string) => {
    const newChild: NavigationItem = {
      id: createId("nav-child"),
      label: "Sub-link",
      href: "/",
      description: "",
      isExternal: false,
      highlight: false,
      children: [],
    };

    applyChange((collection) => addChildNavigationItem(collection, parentId, newChild));
  };

  const handleAddItem = () => {
    const newItem: NavigationItem = {
      id: createId("nav"),
      label: "Nou link",
      href: "/",
      description: "",
      isExternal: false,
      highlight: false,
      children: [],
    };

    applyChange((collection) => [...collection, newItem]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Navigare & Subnavigare</CardTitle>
          <CardDescription>Reordonează și editează link-urile care apar în meniu.</CardDescription>
        </div>
        <Button type="button" onClick={handleAddItem} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă link principal
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Nu există elemente în navigație. Adaugă primul link pentru a începe.
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {items.map((item) => (
                  <SortableNavItem
                    key={item.id}
                    item={item}
                    onChange={handleItemChange}
                    onRemove={handleRemove}
                    onAddChild={handleAddChild}
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

type SortableNavItemProps = {
  item: NavigationItem;
  onChange: (id: string, patch: Partial<NavigationItem>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
};

const SortableNavItem = ({ item, onChange, onRemove, onAddChild }: SortableNavItemProps) => {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border bg-card shadow-sm">
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
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Input
            value={item.label}
            onChange={(event) => onChange(item.id, { label: event.target.value })}
            className="w-full min-w-[160px] flex-1"
            placeholder="Etichetă"
          />
          <Input
            value={item.href}
            onChange={(event) => onChange(item.id, { href: event.target.value })}
            className="w-full min-w-[160px] flex-1"
            placeholder="/ruta"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Highlight</span>
            <Switch checked={item.highlight} onCheckedChange={(checked) => onChange(item.id, { highlight: checked })} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Extern</span>
            <Switch checked={item.isExternal} onCheckedChange={(checked) => onChange(item.id, { isExternal: checked })} />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 p-4">
        <Textarea
          placeholder="Descriere / tooltip (opțional)"
          value={item.description || ""}
          onChange={(event) => onChange(item.id, { description: event.target.value })}
        />

        {item.children.length > 0 && (
          <div className="space-y-3 rounded-md border bg-muted/40 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              Link-urile pentru subcategorii sunt generate automat din titlu.
            </p>
            {item.children.map((child) => (
              <div key={child.id} className="space-y-3 rounded-md border bg-background p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    value={child.label}
                    onChange={(event) =>
                      onChange(child.id, {
                        label: event.target.value,
                        href: buildChildHref(item.href, event.target.value),
                      })
                    }
                    className="w-full min-w-[140px] flex-1"
                    placeholder="Categorie"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRemove(child.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  <LinkIcon className="h-3 w-3" />
                  <span>{child.href}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button type="button" variant="outline" size="sm" onClick={() => onAddChild(item.id)}>
          <Plus className="mr-2 h-4 w-4" />
          Sub-link
        </Button>
      </div>
    </div>
  );
};

type Transformation = (item: NavigationItem) => NavigationItem;

const updateNavigationTree = (collection: NavigationItem[], id: string, transformer: Transformation): NavigationItem[] =>
  collection.map((item) => {
    if (item.id === id) {
      return transformer(item);
    }

    return {
      ...item,
      children: updateNavigationTree(item.children, id, transformer),
    };
  });

const removeNavigationItem = (collection: NavigationItem[], id: string): NavigationItem[] =>
  collection
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: removeNavigationItem(item.children, id),
    }));

const addChildNavigationItem = (collection: NavigationItem[], parentId: string, child: NavigationItem): NavigationItem[] =>
  collection.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...item.children, child],
      };
    }

    return {
      ...item,
      children: addChildNavigationItem(item.children, parentId, child),
    };
  });
