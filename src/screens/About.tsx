"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Palette } from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useCmsData } from "@/providers/cms-data-provider";
import { Card } from "@/components/ui/card";

const About = () => {
  const {
    data: {
      homepage: { about },
      artLibrary: { artworks },
    },
  } = useCmsData();

  // Filter for a few representative artworks to show alongside the story
  const showcaseArtworks = artworks
    .filter((a) => a.heroImage?.src)
    .slice(0, 3);

  const paragraphs = (about.content || "").split(/\n\s*\n/).filter((p) => p.trim());

  // Parallax / Scroll hooks
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const yPortrait = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Navigation />

      {/* Hero / Intro Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 relative z-10"
            >
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary mb-6"
                />
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                  {about.headline || "Emil Ciubotaru"}
                </h1>
                <p className="mt-4 text-xs font-medium tracking-[0.4em] text-muted-foreground uppercase">
                  Artist Vizual • Pictor
                </p>
              </div>

              {about.summary && (
                <div className="relative">
                  <span className="absolute -left-4 -top-4 text-6xl text-primary/10 font-serif">
                    &ldquo;
                  </span>
                  <p className="text-2xl md:text-3xl font-light leading-relaxed text-foreground italic relative z-10">
                    {about.summary}
                  </p>
                </div>
              )}

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed pt-4">
                {paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              <div className="pt-8 flex flex-wrap gap-4">
                <Link href="/painting-art">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base group">
                    <Palette className="mr-2 w-4 h-4" />
                    Vezi Portofoliul
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                    Contact
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Portrait Image (Sticky) */}
            <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-32 hidden lg:block">
              <motion.div style={{ y: yPortrait }} className="relative h-full w-full">
                <div className="absolute top-10 right-10 w-full h-full border-2 border-primary/20 rounded-2xl z-0" />
                <div className="relative h-[90%] w-[90%] rounded-2xl overflow-hidden shadow-2xl z-10 bg-muted">
                  {about.image?.src ? (
                    <Image
                      src={about.image.src}
                      alt={about.image.alt || "Emil Ciubotaru"}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Portrait
                    </div>
                  )}
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>
              </motion.div>
            </div>

            {/* Mobile Portrait (Visible only on small screens) */}
            <div className="lg:hidden mt-8">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl">
                {about.image?.src && (
                  <Image
                    src={about.image.src}
                    alt={about.image.alt || "Emil Ciubotaru"}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground italic">
                În atelier
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrnamentalDivider />

      {/* Selected Works Preview */}
      {showcaseArtworks.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold">Din Atelier</h2>
                <div className="h-1 w-20 bg-primary" />
              </div>
              <Link href="/painting-art" className="text-primary hover:text-primary/80 transition-colors flex items-center group">
                Vezi toată galeria
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {showcaseArtworks.map((art, idx) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                >
                  <Link href={`/art/${art.slug}`}>
                    <Card className="group overflow-hidden border-none shadow-none bg-transparent">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md">
                        <Image
                          src={art.heroImage.src}
                          alt={art.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                      <div className="pt-4">
                        <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                          {art.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {art.collection || art.category} &bull; {art.year}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy / Closing */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-serif italic text-foreground/80 leading-tight">
              "Arta este o călătorie mută a spiritului prin culoare."
            </h2>
            <div className="flex justify-center">
              <Link href="/contact">
                <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all">
                  <Mail className="mr-2 w-5 h-5" />
                  Discută cu Artistul
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
