"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCmsData } from "@/providers/cms-data-provider";

const Home = () => {
  useFadeUpOnScroll();
  const { data } = useCmsData();

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const { hero, about, sections } = data.homepage;
  const artworks = data.artLibrary.artworks;
  const expositions = data.expositions ?? [];
  const aboutImageBlock = about.blocks.find((block) => block.media);

  const getArtworksByIds = (ids: string[]) =>
    ids
      .map((id) => artworks.find((art) => art.id === id))
      .filter((art): art is NonNullable<typeof art> => Boolean(art));

  const getExpositionsByIds = (ids: string[]) =>
    ids
      .map((id) => expositions.find((expo) => expo.id === id))
      .filter((expo): expo is NonNullable<typeof expo> => Boolean(expo));

  const renderSection = (section: (typeof sections)[number]) => {
    if (!section.enabled) {
      return null;
    }

    if (section.type === "featured-art") {
      const featuredArtworks = section.referenceIds.length ? getArtworksByIds(section.referenceIds) : artworks.slice(0, 6);
      return (
        <section key={section.id} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-16 fade-up">
              <h2 className="text-4xl font-bold mb-4 tracking-wide">{section.title || "Lucrări selectate"}</h2>
              <OrnamentalDivider />
              <p className="text-muted-foreground max-w-2xl mx-auto">{section.description || "O selecție curatorială din atelier."}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground">Selectează lucrări pentru această secțiune din panoul admin.</p>
              ) : (
                featuredArtworks.map((artwork) => (
                  <Link key={artwork.id} href={`/art/${artwork.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer fade-up hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden relative">
                        <Image
                          src={artwork.heroImage.src}
                          alt={artwork.heroImage.alt || artwork.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">
                          {(artwork.collection || artwork.category || artwork.style || "Lucrare") + " • " + (artwork.year || "—")}
                        </p>
                        <h3 className="text-xl font-semibold">{artwork.title}</h3>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      );
    }

    if (section.type === "cta") {
      return (
        <section key={section.id} className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid gap-8 md:grid-cols-2 items-center rounded-3xl border bg-card/80 p-10 shadow-lg">
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Invitație</p>
                <h2 className="text-3xl font-bold mt-3 mb-4">{section.title}</h2>
                <p className="text-muted-foreground whitespace-pre-line">{section.description || section.manualContent}</p>
              </div>
              <div className="flex flex-col gap-4">
                <Input placeholder="Email" disabled value="atelier@emilciubotaru.com" />
                <Button size="lg" className="w-full">
                  {section.manualContent || "Scrie-mi un mesaj"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (section.type === "expositions") {
      const selectedExpositions = section.referenceIds.length ? getExpositionsByIds(section.referenceIds) : expositions;
      return (
        <section key={section.id} className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
            <div className="text-center fade-up">
              <h2 className="text-4xl font-bold mb-4">{section.title || "Expoziții"}</h2>
              <OrnamentalDivider />
              <p className="text-muted-foreground max-w-2xl mx-auto">{section.description}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {selectedExpositions.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground">Adaugă expoziții în CMS și selectează-le în această secțiune.</p>
              ) : (
                selectedExpositions.map((expo) => (
                  <Card key={expo.id} className="p-6 space-y-3">
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">{expo.status}</p>
                    <h3 className="text-2xl font-semibold">{expo.title}</h3>
                    <p className="text-muted-foreground">
                      {expo.venue} • {expo.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {expo.startDate} – {expo.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{expo.description}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section key={section.id} className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-4xl text-center space-y-4">
          <h2 className="text-3xl font-bold">{section.title}</h2>
          <OrnamentalDivider />
          <p className="text-muted-foreground whitespace-pre-line">{section.description || section.manualContent}</p>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url('${hero.background.src}')`,
            filter: "brightness(0.7)",
            y,
          }}
        />
        <div className="relative z-10 text-center px-4 fade-up flex items-center justify-center">
          <div className="aspect-video flex flex-col items-center justify-center backdrop-blur-sm isolate rounded-xl bg-white/70 shadow-lg ring-1 ring-black/5 p-10">
            <p className="text-xl md:text-2xl lg:text-xl mb-8 font-medium " style={{ color: "#000" }}>
              {hero.eyebrow}
            </p>
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none font-heading"
              style={{
                backgroundImage: `url('${hero.background.src}')`,
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                filter: "brightness(0.7)",
                backgroundPositionY: y,
              }}
            >
              {hero.title}
            </motion.h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{hero.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={hero.ctaPrimary.href}>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 transition-all px-8">
                  {hero.ctaPrimary.label}
                </Button>
              </Link>
              {hero.ctaSecondary ? (
                <Link href={hero.ctaSecondary.href}>
                  <Button size="lg" variant="outline">
                    {hero.ctaSecondary.label}
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      {/* <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-up relative aspect-[3/4]">
              {aboutImageBlock?.media ? (
                <Image src={aboutImageBlock.media.src} alt={aboutImageBlock.media.alt || aboutImageBlock.title} fill className="rounded-lg shadow-soft object-cover" />
              ) : (
                <div className="h-full w-full rounded-lg bg-muted" />
              )}
            </div>
            <div className="fade-up">
              <h2 className="text-4xl font-bold mb-6 tracking-wide">{about.headline}</h2>
              <OrnamentalDivider />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{about.summary}</p>
              <Link href="/about">
                <Button>Află Mai Multe</Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {sections.map(renderSection)}

      <Footer />
    </div>
  );
};

export default Home;
