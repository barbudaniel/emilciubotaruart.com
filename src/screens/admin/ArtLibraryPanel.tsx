"use client";

import Image from "next/image";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { createId, slugify } from "@/lib/utils";
import type { Artwork } from "@/lib/cms";
import { useCmsData } from "@/providers/cms-data-provider";
import { Trash2 } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";

const statusOptions: Artwork["status"][] = ["draft", "published", "archived"];

const deriveVisibility = (status: Artwork["status"]): Artwork["visibility"] => (status === "published" ? "public" : "private");

export const ArtLibraryPanel = () => {
  const {
    data: {
      artLibrary: { artworks },
      siteIdentity: { navigation },
    },
    updateArtLibrary,
  } = useCmsData();

  const collectionsFromNavigation = navigation
    .filter((item) => item.children.length > 0)
    .map((item) => ({
      label: item.label,
      categories: item.children.map((child) => child.label),
    }));

  const fallbackCollections = Array.from(new Set(artworks.map((art) => art.collection).filter(Boolean)));
  const allCollectionOptions = Array.from(new Set([...collectionsFromNavigation.map((c) => c.label), ...fallbackCollections]));

  const fallbackCategoriesMap = artworks.reduce((acc, art) => {
    if (art.collection && art.category) {
      if (!acc.has(art.collection)) {
        acc.set(art.collection, new Set<string>());
      }
      acc.get(art.collection)!.add(art.category);
    }
    return acc;
  }, new Map<string, Set<string>>());

  const getCategoriesForCollection = (collectionName: string) => {
    const match = collectionsFromNavigation.find((entry) => entry.label === collectionName);
    const navCategories = match ? match.categories : [];
    const fallback = Array.from(fallbackCategoriesMap.get(collectionName) ?? []);
    return Array.from(new Set([...navCategories, ...fallback]));
  };

  const ensureSlug = (title: string, id: string, currentSlug?: string) => {
    const base = slugify(title || "lucrare");
    if (!base) {
      return currentSlug || createId("art");
    }
    let candidate = base;
    let counter = 2;
    while (artworks.some((art) => art.id !== id && art.slug === candidate)) {
      candidate = `${base}-${counter++}`;
    }
    return candidate;
  };

  const handleArtChange = (id: string, patch: Partial<Artwork>) => {
    updateArtLibrary((prev) => ({
      ...prev,
      artworks: prev.artworks.map((art) => (art.id === id ? { ...art, ...patch } : art)),
    }));
  };

  const handleAddArtwork = () => {
    const defaultCollection = allCollectionOptions[0] ?? "";
    const defaultCategory = defaultCollection ? getCategoriesForCollection(defaultCollection)[0] ?? "" : "";
    const newArtwork: Artwork = {
      id: createId("art"),
      title: "Lucrare nouă",
      summary: "",
      collection: defaultCollection,
      category: defaultCategory,
      style: "",
      status: "draft",
      visibility: deriveVisibility("draft"),
      year: new Date().getFullYear().toString(),
      materials: [],
      palette: [],
      dimensions: { width: 50, height: 50, unit: "cm" },
      heroImage: { id: createId("hero"), type: "image", src: "/placeholder.jpg", alt: "Lucrare" },
      gallery: [],
      qrCode: {
        id: createId("qr"),
        label: "QR",
        targetUrl: "",
        includePrice: false,
        callToAction: "Scanează pentru detalii",
        printSize: "80mm",
      },
      related: { mode: "auto", autoTags: [], manualIds: [] },
      seo: { title: "", description: "", keywords: [] },
    };
    newArtwork.slug = ensureSlug(newArtwork.title, newArtwork.id);

    updateArtLibrary((prev) => ({
      ...prev,
      artworks: [...prev.artworks, newArtwork],
    }));
  };

  const handleRemoveArtwork = (id: string) => {
    updateArtLibrary((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((art) => art.id !== id),
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Bibliotecă de lucrări</CardTitle>
          <CardDescription>Administrează creațiile expuse pe site.</CardDescription>
        </div>
        <Button onClick={handleAddArtwork}>
          Adaugă lucrare
        </Button>
      </CardHeader>
      <CardContent>
        {artworks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nu există lucrări încă. Adaugă prima în colecție.</p>
        ) : (
          <Accordion type="multiple" className="divide-y">
            {artworks.map((artwork) => (
              <AccordionItem key={artwork.id} value={artwork.id}>
                <AccordionTrigger>
                  <div className="flex w-full items-center justify-between text-left">
                    <div>
                      <p className="font-semibold">{artwork.title}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{artwork.status}</p>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleRemoveArtwork(artwork.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleRemoveArtwork(artwork.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </span>
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-2">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Titlu</label>
            <Input
              value={artwork.title}
              onChange={(event) =>
                handleArtChange(artwork.id, {
                  title: event.target.value,
                  slug: ensureSlug(event.target.value, artwork.id, artwork.slug),
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Slug (generat automat)</label>
            <Input value={artwork.slug} readOnly className="bg-muted/50" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Colecție</label>
            <Input
              value={artwork.collection || ""}
              onChange={(event) => handleArtChange(artwork.id, { collection: event.target.value })}
              placeholder="ex: Pictură, Artă Abstractă"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Categorie</label>
            <Input
              value={artwork.category || ""}
              onChange={(event) => handleArtChange(artwork.id, { category: event.target.value })}
              placeholder="ex: Natură, Portret, Peisaj"
            />
          </div>
        </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Descriere</label>
                      <Textarea value={artwork.summary} onChange={(event) => handleArtChange(artwork.id, { summary: event.target.value })} rows={3} />
                    </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Select
              value={artwork.status}
              onValueChange={(value) =>
                handleArtChange(artwork.id, { status: value as Artwork["status"], visibility: deriveVisibility(value as Artwork["status"]) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">An</label>
            <Input value={artwork.year} onChange={(event) => handleArtChange(artwork.id, { year: event.target.value })} />
          </div>
        </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mediu / Materiale</label>
                        <Input
                          value={artwork.materials.join(", ")}
                          onChange={(event) =>
                            handleArtChange(artwork.id, {
                              materials: event.target.value.split(",").map((m) => m.trim()).filter(Boolean),
                            })
                          }
                          placeholder="ex: ulei pe pânză, acrilic"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Separați materialele cu virgulă</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <p className="text-sm font-semibold">Dimensiuni</p>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Lățime</label>
                          <Input
                            type="number"
                            value={artwork.dimensions.width}
                            onChange={(event) =>
                              handleArtChange(artwork.id, {
                                dimensions: { ...artwork.dimensions, width: Number(event.target.value) },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Înălțime</label>
                          <Input
                            type="number"
                            value={artwork.dimensions.height}
                            onChange={(event) =>
                              handleArtChange(artwork.id, {
                                dimensions: { ...artwork.dimensions, height: Number(event.target.value) },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Adâncime</label>
                          <Input
                            type="number"
                            value={artwork.dimensions.depth || ""}
                            onChange={(event) =>
                              handleArtChange(artwork.id, {
                                dimensions: { ...artwork.dimensions, depth: event.target.value ? Number(event.target.value) : undefined },
                              })
                            }
                            placeholder="opțional"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Unitate</label>
                          <Select
                            value={artwork.dimensions.unit}
                            onValueChange={(value) =>
                              handleArtChange(artwork.id, {
                                dimensions: { ...artwork.dimensions, unit: value as "cm" | "in" },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="in">in</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <p className="text-sm font-semibold">Preț</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Sumă</label>
                            <Input
                              type="number"
                              value={artwork.pricing?.amount || ""}
                              onChange={(event) =>
                                handleArtChange(artwork.id, {
                                  pricing: {
                                    amount: Number(event.target.value),
                                    currency: artwork.pricing?.currency || "EUR",
                                    isAvailable: artwork.pricing?.isAvailable ?? true,
                                    availabilityStatus: artwork.pricing?.availabilityStatus || "available",
                                    notes: artwork.pricing?.notes || "",
                                  },
                                })
                              }
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Monedă</label>
                            <Select
                              value={artwork.pricing?.currency || "EUR"}
                              onValueChange={(value) =>
                                handleArtChange(artwork.id, {
                                  pricing: {
                                    amount: artwork.pricing?.amount || 0,
                                    currency: value,
                                    isAvailable: artwork.pricing?.isAvailable ?? true,
                                    availabilityStatus: artwork.pricing?.availabilityStatus || "available",
                                    notes: artwork.pricing?.notes || "",
                                  },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="RON">RON</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Disponibil</label>
                            <p className="text-xs text-muted-foreground mb-2">Setarea globală de vizibilitate a prețului</p>
                            <Select
                              value={(artwork.pricing?.isAvailable ?? true) ? "true" : "false"}
                              onValueChange={(value) =>
                                handleArtChange(artwork.id, {
                                  pricing: {
                                    amount: artwork.pricing?.amount || 0,
                                    currency: artwork.pricing?.currency || "EUR",
                                    isAvailable: value === "true",
                                    availabilityStatus: artwork.pricing?.availabilityStatus || "available",
                                    notes: artwork.pricing?.notes || "",
                                  },
                                })
                              }
                            >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Da</SelectItem>
                              <SelectItem value="false">Nu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status Disponibilitate</label>
                          <Select
                            value={artwork.pricing?.availabilityStatus || "available"}
                            onValueChange={(value) =>
                              handleArtChange(artwork.id, {
                                pricing: {
                                  amount: artwork.pricing?.amount || 0,
                                  currency: artwork.pricing?.currency || "EUR",
                                  isAvailable: artwork.pricing?.isAvailable ?? true,
                                  availabilityStatus: value as "available" | "on_command" | "sold",
                                  notes: artwork.pricing?.notes || "",
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Disponibil</SelectItem>
                              <SelectItem value="on_command">La comandă</SelectItem>
                              <SelectItem value="sold">Vândut</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">"Note preț"</label>
                            <Input
                              value={artwork.pricing?.notes || ""}
                              onChange={(event) =>
                                handleArtChange(artwork.id, {
                                  pricing: {
                                    amount: artwork.pricing?.amount || 0,
                                    currency: artwork.pricing?.currency || "EUR",
                                    isAvailable: artwork.pricing?.isAvailable ?? true,
                                    availabilityStatus: artwork.pricing?.availabilityStatus || "available",
                                    notes: event.target.value,
                                  },
                                })
                              }
                              placeholder="ex: Include rama personalizată"
                            />
                          </div>
                        </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Imagine Principală (Hero)</label>
                        <div className="mt-2 overflow-hidden rounded-lg border bg-muted/20">
                          {artwork.heroImage.src ? (
                            <div className="relative aspect-video w-full">
                              <Image 
                                src={artwork.heroImage.src} 
                                alt={artwork.heroImage.alt || artwork.title} 
                                fill 
                                className="object-contain" 
                              />
                            </div>
                          ) : (
                            <div className="aspect-video w-full bg-muted" />
                          )}
                        </div>
                        <Input
                          className="mt-3"
                          value={artwork.heroImage.src}
                          onChange={(event) =>
                            handleArtChange(artwork.id, {
                              heroImage: { ...artwork.heroImage, src: event.target.value },
                            })
                          }
                        />
                        <MediaUploader
                          label="Încarcă imagine"
                          directory={`artworks/${artwork.id}`}
                          onUploaded={(url) =>
                            handleArtChange(artwork.id, {
                              heroImage: { ...artwork.heroImage, src: url },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Alt text</label>
                        <Input
                          value={artwork.heroImage.alt}
                          onChange={(event) =>
                            handleArtChange(artwork.id, {
                              heroImage: { ...artwork.heroImage, alt: event.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <GalleryEditor artwork={artwork} onChange={handleArtChange} />

                    <Separator />

                    <RelatedArtworksEditor artwork={artwork} artworks={artworks} onChange={handleArtChange} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

const GalleryEditor = ({
  artwork,
  onChange,
}: {
  artwork: Artwork;
  onChange: (id: string, patch: Partial<Artwork>) => void;
}) => {
  const handleGalleryField = (galleryId: string, patch: { src?: string; alt?: string; caption?: string; isCover?: boolean }) => {
    onChange(artwork.id, {
      gallery: artwork.gallery.map((image) =>
        image.id === galleryId
          ? {
              ...image,
              asset: {
                ...image.asset,
                src: patch.src ?? image.asset.src,
                alt: patch.alt ?? image.asset.alt,
              },
              caption: patch.caption ?? image.caption,
              isCover: patch.isCover ?? image.isCover,
            }
          : image,
      ),
    });
  };

  const handleAddImage = () => {
    onChange(artwork.id, {
      gallery: [
        ...artwork.gallery,
        {
          id: createId("gallery"),
          asset: {
            id: createId("asset"),
            type: "image",
            src: "/placeholder.jpg",
            alt: artwork.title,
          },
          caption: "",
          isCover: artwork.gallery.length === 0,
        },
      ],
    });
  };

  const handleRemoveImage = (galleryId: string) => {
    onChange(artwork.id, {
      gallery: artwork.gallery.filter((image) => image.id !== galleryId),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Galerie</p>
          <p className="text-xs text-muted-foreground">Ordinea imaginilor determină afișarea în carusel.</p>
        </div>
        <Button type="button" variant="outline" onClick={handleAddImage}>
          Adaugă imagine
        </Button>
      </div>
      {artwork.gallery.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nicio imagine în galerie.</p>
      ) : (
        <div className="space-y-4">
          {artwork.gallery.map((image) => (
            <div key={image.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{image.asset.alt}</p>
                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveImage(image.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="relative h-24 w-full overflow-hidden rounded-md border bg-muted md:w-32">
                  {image.asset.src ? (
                    <Image 
                      src={image.asset.src} 
                      alt={image.asset.alt || artwork.title} 
                      fill 
                      className="object-contain" 
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="grid flex-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sursă</label>
                    <Input value={image.asset.src} onChange={(event) => handleGalleryField(image.id, { src: event.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alt text</label>
                    <Input value={image.asset.alt} onChange={(event) => handleGalleryField(image.id, { alt: event.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Legendă</label>
                    <Input value={image.caption} onChange={(event) => handleGalleryField(image.id, { caption: event.target.value })} />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-muted-foreground">Este cover?</label>
                <Select value={image.isCover ? "true" : "false"} onValueChange={(value) => handleGalleryField(image.id, { isCover: value === "true" })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Da</SelectItem>
                    <SelectItem value="false">Nu</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <MediaUploader
                    label="Încarcă imagine"
                    directory={`artworks/${artwork.id}/gallery`}
                    onUploaded={(url) => handleGalleryField(image.id, { src: url })}
                  />
                  <div className="text-xs text-muted-foreground">Previzualizarea se actualizează automat după încărcare.</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RelatedArtworksEditor = ({
  artwork,
  artworks,
  onChange,
}: {
  artwork: Artwork;
  artworks: Artwork[];
  onChange: (id: string, patch: Partial<Artwork>) => void;
}) => {
  const availableArtworks = artworks.filter((art) => art.id !== artwork.id);
  const selectedArtworks = artwork.related.manualIds || [];

  const handleToggleRelated = (artId: string) => {
    const isSelected = selectedArtworks.includes(artId);
    onChange(artwork.id, {
      related: {
        ...artwork.related,
        manualIds: isSelected
          ? selectedArtworks.filter((id) => id !== artId)
          : [...selectedArtworks, artId],
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">Lucrări Conexe</p>
        <p className="text-xs text-muted-foreground">Selectează lucrări care vor apărea ca recomandări</p>
      </div>
      {availableArtworks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nu există alte lucrări disponibile.</p>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-60 overflow-y-auto p-1">
          {availableArtworks.map((art) => (
            <label
              key={art.id}
              className="flex items-center gap-3 rounded-md border p-2 text-sm cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={selectedArtworks.includes(art.id)}
                onCheckedChange={() => handleToggleRelated(art.id)}
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
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {art.collection} • {art.year}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
