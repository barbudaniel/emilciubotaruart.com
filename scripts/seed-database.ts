#!/usr/bin/env tsx

/**
 * Seed Script for Emil Ciubotaru Website
 * 
 * This script seeds the Supabase database with initial CMS data and artwork items.
 * 
 * Usage:
 *   npm run seed
 *   or
 *   npx tsx scripts/seed-database.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_ID = process.env.NEXT_PUBLIC_SUPABASE_SITE_ID || "jirdqjpfmtdwdoqxojok";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   - SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const cmsData = {
  version: "1.0.0",
  siteIdentity: {
    logo: {
      id: "logo-primary",
      type: "image",
      src: "/logo.svg",
      alt: "Monograma Emil Ciubotaru",
      width: 180,
      height: 64,
      lockupText: "Emil Ciubotaru",
      tagline: "Pictură & Artă Abstractă",
      orientation: "horizontal",
    },
    navigation: [
      {
        id: "nav-home",
        label: "Acasă",
        href: "/",
        description: "Pagina principală",
        isExternal: false,
        highlight: false,
        children: [],
      },
      {
        id: "nav-paintings",
        label: "Artă Pictură",
        href: "/painting-art",
        description: "Colecții pictură",
        isExternal: false,
        highlight: false,
        children: [
          { id: "nav-paintings-1", label: "Peisaj", href: "/painting-art?category=peisaj", isExternal: false, highlight: false, children: [] },
          { id: "nav-paintings-2", label: "Florale", href: "/painting-art?category=florale", isExternal: false, highlight: false, children: [] },
          { id: "nav-paintings-3", label: "Statică & Compoziții", href: "/painting-art?category=statica-compozitii", isExternal: false, highlight: false, children: [] },
        ],
      },
      {
        id: "nav-abstract",
        label: "Artă Abstractă",
        href: "/abstract-art",
        description: "Colecții abstracte",
        isExternal: false,
        highlight: false,
        children: [
          { id: "nav-abstract-1", label: "Impasto", href: "/abstract-art?category=impasto", isExternal: false, highlight: false, children: [] },
          { id: "nav-abstract-2", label: "Artă Fluidă", href: "/abstract-art?category=fluid-art", isExternal: false, highlight: false, children: [] },
        ],
      },
      {
        id: "nav-exhibitions",
        label: "Expoziții & Activități",
        href: "/exhibitions",
        description: "",
        isExternal: false,
        highlight: true,
        children: [],
      },
      {
        id: "nav-about",
        label: "Despre",
        href: "/about",
        description: "",
        isExternal: false,
        highlight: false,
        children: [],
      },
      {
        id: "nav-contact",
        label: "Contact",
        href: "/contact",
        description: "",
        isExternal: false,
        highlight: false,
        children: [],
      },
    ],
    socialLinks: [
      {
        id: "social-instagram",
        platform: "Instagram",
        label: "Instagram",
        url: "https://instagram.com/emil.ciubotaru",
        handle: "@emil.ciubotaru",
        isVisible: true,
      },
      {
        id: "social-facebook",
        platform: "Facebook",
        label: "Facebook",
        url: "https://facebook.com/emilciubotaruart",
        handle: "emilciubotaruart",
        isVisible: true,
      },
      {
        id: "social-youtube",
        platform: "YouTube",
        label: "YouTube",
        url: "https://youtube.com/@emilciubotaru",
        handle: "@emilciubotaru",
        isVisible: false,
      },
    ],
    contact: {
      headline: "Contactează atelierul",
      subheading: "Disponibil pentru comenzi, expoziții și colaborări",
      mapEmbedUrl: "https://maps.google.com/?q=Iasi%2C+Romania",
      channels: [
        {
          id: "contact-email",
          type: "email",
          label: "Email",
          value: "atelier@emilciubotaru.com",
          note: "Răspund în 24h",
        },
        {
          id: "contact-phone",
          type: "phone",
          label: "Telefon",
          value: "+40 745 123 456",
          note: "Disponibil 10:00-18:00",
        },
        {
          id: "contact-location",
          type: "location",
          label: "Studio",
          value: "Str. Grigore Vieru 12, Iași",
          note: "Vizite cu programare",
        },
      ],
      studioHours: [
        { id: "hours-1", label: "Luni - Vineri", value: "10:00 - 18:00" },
        { id: "hours-2", label: "Weekend", value: "Doar pe bază de programare" },
      ],
    },
  },
  homepage: {
    hero: {
      id: "hero-main",
      eyebrow: "Bun venit",
      title: "Artist vizual & pictor",
      description: "Explorează lumea culorii și formei prin ochii mei.",
      ctaPrimary: {
        label: "Vezi lucrările",
        href: "/painting-art",
      },
      ctaSecondary: {
        label: "Contactează",
        href: "/contact",
      },
      background: {
        id: "hero-bg",
        type: "image",
        src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/hero-banner.jpg",
        alt: "Background hero",
      },
    },
    about: {
      headline: "Despre Artist",
      summary: "Sunt Emil Ciubotaru, iar culoarea este felul în care respir. Transform emoțiile în povestiri pictate.",
      blocks: [
        {
          id: "about-block-1",
          title: "Viziune Artistică",
          body: "Lucrez cu straturi bogate de culoare și texturi pentru a surprinde emoția momentului.",
          media: {
            id: "about-media-1",
            type: "image",
            src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/portrait.jpg",
            alt: "Artist profile",
          },
        },
        {
          id: "about-block-2",
          title: "Atelierul",
          body: "Un spațiu intim din Iași unde creez și primesc colecționari.",
        },
      ],
    },
    sections: [
      {
        id: "section-featured-art",
        title: "Lucrări selectate",
        description: "O selecție curatorială de piese recente.",
        type: "featured-art",
        layout: "grid",
        enabled: true,
        manualContent: "",
        referenceIds: ["artwork-atrium", "artwork-winter", "artwork-textures"],
      },
      {
        id: "section-cta",
        title: "Comenzi personalizate",
        description: "Scrie-mi pentru piese dedicate sau colaborări vizuale.",
        type: "cta",
        layout: "split",
        enabled: true,
        manualContent: "atelier@emilciubotaru.com",
        referenceIds: [],
      },
      {
        id: "section-exhibitions",
        title: "Expoziții & Activități",
        description: "Călătoria mea în galerii și spații publice.",
        type: "expositions",
        layout: "full",
        enabled: true,
        manualContent: "",
        referenceIds: [],
      },
    ],
  },
  artLibrary: {
    artworks: [
      {
        id: "artwork-atrium",
        slug: "atrium-luminous",
        title: "Atrium Luminous",
        summary: "Peisaj urban luminat de un apus cald.",
        collection: "Peisaj",
        category: "Pictură",
        style: "Realist",
        status: "published",
        visibility: "public",
        year: "2024",
        materials: ["ulei pe pânză"],
        palette: ["#F4A460", "#FFD700", "#4682B4"],
        dimensions: {
          width: 80,
          height: 100,
          unit: "cm",
        },
        pricing: {
          amount: 1500,
          currency: "EUR",
          isAvailable: true,
          notes: "Include rama personalizată",
        },
        heroImage: {
          id: "hero-atrium",
          type: "image",
          src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-landscape-1.jpg",
          alt: "Atrium Luminous",
        },
        gallery: [
          {
            id: "gallery-atrium-1",
            isCover: true,
            caption: "Detaliu textură",
            asset: {
              id: "gallery-media-atrium-1",
              type: "image",
              src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-landscape-1.jpg",
              alt: "Atrium Luminous",
            },
          },
          {
            id: "gallery-atrium-2",
            isCover: false,
            caption: "Straturi aurii",
            asset: {
              id: "gallery-media-atrium-2",
              type: "image",
              src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-still-life-1.jpg",
              alt: "Detaliu Atrium",
            },
          },
        ],
        qrCode: {
          id: "qr-atrium",
          label: "QR Atrium",
          targetUrl: "https://emilciubotaru.com/art/atrium-luminous",
          includePrice: true,
          callToAction: "Scanează pentru detalii",
          printSize: "80mm",
        },
        related: {
          mode: "auto",
          autoTags: ["peisaj", "urban"],
          manualIds: [],
        },
        seo: {
          title: "Atrium Luminous - Emil Ciubotaru",
          description: "Peisaj urban luminat de un apus cald.",
          keywords: ["peisaj", "artă", "pictură"],
        },
      },
      {
        id: "artwork-winter",
        slug: "iarna-carpati",
        title: "Iarnă în Carpați",
        summary: "Peisaj montan sub zăpadă.",
        collection: "Peisaj",
        category: "Pictură",
        style: "Impresionist",
        status: "published",
        visibility: "public",
        year: "2024",
        materials: ["acrilic pe pânză"],
        palette: ["#FFFFFF", "#B0C4DE", "#2F4F4F"],
        dimensions: {
          width: 70,
          height: 90,
          unit: "cm",
        },
        pricing: {
          amount: 1200,
          currency: "EUR",
          isAvailable: true,
          notes: "",
        },
        heroImage: {
          id: "hero-winter",
          type: "image",
          src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-winter-1.jpg",
          alt: "Iarnă în Carpați",
        },
        gallery: [
          {
            id: "gallery-winter-1",
            isCover: true,
            caption: "Vedere completă",
            asset: {
              id: "gallery-media-winter-1",
              type: "image",
              src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-winter-1.jpg",
              alt: "Iarnă în Carpați",
            },
          },
        ],
        qrCode: {
          id: "qr-winter",
          label: "QR Iarnă",
          targetUrl: "https://emilciubotaru.com/art/iarna-carpati",
          includePrice: true,
          callToAction: "Scanează pentru detalii",
          printSize: "80mm",
        },
        related: {
          mode: "auto",
          autoTags: ["peisaj", "iarnă"],
          manualIds: [],
        },
        seo: {
          title: "Iarnă în Carpați - Emil Ciubotaru",
          description: "Peisaj montan sub zăpadă.",
          keywords: ["iarnă", "carpați", "pictură"],
        },
      },
      {
        id: "artwork-textures",
        slug: "texturi-abstracte",
        title: "Texturi Abstracte",
        summary: "Explorare a formei și culorii.",
        collection: "Impasto",
        category: "Artă Abstractă",
        style: "Impasto",
        status: "draft",
        visibility: "private",
        year: "2024",
        materials: ["tehnica mixtă"],
        palette: ["#FF6347", "#4169E1", "#FFD700"],
        dimensions: {
          width: 60,
          height: 80,
          depth: 5,
          unit: "cm",
        },
        pricing: {
          amount: 0,
          currency: "EUR",
          isAvailable: false,
          notes: "Lucru în progres",
        },
        heroImage: {
          id: "hero-textures",
          type: "image",
          src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-fluid-1.jpg",
          alt: "Texturi Abstracte",
        },
        gallery: [
          {
            id: "gallery-textures-1",
            isCover: true,
            caption: "Compoziție principală",
            asset: {
              id: "gallery-media-textures-1",
              type: "image",
              src: "https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/artwork-fluid-1.jpg",
              alt: "Texturi Abstracte",
            },
          },
        ],
        qrCode: {
          id: "qr-textures",
          label: "QR Texturi",
          targetUrl: "https://emilciubotaru.com/art/texturi-abstracte",
          includePrice: false,
          callToAction: "Scanează pentru detalii",
          printSize: "80mm",
        },
        related: {
          mode: "auto",
          autoTags: ["abstract", "texturi"],
          manualIds: [],
        },
        seo: {
          title: "Texturi Abstracte - Emil Ciubotaru",
          description: "Explorare a formei și culorii.",
          keywords: ["abstract", "artă", "texturi"],
        },
      },
    ],
  },
  expositions: [],
};

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  try {
    // 1. Seed CMS data
    console.log("📝 Seeding CMS data...");
    const { error: cmsError } = await supabase
      .from("cms_snapshots")
      .upsert(
        {
          site_id: SITE_ID,
          payload: cmsData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "site_id" }
      );

    if (cmsError) {
      throw new Error(`Failed to seed CMS data: ${cmsError.message}`);
    }
    console.log("✅ CMS data seeded successfully\n");

    // 2. Verify the data
    console.log("🔍 Verifying seeded data...");
    const { data: verification, error: verifyError } = await supabase
      .from("cms_snapshots")
      .select("site_id, created_at, updated_at")
      .eq("site_id", SITE_ID)
      .single();

    if (verifyError) {
      throw new Error(`Failed to verify seeded data: ${verifyError.message}`);
    }

    console.log("✅ Data verified:");
    console.log(`   Site ID: ${verification.site_id}`);
    console.log(`   Created: ${verification.created_at}`);
    console.log(`   Updated: ${verification.updated_at}`);
    console.log("\n📊 Seeded content:");
    console.log(`   - Navigation items: ${cmsData.siteIdentity.navigation.length}`);
    console.log(`   - Social links: ${cmsData.siteIdentity.socialLinks.length}`);
    console.log(`   - Homepage sections: ${cmsData.homepage.sections.length}`);
    console.log(`   - About blocks: ${cmsData.homepage.about.blocks.length}`);
    console.log(`   - Art items: ${cmsData.artLibrary.artworks.length}`);
    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Error seeding database:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

seedDatabase();

