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
  { name: 'Peisaj', slug: 'landscape' },
  { name: 'Floreasca', slug: 'floreasca' },
  { name: 'Natură Statică', slug: 'still-life' },
  { name: 'Iarnă', slug: 'winter' },
  { name: 'Animale', slug: 'animals' },
  { name: 'Marinescu', slug: 'marinescu' },
];

// Map URL slugs to category names
const slugToCategoryMap: Record<string, string> = {
  'landscape': 'Peisaj',
  'floreasca': 'Floreasca',
  'still-life': 'Natură Statică',
  'winter': 'Iarnă',
  'animals': 'Animale',
  'marinescu': 'Marinescu',
};

const artworks = [
  { id: 1, title: 'Peisaj Românesc', category: 'Peisaj', slug: 'peisaj-romanesc', year: '2024', medium: 'Ulei pe pânză', size: '100x80cm', image: '/artwork-landscape-1.jpg' },
  { id: 2, title: 'Munții Carpați', category: 'Peisaj', slug: 'muntii-carpati', year: '2023', medium: 'Ulei pe pânză', size: '120x90cm', image: '/artwork-landscape-1.jpg' },
  { id: 3, title: 'Valea Verde', category: 'Peisaj', slug: 'valea-verde', year: '2024', medium: 'Ulei pe pânză', size: '80x100cm', image: '/artwork-landscape-1.jpg' },
  { id: 4, title: 'Grădina Floreasca', category: 'Floreasca', slug: 'gradina-floreasca', year: '2024', medium: 'Ulei pe pânză', size: '90x70cm', image: '/artwork-landscape-1.jpg' },
  { id: 5, title: 'Flori de Primăvară', category: 'Floreasca', slug: 'flori-de-primavara', year: '2023', medium: 'Ulei pe pânză', size: '80x60cm', image: '/artwork-landscape-1.jpg' },
  { id: 6, title: 'Natură Statică cu Fructe', category: 'Natură Statică', slug: 'natura-statica-fructe', year: '2024', medium: 'Ulei pe pânză', size: '60x80cm', image: '/artwork-still-life-1.jpg' },
  { id: 7, title: 'Vase și Flori', category: 'Natură Statică', slug: 'vase-si-flori', year: '2023', medium: 'Ulei pe pânză', size: '70x90cm', image: '/artwork-still-life-1.jpg' },
  { id: 8, title: 'Masă Festivă', category: 'Natură Statică', slug: 'masa-festiva', year: '2024', medium: 'Ulei pe pânză', size: '80x100cm', image: '/artwork-still-life-1.jpg' },
  { id: 9, title: 'Iarnă în Carpați', category: 'Iarnă', slug: 'iarna-in-carpati', year: '2023', medium: 'Ulei pe pânză', size: '100x100cm', image: '/artwork-winter-1.jpg' },
  { id: 10, title: 'Peisaj de Iarnă', category: 'Iarnă', slug: 'peisaj-de-iarna', year: '2024', medium: 'Ulei pe pânză', size: '90x120cm', image: '/artwork-winter-1.jpg' },
  { id: 11, title: 'Zăpadă pe Dealuri', category: 'Iarnă', slug: 'zapada-pe-dealuri', year: '2023', medium: 'Ulei pe pânză', size: '100x80cm', image: '/artwork-winter-1.jpg' },
  { id: 12, title: 'Cal Alb', category: 'Animale', slug: 'cal-alb', year: '2024', medium: 'Ulei pe pânză', size: '100x80cm', image: '/artwork-landscape-1.jpg' },
  { id: 13, title: 'Păsări în Zbor', category: 'Animale', slug: 'pasari-in-zbor', year: '2023', medium: 'Ulei pe pânză', size: '80x100cm', image: '/artwork-landscape-1.jpg' },
  { id: 14, title: 'Marina Românească', category: 'Marinescu', slug: 'marina-romaneasca', year: '2024', medium: 'Ulei pe pânză', size: '120x90cm', image: '/artwork-landscape-1.jpg' },
  { id: 15, title: 'Portul la Apus', category: 'Marinescu', slug: 'portul-la-apus', year: '2023', medium: 'Ulei pe pânză', size: '100x80cm', image: '/artwork-landscape-1.jpg' },
];

const PaintingArt = () => {
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
