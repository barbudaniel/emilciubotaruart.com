"use client";

import Image from "next/image";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { useCmsData } from "@/providers/cms-data-provider";

const About = () => {
  useFadeUpOnScroll();
  const {
    data: {
      homepage: { about },
    },
  } = useCmsData();

  // Split by double newline to create paragraphs, but preserve single newlines if desired or just let css handle it.
  // Using whitespace-pre-line on the paragraph element is the simplest way to respect the textarea content.
  // However, for better spacing between distinct blocks of text, we can split by double newlines.
  const paragraphs = (about.content || "").split(/\n\s*\n/).filter(p => p.trim());

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          <section className="grid gap-12 lg:grid-cols-[3fr_2fr] items-start fade-up">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-wide">
                {about.headline || "About Emil Ciubotaru"}
              </h1>
              <OrnamentalDivider />
              
              {about.summary && (
                <p className="text-xl font-medium text-foreground">
                  {about.summary}
                </p>
              )}

              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border bg-muted">
                {about.image?.src ? (
                  <Image 
                    src={about.image.src} 
                    alt={about.image.alt || about.headline || "Artist Portrait"} 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Fără imagine profil</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
