'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [paintingOpen, setPaintingOpen] = useState(false);
  const [abstractOpen, setAbstractOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Close menu when navigating to a new page (but only if menu is open)
  useEffect(() => {
    if (isOpen) {
      onClose();
      setPaintingOpen(false);
      setAbstractOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Meniu de navigare"
        className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-background z-[70] lg:hidden shadow-2xl animate-slide-in-right overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-sm font-medium tracking-wider uppercase">Meniu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Închide meniul"
            className="min-h-[44px] min-w-[44px]"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
            >
              Acasă
            </Link>

            {/* Painting Art with submenu */}
            <div>
              <button
                onClick={() => setPaintingOpen(!paintingOpen)}
                aria-expanded={paintingOpen}
                aria-controls="painting-submenu"
                className="w-full px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors flex items-center justify-between min-h-[44px]"
              >
                <span>Artă Pictură</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${paintingOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {paintingOpen && (
                <div id="painting-submenu" className="ml-4 mt-1 flex flex-col gap-1">
                  <Link
                    href="/painting-art"
                    className="px-4 py-2 text-sm hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
                  >
                    Vezi Tot
                  </Link>
                  {paintingCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/painting-art?category=${cat.slug}`}
                      className="px-4 py-2 text-sm hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Abstract Art with submenu */}
            <div>
              <button
                onClick={() => setAbstractOpen(!abstractOpen)}
                aria-expanded={abstractOpen}
                aria-controls="abstract-submenu"
                className="w-full px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors flex items-center justify-between min-h-[44px]"
              >
                <span>Artă Abstractă</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${abstractOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {abstractOpen && (
                <div id="abstract-submenu" className="ml-4 mt-1 flex flex-col gap-1">
                  <Link
                    href="/abstract-art"
                    className="px-4 py-2 text-sm hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
                  >
                    Vezi Tot
                  </Link>
                  {abstractCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/abstract-art?category=${cat.slug}`}
                      className="px-4 py-2 text-sm hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/exhibitions"
              className="px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
            >
              Expoziții & Activități
            </Link>

            <Link
              href="/about"
              className="px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
            >
              Despre
            </Link>

            <Link
              href="/contact"
              className="px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center"
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};
