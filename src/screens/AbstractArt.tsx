'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { useFadeUpOnScroll } from '@/hooks/useFadeUpOnScroll';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const categories = [
  { name: 'Toate', slug: 'toate' },
  { name: 'Impasto', slug: 'impasto' },
  { name: 'Artă Fluidă', slug: 'fluid-art' },
];

// Map URL slugs to category names
const slugToCategoryMap: Record<string, string> = {
  'impasto': 'Impasto',
  'fluid-art': 'Artă Fluidă',
};

const artworks = [
  { id: 1, title: 'Golden Textures', category: 'Impasto', slug: 'golden-textures', year: '2024', medium: 'Ulei pe pânză', size: '100x100cm', image: '/artwork-impasto-1.jpg' },
  { id: 2, title: 'Earth Layers', category: 'Impasto', slug: 'earth-layers', year: '2024', medium: 'Ulei pe pânză', size: '90x90cm', image: '/artwork-impasto-1.jpg' },
  { id: 3, title: 'Bronze Waves', category: 'Impasto', slug: 'bronze-waves', year: '2023', medium: 'Ulei pe pânză', size: '80x120cm', image: '/artwork-impasto-1.jpg' },
  { id: 4, title: 'Textured Dreams', category: 'Impasto', slug: 'textured-dreams', year: '2023', medium: 'Ulei pe pânză', size: '120x100cm', image: '/artwork-impasto-1.jpg' },
  { id: 5, title: 'Organic Flow', category: 'Artă Fluidă', slug: 'organic-flow', year: '2023', medium: 'Acrilic pe pânză', size: '80x80cm', image: '/artwork-fluid-1.jpg' },
  { id: 6, title: 'Liquid Gold', category: 'Artă Fluidă', slug: 'liquid-gold', year: '2024', medium: 'Acrilic pe pânză', size: '100x100cm', image: '/artwork-fluid-1.jpg' },
  { id: 7, title: 'Flowing Harmony', category: 'Artă Fluidă', slug: 'flowing-harmony', year: '2023', medium: 'Acrilic pe pânză', size: '90x90cm', image: '/artwork-fluid-1.jpg' },
  { id: 8, title: 'Cosmic Rivers', category: 'Artă Fluidă', slug: 'cosmic-rivers', year: '2024', medium: 'Acrilic pe pânză', size: '100x80cm', image: '/artwork-fluid-1.jpg' },
  { id: 9, title: 'Abstract Waves', category: 'Artă Fluidă', slug: 'abstract-waves', year: '2023', medium: 'Acrilic pe pânză', size: '80x100cm', image: '/artwork-fluid-1.jpg' },
];

const AbstractArt = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  
  useFadeUpOnScroll();

  useEffect(() => {
    if (categoryParam) {
      // Convert URL slug to category name
      const categoryName = slugToCategoryMap[categoryParam];
      if (categoryName) {
        setSelectedCategory(categoryName);
      }
    } else {
      setSelectedCategory('Toate');
    }
  }, [categoryParam]);

  const filteredArtworks = selectedCategory === 'Toate' 
    ? artworks 
    : artworks.filter(art => art.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16 fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
              ARTĂ ABSTRACTĂ
            </h1>
            <OrnamentalDivider />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 fade-up">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
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
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">{artwork.category} • {artwork.year}</p>
                    <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{artwork.medium} • {artwork.size}</p>
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

export default AbstractArt;
