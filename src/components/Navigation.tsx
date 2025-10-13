'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './MobileMenu';

const paintingCategories = [
  { name: 'Peisaj', slug: 'landscape' },
  { name: 'Floreasca', slug: 'floreasca' },
  { name: 'Natură Statică', slug: 'still-life' },
  { name: 'Iarnă', slug: 'winter' },
  { name: 'Animale', slug: 'animals' },
  { name: 'Marinescu', slug: 'marinescu' },
];

const abstractCategories = [
  { name: 'Impasto', slug: 'impasto' },
  { name: 'Artă Fluidă', slug: 'fluid-art' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-soft' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-4"
          style={{
            paddingLeft: 'max(16px, env(safe-area-inset-left))',
            paddingRight: 'max(16px, env(safe-area-inset-right))',
          }}
        >
        <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M20 5L25 15H15L20 5Z M20 35L15 25H25L20 35Z M5 20L15 15V25L5 20Z M35 20L25 25V15L35 20Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm tracking-wider uppercase font-medium hover:text-accent transition-colors"
              >
                Acasă
              </Link>

              <div className="relative group">
                <button className="text-sm tracking-wider uppercase font-medium hover:text-accent transition-colors flex items-center gap-1">
                  Artă Pictură
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                  <Link
                    href="/painting-art"
                    className="block px-4 py-3 text-sm hover:bg-secondary transition-colors border-b border-border"
                  >
                    Vezi Tot
                  </Link>
                  {paintingCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/painting-art?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button className="text-sm tracking-wider uppercase font-medium hover:text-accent transition-colors flex items-center gap-1">
                  Artă Abstractă
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                  <Link
                    href="/abstract-art"
                    className="block px-4 py-3 text-sm hover:bg-secondary transition-colors border-b border-border"
                  >
                    Vezi Tot
                  </Link>
                  {abstractCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/abstract-art?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/exhibitions"
                className="text-sm tracking-wider uppercase font-medium hover:text-accent transition-colors"
              >
                Expoziții & Activități
              </Link>

              <Link
                href="/about"
                className="text-sm tracking-wider uppercase font-medium hover:text-accent transition-colors"
              >
                Despre
              </Link>

              <Link
                href="/contact"
                className="text-sm tracking-wider uppercase font-medium hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden min-h-[44px] min-w-[44px]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Deschide meniul"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
