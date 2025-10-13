'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { useFadeUpOnScroll } from '@/hooks/useFadeUpOnScroll';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  useFadeUpOnScroll();

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url('/hero-banner.jpg')",
            filter: 'brightness(0.7)',
            y
          }}
        />
        <div className="relative z-10 text-center text-white px-4 fade-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide">
            EMIL CIUBOTARU
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light tracking-wider">
          PAINTER ARTIST
          </p>
          <Link href="/painting-art">
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black transition-all">
              Explorează Galeria
            </Button>
          </Link>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <img
                src="/portrait.jpg"
                alt="Emil Ciubotaru"
                className="w-full h-auto rounded-lg shadow-soft"
              />
            </div>
            <div className="fade-up">
              <h2 className="text-4xl font-bold mb-6 tracking-wide">Despre Artist</h2>
              <OrnamentalDivider />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <Link href="/about">
                <Button>Află Mai Multe</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl font-bold mb-4 tracking-wide">Lucrări Selectate</h2>
            <OrnamentalDivider />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, title: 'Peisaj Românesc', slug: 'peisaj-romanesc', image: '/artwork-landscape-1.jpg', category: 'Pictură' },
              { id: 2, title: 'Natură Statică', slug: 'natura-statica-fructe', image: '/artwork-still-life-1.jpg', category: 'Pictură' },
              { id: 3, title: 'Iarnă în Carpați', slug: 'iarna-in-carpati', image: '/artwork-winter-1.jpg', category: 'Pictură' },
              { id: 4, title: 'Texturi Abstracte', slug: 'texturi-abstracte', image: '/artwork-impasto-1.jpg', category: 'Abstract' },
              { id: 5, title: 'Artă Fluidă', slug: 'arta-fluida', image: '/artwork-fluid-1.jpg', category: 'Abstract' },
            ].map((artwork, index) => (
              <Link key={artwork.id} href={`/art/${artwork.slug}`}>
                <Card className="overflow-hidden group cursor-pointer fade-up hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">{artwork.category}</p>
                    <h3 className="text-xl font-semibold">{artwork.title}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 fade-up">
            <Link href="/painting-art">
              <Button size="lg">Vezi Toată Galeria</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
