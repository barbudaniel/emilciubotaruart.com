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
  'Toate',
  'Peisaj',
  'Floreasca',
  'Natură Statică',
  'Iarnă',
  'Animale',
  'Marinescu',
];

const artworks = [
  { id: 1, title: 'Peisaj Românesc', category: 'Peisaj', slug: 'peisaj-romanesc', year: '2024', medium: 'Ulei pe pânză', size: '100x80cm', image: '/artwork-landscape-1.jpg' },
  { id: 2, title: 'Munții Carpați', category: 'Peisaj', slug: 'muntii-carpati', year: '2023', medium: 'Ulei pe pânză', size: '120x90cm', image: '/artwork-landscape-1.jpg' },
  { id: 3, title: 'Natură Statică cu Fructe', category: 'Natură Statică', slug: 'natura-statica-fructe', year: '2024', medium: 'Ulei pe pânză', size: '60x80cm', image: '/artwork-still-life-1.jpg' },
  { id: 4, title: 'Vase și Flori', category: 'Natură Statică', slug: 'vase-si-flori', year: '2023', medium: 'Ulei pe pânză', size: '70x90cm', image: '/artwork-still-life-1.jpg' },
  { id: 5, title: 'Iarnă în Carpați', category: 'Iarnă', slug: 'iarna-in-carpati', year: '2023', medium: 'Ulei pe pânză', size: '100x100cm', image: '/artwork-winter-1.jpg' },
  { id: 6, title: 'Peisaj de Iarnă', category: 'Iarnă', slug: 'peisaj-de-iarna', year: '2024', medium: 'Ulei pe pânză', size: '90x120cm', image: '/artwork-winter-1.jpg' },
];

const PaintingArt = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Toate');
  
  useFadeUpOnScroll();

  useEffect(() => {
    if (categoryParam) {
      const formattedCategory = categoryParam
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setSelectedCategory(formattedCategory);
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
              ARTĂ PICTURĂ
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
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Artworks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, index) => (
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

export default PaintingArt;
