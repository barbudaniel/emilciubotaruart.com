"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCmsData } from "@/providers/cms-data-provider";
import { slugify } from "@/lib/utils";
import type { Artwork } from "@/lib/cms";

const PaintingArt = () => {
  const {
    data: {
      artLibrary: { artworks },
    },
  } = useCmsData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams?.get("category");
  const [selectedCategory, setSelectedCategory] = useState("toate");

  useFadeUpOnScroll();

  const paintingArtworks = useMemo(
    () =>
      artworks.filter((art) => !art.category.toLowerCase().includes("abstract")),
    [artworks],
  );

  const categoryFilters = useMemo(() => {
    const map = new Map<string, string>();
    paintingArtworks.forEach((art) => {
      const label = art.collection || art.category || art.style || "Colecție";
      map.set(slugify(label), label);
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [paintingArtworks]);

  useEffect(() => {
    if (categoryParam && categoryFilters.some((filter) => filter.slug === categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("toate");
    }
  }, [categoryParam, categoryFilters]);

  const filteredArtworks =
    selectedCategory === "toate"
      ? paintingArtworks
      : paintingArtworks.filter((art) => slugify(art.collection || art.style || "") === selectedCategory);

  const handleCategoryChange = useCallback(
    (slug: string) => {
      setSelectedCategory(slug);
      const params = new URLSearchParams(searchParams?.toString());
      if (slug === "toate") {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16 fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
              ARTĂ PICTURĂ
            </h1>
            <OrnamentalDivider />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Florile care nu se mai ofilesc, orașele scăldate în lumină și anotimpurile care trec prin mine
              devin serii figurative pictate în straturi dense, cu tușe când blânde, când neastâmpărate.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 fade-up">
            {[{ slug: "toate", name: "Toate" }, ...categoryFilters].map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Artworks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
              <Link key={artwork.id} href={`/art/${artwork.slug}`}>
                <Card className="overflow-hidden group cursor-pointer fade-up hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={artwork.heroImage.src}
                      alt={artwork.heroImage.alt || artwork.title}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      {(artwork.collection || artwork.category) + " • " + (artwork.year || "—")}
                    </p>
                    <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {artwork.materials.join(", ") || "Mix media"} • {formatDimensions(artwork)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="text-center py-20 fade-up">
              <p className="text-xl text-muted-foreground">
                Nu există lucrări în această categorie momentan.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaintingArt;

function formatDimensions(artwork: Artwork) {
  const { width, height, unit } = artwork.dimensions;
  return `${width}x${height}${unit}`;
}
