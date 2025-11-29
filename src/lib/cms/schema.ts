import { z } from "zod";

export const idSchema = z.string().min(1, "Missing identifier");

export const seoSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().optional(),
});

export const mediaAssetSchema = z.object({
  id: idSchema,
  type: z.enum(["image", "video"]),
  src: z.string().min(1, "Provide a file path or URL"),
  alt: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  focalPoint: z.tuple([z.number(), z.number()]).optional(),
  dominantColor: z.string().optional(),
  blurDataUrl: z.string().optional(),
  credits: z.string().optional(),
});

export const navigationItemSchema = z.lazy(() =>
  z.object({
    id: idSchema,
    label: z.string().min(1, "Set a navigation label"),
    href: z.string().min(1, "Provide a slug or URL"),
    description: z.string().optional(),
    isExternal: z.boolean().default(false),
    highlight: z.boolean().default(false),
    children: z.array(navigationItemSchema).default([]),
  }),
);

export type NavigationItem = z.infer<typeof navigationItemSchema>;
export const logoSchema = mediaAssetSchema.extend({
  lockupText: z.string().default(""),
  tagline: z.string().default(""),
  orientation: z.enum(["horizontal", "stacked"]).default("horizontal"),
});

export const socialLinkSchema = z.object({
  id: idSchema,
  platform: z.string().min(1),
  label: z.string().min(1),
  url: z.string().min(1),
  handle: z.string().optional(),
  isVisible: z.boolean().default(true),
});

export const contactChannelSchema = z.object({
  id: idSchema,
  type: z.enum(["email", "phone", "location", "social", "other"]),
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().optional(),
});

export const contactSchema = z.object({
  headline: z.string().default(""),
  subheading: z.string().default(""),
  channels: z.array(contactChannelSchema),
  studioHours: z.array(
    z.object({
      id: idSchema,
      label: z.string(),
      value: z.string(),
    }),
  ),
  mapEmbedUrl: z.string().optional(),
});

export const heroSchema = z.object({
  id: idSchema,
  eyebrow: z.string().default(""),
  title: z.string().min(1),
  description: z.string().default(""),
  ctaPrimary: z.object({
    label: z.string(),
    href: z.string(),
  }),
  ctaSecondary: z
    .object({
      label: z.string(),
      href: z.string(),
    })
    .optional(),
  background: mediaAssetSchema,
});

export const aboutBlockSchema = z.object({
  id: idSchema,
  title: z.string(),
  body: z.string(),
  media: mediaAssetSchema.optional(),
});

export const aboutSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  content: z.string().default(""),
  image: mediaAssetSchema.optional(),
  blocks: z.array(aboutBlockSchema).default([]),
});

export const homepageSectionSchema = z.object({
  id: idSchema,
  title: z.string(),
  description: z.string().default(""),
  type: z.enum(["featured-art", "statement", "cta", "expositions", "custom"]),
  layout: z.enum(["full", "split", "grid", "carousel"]).default("full"),
  enabled: z.boolean().default(true),
  referenceIds: z.array(z.string()).default([]),
  manualContent: z.string().optional(),
});

export const galleryImageSchema = z.object({
  id: idSchema,
  asset: mediaAssetSchema,
  caption: z.string().default(""),
  isCover: z.boolean().default(false),
});

export const qrCodeSchema = z.object({
  id: idSchema,
  label: z.string(),
  targetUrl: z.string(),
  includePrice: z.boolean().default(false),
  callToAction: z.string().default("Scan pentru detalii"),
  printSize: z.enum(["50mm", "80mm", "100mm"]).default("80mm"),
});

export const relatedArtworksSchema = z.object({
  mode: z.enum(["auto", "manual"]).default("auto"),
  autoTags: z.array(z.string()).default([]),
  manualIds: z.array(z.string()).default([]),
});

export const artworkSchema = z.object({
  id: idSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().default(""),
  collection: z.string().default(""),
  category: z.string().default(""),
  style: z.string().default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  visibility: z.enum(["public", "private"]).default("public"),
  year: z.string().default(""),
  materials: z.array(z.string()).default([]),
  palette: z.array(z.string()).default([]),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number().optional(),
    unit: z.enum(["cm", "in"]).default("cm"),
  }),
  pricing: z
    .object({
      amount: z.number(),
      currency: z.string().default("EUR"),
      isAvailable: z.boolean().default(true),
      availabilityStatus: z.enum(["available", "on_command", "sold"]).default("available"),
      notes: z.string().optional(),
    })
    .optional(),
  heroImage: mediaAssetSchema,
  gallery: z.array(galleryImageSchema),
  qrCode: qrCodeSchema,
  related: relatedArtworksSchema,
  seo: seoSchema,
});

export const expositionSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  venue: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  featuredArtworkIds: z.array(z.string()).default([]),
  heroImage: mediaAssetSchema.optional(),
  links: z
    .array(
      z.object({
        id: idSchema,
        label: z.string(),
        url: z.string(),
      }),
    )
    .default([]),
  status: z.enum(["upcoming", "current", "archived"]).default("upcoming"),
});

export const siteIdentitySchema = z.object({
  logo: logoSchema,
  navigation: z.array(navigationItemSchema),
  socialLinks: z.array(socialLinkSchema),
  contact: contactSchema,
});

export const homepageSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  sections: z.array(homepageSectionSchema),
});

export const artLibrarySchema = z.object({
  artworks: z.array(artworkSchema),
});

export const cmsDataSchema = z.object({
  version: z.string(),
  siteIdentity: siteIdentitySchema,
  homepage: homepageSchema,
  artLibrary: artLibrarySchema,
  expositions: z.array(expositionSchema),
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type Logo = z.infer<typeof logoSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactInfo = z.infer<typeof contactSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type AboutContent = z.infer<typeof aboutSchema>;
export type HomepageSection = z.infer<typeof homepageSectionSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type Artwork = z.infer<typeof artworkSchema>;
export type Exposition = z.infer<typeof expositionSchema>;
export type SiteIdentity = z.infer<typeof siteIdentitySchema>;
export type HomepageContent = z.infer<typeof homepageSchema>;
export type ArtLibrary = z.infer<typeof artLibrarySchema>;
export type CmsData = z.infer<typeof cmsDataSchema>;
