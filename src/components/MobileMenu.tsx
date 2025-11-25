"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCmsData } from "@/providers/cms-data-provider";
import type { NavigationItem } from "@/lib/cms";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const {
    data: {
      siteIdentity: { navigation },
    },
  } = useCmsData();

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
      setOpenItems({});
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
            {navigation.map((item) =>
              item.children.length ? (
                <MobileDropdown
                  key={item.id}
                  item={item}
                  isOpen={Boolean(openItems[item.id])}
                  onToggle={() =>
                    setOpenItems((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                />
              ) : (
                <MobileNavLink key={item.id} item={item} />
              ),
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

const MobileNavLink = ({ item, className = "" }: { item: NavigationItem; className?: string }) => {
  const classes = `px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors min-h-[44px] flex items-center ${item.highlight ? "text-accent" : ""} ${className}`;

  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={classes}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={classes}>
      {item.label}
    </Link>
  );
};

const MobileDropdown = ({
  item,
  isOpen,
  onToggle,
}: {
  item: NavigationItem;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div>
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`${item.id}-submenu`}
      className="w-full px-4 py-3 text-sm tracking-wider uppercase font-medium hover:bg-secondary rounded-md transition-colors flex items-center justify-between min-h-[44px]"
    >
      <span>{item.label}</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div id={`${item.id}-submenu`} className="ml-4 mt-1 flex flex-col gap-1">
        <MobileNavLink item={item} className="px-4 py-2 text-sm" />
        {item.children.map((child) => (
          <MobileNavLink key={child.id} item={child} className="px-4 py-2 text-sm" />
        ))}
      </div>
    )}
  </div>
);
