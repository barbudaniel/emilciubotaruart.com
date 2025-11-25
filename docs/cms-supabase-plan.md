# Supabase Schema Plan

This schema mirrors the structures defined in `cmsDataSchema`. Every table includes `id (uuid)`, `created_at`, `updated_at`, and `owner_user_id` (nullable now, future use for Auth). Ordering-sensitive entities (navigation, sections, gallery) include a `position` column used for drag-and-drop.

## Core Tables

### `site_identity`
Single row containing:
- `logo_asset_id uuid` → references `media_assets`
- `logo_lockup_text text`
- `logo_tagline text`
- `logo_orientation text`
- `contact_headline text`
- `contact_subheading text`
- `map_embed_url text`

### `media_assets`
Stores uploaded files metadata (Supabase Storage bucket `media` holds the actual file).
- `id uuid`
- `type text` (`image` | `video`)
- `path text` (storage path or external URL)
- `alt text`
- `width int`, `height int`
- `focal_point jsonb`
- `dominant_color text`
- `blur_data_url text`
- `credits text`

### `navigation_links`
Adjacency-list navigation tree.
- `id uuid`
- `parent_id uuid nullable`
- `label text`
- `href text`
- `description text`
- `is_external boolean`
- `highlight boolean`
- `position int`

### `social_links`
- `id uuid`
- `platform text`
- `label text`
- `url text`
- `handle text`
- `is_visible boolean`
- `position int`

### `contact_channels`
- `id uuid`
- `type text` (`email`, `phone`, `location`, etc.)
- `label text`
- `value text`
- `note text`
- `position int`

### `studio_hours`
- `id uuid`
- `label text`
- `value text`
- `position int`

## Homepage Content

### `homepage_hero`
Single row referencing hero background asset.
- `id uuid`
- `eyebrow text`
- `title text`
- `description text`
- `cta_primary_label text`
- `cta_primary_href text`
- `cta_secondary_label text`
- `cta_secondary_href text`
- `background_asset_id uuid refs media_assets`

### `about_blocks`
- `id uuid`
- `title text`
- `body text`
- `media_asset_id uuid nullable`
- `position int`

### `homepage_sections`
- `id uuid`
- `title text`
- `description text`
- `type text`
- `layout text`
- `enabled boolean`
- `manual_content text`
- `position int`

### `homepage_section_artworks`
Join between sections and artworks for curated references.
- `section_id uuid refs homepage_sections`
- `artwork_id uuid refs artworks`
- `position int`
- Composite primary key `(section_id, artwork_id)`

## Art Library

### `artworks`
- `id uuid`
- `slug text unique`
- `title text`
- `summary text`
- `collection text`
- `category text`
- `style text`
- `status text` (`draft`, `published`, `archived`)
- `visibility text` (`public`, `private`)
- `year text`
- `materials text[]`
- `palette text[]`
- `dimension_width numeric`
- `dimension_height numeric`
- `dimension_depth numeric`
- `dimension_unit text`
- `price_amount numeric`
- `price_currency text`
- `price_is_available boolean`
- `price_notes text`
- `hero_asset_id uuid refs media_assets`

### `artwork_gallery`
- `id uuid`
- `artwork_id uuid refs artworks`
- `asset_id uuid refs media_assets`
- `caption text`
- `is_cover boolean`
- `position int`

### `artwork_qr_codes`
- `id uuid`
- `artwork_id uuid refs artworks`
- `label text`
- `target_url text`
- `include_price boolean`
- `call_to_action text`
- `print_size text`

### `artwork_relations`
Supports manual relationships.
- `artwork_id uuid refs artworks`
- `related_artwork_id uuid refs artworks`
- `position int`
- Primary key `(artwork_id, related_artwork_id)`
- Additional columns: `mode text`, `auto_tags text[]` stored on `artworks`

### `artwork_seo`
Optional extension table or JSON column on `artworks` (e.g., `seo jsonb { title, description, keywords, canonical_url }`).

## Expositions & Activities

### `expositions`
- `id uuid`
- `title text`
- `slug text`
- `venue text`
- `location text`
- `start_date date`
- `end_date date`
- `description text`
- `status text` (`upcoming`, `current`, `archived`)
- `hero_asset_id uuid refs media_assets`

### `exposition_links`
- `id uuid`
- `exposition_id uuid refs expositions`
- `label text`
- `url text`
- `position int`

### `exposition_artworks`
- `exposition_id uuid refs expositions`
- `artwork_id uuid refs artworks`
- `position int`
- Composite key `(exposition_id, artwork_id)`

## Auth & Access
- Supabase Auth handles email/password for admin users.
- All tables include `owner_user_id` + RLS policies limiting write access to authenticated admins.
- For future multi-user support, add `site_id` to scope data per project.

## Storage Buckets
- `media` bucket for all uploaded images/videos with public read, authenticated write.
- Files referenced via `media_assets.path`.

## Migration Notes
- Write a migrator that exports `cmsDataSchema` JSON → batch `insert/update` into Supabase using RPC or edge functions.
- Create database views (`public_navigation`, `public_homepage`) to serve flattened data to the public site.
