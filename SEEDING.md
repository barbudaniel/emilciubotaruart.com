# Database & Storage Seeding Guide

This document explains how to seed your Supabase database and storage with initial data.

## Prerequisites

Ensure you have the following environment variables configured in your `.env` file:

```env
SUPABASE_URL=https://jirdqjpfmtdwdoqxojok.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_SITE_ID=jirdqjpfmtdwdoqxojok
NEXT_PUBLIC_SUPABASE_URL=https://jirdqjpfmtdwdoqxojok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Structure

The CMS uses a single table: `cms_snapshots`

**Table: `cms_snapshots`**
- `site_id` (text, primary key) - Unique identifier for the site
- `payload` (jsonb) - Complete CMS data structure
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

All CMS data (navigation, content, artwork, etc.) is stored in the `payload` JSONB column.

## Storage Structure

**Bucket: `artwork-images`** (public)
- Maximum file size: 10MB
- Allowed types: JPEG, PNG, SVG, WebP
- All uploaded images are publicly accessible

## Quick Start - Full Setup

To set up everything from scratch:

```bash
npm run setup-all
```

This command will:
1. Upload all images from `public/` to Supabase Storage
2. Seed the database with complete CMS data

## Step-by-Step Setup

### 1. Upload Images to Storage

```bash
npm run upload-images
```

This script will:
- Create the `artwork-images` bucket if it doesn't exist
- Upload all images from the `public/` directory
- Display public URLs for each uploaded image

**Images uploaded:**
- `artwork-landscape-1.jpg` - Atrium Luminous main image
- `artwork-winter-1.jpg` - Winter landscape
- `artwork-fluid-1.jpg` - Abstract fluid art
- `artwork-impasto-1.jpg` - Impasto technique piece
- `artwork-still-life-1.jpg` - Still life detail
- `hero-banner.jpg` - Homepage hero background
- `portrait.jpg` - Artist portrait
- `logo.svg` - Site logo

### 2. Seed Database

```bash
npm run seed
```

This script will:
- Create or update CMS snapshot for your site
- Populate with complete structure including:
  - **6 Navigation items** (Home, Painting Art, Abstract Art, Exhibitions, About, Contact)
  - **3 Social links** (Instagram, Facebook, YouTube)
  - **3 Homepage sections** (Featured Art, CTA, Expositions)
  - **2 About blocks** (Artistic Vision, Studio)
  - **3 Artwork items** with full metadata

## Seeded Content Details

### Artwork Items

1. **Atrium Luminous** (Published, €1,500)
   - Urban landscape in oil on canvas
   - Dimensions: 80×100 cm
   - Complete with gallery images, QR code, and SEO metadata

2. **Iarnă în Carpați** (Published, €1,200)
   - Mountain landscape in acrylic
   - Dimensions: 70×90 cm
   - Full metadata and gallery

3. **Texturi Abstracte** (Draft, Work in Progress)
   - Mixed media abstract piece
   - Dimensions: 60×80×5 cm
   - Private visibility, not yet available for sale

### Navigation Structure

- **Acasă** → `/`
- **Artă Pictură** → `/painting-art`
  - Peisaj
  - Florale
  - Statică & Compoziții
- **Artă Abstractă** → `/abstract-art`
  - Impasto
  - Artă Fluidă
- **Expoziții & Activități** → `/exhibitions` (highlighted)
- **Despre** → `/about`
- **Contact** → `/contact`

## Creating Placeholder Images

If you don't have actual artwork images yet, you can create SVG placeholders:

```bash
npm run create-placeholders
```

This will create simple colored rectangles with text labels in the `public/` directory.

## Resetting Data

To reset the CMS to default data:

1. Delete the current snapshot:
   ```sql
   DELETE FROM cms_snapshots WHERE site_id = 'jirdqjpfmtdwdoqxojok';
   ```

2. Re-run the seed script:
   ```bash
   npm run seed
   ```

## Updating Images

To update images:

1. Replace files in the `public/` directory
2. Run the upload script again:
   ```bash
   npm run upload-images
   ```

The script will automatically overwrite existing files in Supabase Storage.

## Admin Access

After seeding, you can log in to the admin panel:

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@admin.com` (from environment variable `ADMIN_EMAIL`)
- **Password**: `admin123@` (from environment variable `ADMIN_PASSWORD`)

## Troubleshooting

### Images Not Loading

1. Verify bucket is public:
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'artwork-images';
   ```

2. Check bucket policies in Supabase Dashboard → Storage → artwork-images → Policies

3. Ensure images were uploaded successfully:
   ```bash
   npm run upload-images
   ```

### Seed Script Fails

1. Check environment variables are set correctly
2. Verify Supabase connection:
   ```bash
   curl https://jirdqjpfmtdwdoqxojok.supabase.co/rest/v1/
   ```

3. Check service role key has necessary permissions

### Schema Validation Errors

The seed data must match the CMS schema. If you modify the schema:

1. Update `scripts/seed-database.ts` accordingly
2. Ensure all required fields are present
3. Re-run the seed script

## Data Structure Reference

All images in the CMS data use full Supabase Storage URLs:

```
https://jirdqjpfmtdwdoqxojok.supabase.co/storage/v1/object/public/artwork-images/{filename}
```

This ensures images are served from Supabase CDN, not from the local Next.js public directory.

## Notes

- All changes made through the admin interface are automatically saved to Supabase
- No localStorage is used - all data persists in Supabase database
- Images are stored in Supabase Storage with public access
- The CMS uses a single JSONB column for flexibility and ease of updates

