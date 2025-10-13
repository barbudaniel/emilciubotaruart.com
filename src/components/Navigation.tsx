"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import Image from "next/image";

const paintingCategories = [
  { name: "Peisaj", slug: "landscape" },
  { name: "Floreasca", slug: "floreasca" },
  { name: "Natură Statică", slug: "still-life" },
  { name: "Iarnă", slug: "winter" },
  { name: "Animale", slug: "animals" },
  { name: "Marinescu", slug: "marinescu" },
];

const abstractCategories = [
  { name: "Impasto", slug: "impasto" },
  { name: "Artă Fluidă", slug: "fluid-art" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if nav should use light/transparent style (only on homepage when not scrolled)
  const useLightStyle = isHomePage && !isScrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          useLightStyle
            ? "bg-white/10 backdrop-blur-md text-white shadow-sm"
            : "bg-background/95 backdrop-blur-sm shadow-soft text-foreground"
        }`}
      >
        <div
          className="container mx-auto px-4 sm:px-6 lg:px-10 py-4"
          style={{
            paddingLeft: "max(16px, env(safe-area-inset-left))",
            paddingRight: "max(16px, env(safe-area-inset-right))",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Emil Ciubotaru"
                width={110}
                height={110}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm tracking-wider uppercase font-medium transition-colors ${
                  useLightStyle ? "hover:text-white/80" : "hover:text-accent"
                }`}
              >
                Acasă
              </Link>

              <div className="relative group">
                <button
                  className={`text-sm tracking-wider uppercase font-medium transition-colors flex items-center gap-1 ${
                    useLightStyle ? "hover:text-white/80" : "hover:text-accent"
                  }`}
                >
                  Artă Pictură
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50 text-foreground">
                  <Link
                    href="/painting-art"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border"
                  >
                    Vezi Tot
                  </Link>
                  {paintingCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/painting-art?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button
                  className={`text-sm tracking-wider uppercase font-medium transition-colors flex items-center gap-1 ${
                    useLightStyle ? "hover:text-white/80" : "hover:text-accent"
                  }`}
                >
                  Artă Abstractă
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50 text-foreground">
                  <Link
                    href="/abstract-art"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border"
                  >
                    Vezi Tot
                  </Link>
                  {abstractCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/abstract-art?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/exhibitions"
                className={`text-sm tracking-wider uppercase font-medium transition-colors ${
                  useLightStyle ? "hover:text-white/80" : "hover:text-accent"
                }`}
              >
                Expoziții & Activități
              </Link>

              <Link
                href="/about"
                className={`text-sm tracking-wider uppercase font-medium transition-colors ${
                  useLightStyle ? "hover:text-white/80" : "hover:text-accent"
                }`}
              >
                Despre
              </Link>

              <Link
                href="/contact"
                className={`text-sm tracking-wider uppercase font-medium transition-colors ${
                  useLightStyle ? "hover:text-white/80" : "hover:text-accent"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden min-h-[44px] min-w-[44px] ${
                useLightStyle ? "text-white hover:bg-white/20" : ""
              }`}
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
