"use client";

import Image from "next/image";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { useCmsData } from "@/providers/cms-data-provider";

const biography = `Hei, bună,

Sunt Emil Ciubotaru, un artist, iar pentru mine culoarea este felul în care
respir. Îmi scriu gândurile în culori pe pânză, cu tușe dense, uneori blânde, alteori
neastâmpărate, ca și cum fiecare lucrare ar fi o mărturisire pe care n-am spus-o
niciodată cu voce tare.

Pictez florile care nu mor niciodată, anotimpurile care trec prin mine mai des
decât prin calendar și orașele în care lumina se prelinge pe clădiri ca o amintire
caldă. Uneori, las realitatea să vorbească. Alteori, o răsucesc, o tulbur, o
transform în abstracții care poartă urme de suflet și tăceri colorate.

Pensula și cuțitul de paletă sunt prelungirea mâinii mele. În urma lor rămân
straturi groase, reliefuri, vibrații, urme ale felului în care simt lumea. Fiecare
culoare pe care o așez este o poveste scurtă, iar fiecare lucrare este o întâmplare
trăită cândva, poate de mine, poate de tine.

Pictura este felul meu de a pune ordine în emoții și de a da formă lucrurilor
care nu se lasă rostite.

Dacă un tablou de-al meu te face să te oprești o clipă, să respiri altfel sau
să-ți amintești ceva ce credeai că ai pierdut, atunci arta mea și-a găsit drumul ei.`;

const About = () => {
  useFadeUpOnScroll();
  const {
    data: {
      homepage: { about },
    },
  } = useCmsData();

  const heroBlock = about.blocks.find((block) => block.media);
  const paragraphs = biography.split("\n").reduce<string[]>((acc, line) => {
    const value = line.trim();
    if (!value) {
      acc.push("");
      return acc;
    }
    const lastIndex = acc.length - 1;
    if (lastIndex >= 0 && acc[lastIndex]) {
      acc[lastIndex] = `${acc[lastIndex]} ${value}`.trim();
    } else {
      acc.push(value);
    }
    return acc;
  }, []).filter(Boolean);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          <section className="grid gap-12 lg:grid-cols-[3fr_2fr] items-start fade-up">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-wide">Despre Emil Ciubotaru</h1>
              <OrnamentalDivider />
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border bg-muted">
                {heroBlock?.media ? (
                  <Image src={heroBlock.media.src} alt={heroBlock.media.alt || heroBlock.title} fill className="object-cover" />
                ) : null}
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
