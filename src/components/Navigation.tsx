"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useCmsData } from "@/providers/cms-data-provider";
import type { NavigationItem, Artwork } from "@/lib/cms";
import { slugify } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

// Helper to check if a subcategory has artworks
const getSubcategoriesWithArtworks = (artworks: Artwork[], parentHref: string) => {
  const isAbstract = parentHref.includes("abstract");
  const filteredArtworks = artworks.filter((art) => {
    const collectionLower = art.collection?.toLowerCase() || "";
    if (isAbstract) {
      return collectionLower.includes("abstract");
    }
    return collectionLower.includes("pictur") || (!collectionLower.includes("abstract") && !art.category?.toLowerCase().includes("abstract"));
  });
  
  const categoriesWithArt = new Set<string>();
  filteredArtworks.forEach((art) => {
    const category = art.category || art.style;
    if (category) {
      categoriesWithArt.add(slugify(category));
    }
  });
  
  return categoriesWithArt;
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const {
    data: {
      siteIdentity: { logo, navigation },
      artLibrary: { artworks },
    },
  } = useCmsData();
  
  // Get categories that have artworks for filtering nav items
  const paintingCategories = useMemo(() => getSubcategoriesWithArtworks(artworks, "/painting-art"), [artworks]);
  const abstractCategories = useMemo(() => getSubcategoriesWithArtworks(artworks, "/abstract-art"), [artworks]);

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
            ? "bg-gradient-to-b from-black/50 via-black/35 to-transparent  text-white"
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
              <Image src={logo.src} alt={logo.alt || "Logo"} width={logo.width ?? 110} height={logo.height ?? 110} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => {
                if (item.children.length > 0) {
                  // Filter children to only show subcategories with artworks
                  const categoriesWithArt = item.href.includes("abstract") ? abstractCategories : paintingCategories;
                  const filteredChildren = item.children.filter((child) => 
                    categoriesWithArt.has(slugify(child.label))
                  );
                  
                  return (
                    <DesktopDropdown 
                      key={item.id} 
                      item={item} 
                      filteredChildren={filteredChildren}
                      useLightStyle={useLightStyle} 
                    />
                  );
                }
                return <DesktopLink key={item.id} item={item} useLightStyle={useLightStyle} />;
              })}
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

      <MobileMenu 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        paintingCategories={paintingCategories}
        abstractCategories={abstractCategories}
      />
    </>
  );
};

const DesktopLink = ({ item, useLightStyle }: { item: NavigationItem; useLightStyle: boolean }) => {
  const baseClass = `text-sm tracking-wider uppercase font-medium transition-colors ${
    useLightStyle ? "hover:text-white/80" : "hover:text-accent"
  } ${item.highlight ? "text-accent" : ""}`;

  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={baseClass}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={baseClass}>
      {item.label}
    </Link>
  );
};

const DesktopDropdown = ({ item, filteredChildren, useLightStyle }: { item: NavigationItem; filteredChildren: NavigationItem[]; useLightStyle: boolean }) => (
  <div className="relative group">
    <button
      className={`text-sm tracking-wider uppercase font-medium transition-colors flex items-center gap-1 ${
        useLightStyle ? "hover:text-white/80" : "hover:text-accent"
      }`}
      aria-haspopup="true"
    >
      {item.label}
      <ChevronDown className="w-4 h-4" />
    </button>
    <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px] z-50 text-foreground">
      <NavDropdownLink item={item} className="border-b border-border">
        Vezi Tot
      </NavDropdownLink>
      {filteredChildren.map((child) => (
        <NavDropdownLink key={child.id} item={child}>
          {child.label}
        </NavDropdownLink>
      ))}
    </div>
  </div>
);

const NavDropdownLink = ({ item, className = "", children }: { item: NavigationItem; className?: string; children: ReactNode }) => {
  const classes = `block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors ${className}`;

  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={item.href} className={classes}>
      {children}
    </Link>
  );
};
