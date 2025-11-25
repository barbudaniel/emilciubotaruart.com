"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Palette,
  Home,
  User,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  { href: "/admin/artworks", label: "Bibliotecă Artă", icon: Palette },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/exhibitions", label: "Expoziții", icon: Calendar },
  { href: "/admin/about", label: "Despre Artist", icon: User },
  { href: "/admin/settings", label: "Setări & Navigație", icon: Settings },
  { href: "/admin/messages", label: "Mesaje", icon: MessageSquare },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 py-6">
      <div className="px-6">
        <h2 className="text-lg font-semibold tracking-tight">CMS Admin</h2>
        <p className="text-xs text-muted-foreground">Emil Ciubotaru</p>
      </div>
      <div className="flex-1 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-3">
         <Link href="/api/auth/logout" prefetch={false}>
            <Button variant="outline" className="w-full justify-start gap-3" size="sm">
              <LogOut className="h-4 w-4" />
              Deconectare
            </Button>
         </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-muted/40 md:block fixed inset-y-0 left-0 z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center p-4 border-b bg-background">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="ml-2 font-semibold">Panou Administrare</span>
      </div>
    </>
  );
};
