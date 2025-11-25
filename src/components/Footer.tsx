"use client";

import type { ComponentType } from "react";
import { Instagram, Dribbble, Linkedin, Facebook, Twitter, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsData } from "@/providers/cms-data-provider";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  behance: Dribbble,
  dribbble: Dribbble,
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
};

export const Footer = () => {
  const {
    data: {
      siteIdentity: { socialLinks },
    },
  } = useCmsData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleLinks = socialLinks.filter((link) => link.isVisible);

  return (
    <footer className="border-t border-border py-12 mt-20">
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-10"
        style={{
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))',
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6">
            {visibleLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Conectează-te pe social media.</p>
            ) : (
              visibleLinks.map((link) => {
                const Icon = iconMap[link.platform.toLowerCase()] ?? Globe;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })
            )}
          </div>

          <Button onClick={scrollToTop} variant="outline" className="rounded-full px-6">
            CĂTRE ÎNCEPUTUL PAGINII
          </Button>

          <p className="text-sm text-muted-foreground">
            ©{new Date().getFullYear()} Emil Ciubotaru. Toate Drepturile Rezervate
          </p>
        </div>
      </div>
    </footer>
  );
};
