create schema if not exists public;

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('image','video')),
  path text not null,
  alt text default '',
  width int,
  height int,
  focal_point jsonb,
  dominant_color text,
  blur_data_url text,
  credits text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists site_identity (
  id uuid primary key default gen_random_uuid(),
  site_id text unique not null,
  logo_asset_id uuid references media_assets(id),
  logo_lockup_text text default '',
  logo_tagline text default '',
  logo_orientation text default 'horizontal',
  contact_headline text default '',
  contact_subheading text default '',
  map_embed_url text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists navigation_links (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  parent_id uuid references navigation_links(id) on delete cascade,
  label text not null,
  href text not null,
  description text,
  is_external boolean default false,
  highlight boolean default false,
  position int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  platform text not null,
  label text not null,
  url text not null,
  handle text,
  is_visible boolean default true,
  position int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists contact_channels (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  type text not null,
  label text not null,
  value text not null,
  note text,
  position int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists studio_hours (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  label text not null,
  value text not null,
  position int default 0
);

create table if not exists homepage_hero (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  eyebrow text default '',
  title text not null,
  description text default '',
  cta_primary jsonb,
  cta_secondary jsonb,
  background_asset_id uuid references media_assets(id),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists about_blocks (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  title text not null,
  body text not null,
  media_asset_id uuid references media_assets(id),
  position int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  slug text not null unique,
  title text not null,
  summary text default '',
  collection text default '',
  category text default '',
  style text default '',
  status text default 'draft',
  visibility text default 'private',
  year text default '',
  materials text[] default '{}',
  palette text[] default '{}',
  dimension_width numeric,
  dimension_height numeric,
  dimension_depth numeric,
  dimension_unit text default 'cm',
  price_amount numeric,
  price_currency text default 'EUR',
  price_is_available boolean default true,
  price_notes text,
  hero_asset_id uuid references media_assets(id),
  auto_tags text[] default '{}',
  related_mode text default 'auto',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  title text not null,
  description text default '',
  type text not null,
  layout text not null,
  enabled boolean default true,
  manual_content text,
  position int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists homepage_section_artworks (
  section_id uuid references homepage_sections(id) on delete cascade,
  artwork_id uuid references artworks(id) on delete cascade,
  position int default 0,
  primary key (section_id, artwork_id)
);

create table if not exists artwork_gallery (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references artworks(id) on delete cascade,
  asset_id uuid references media_assets(id),
  caption text,
  is_cover boolean default false,
  position int default 0
);

create table if not exists artwork_qr_codes (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references artworks(id) on delete cascade,
  label text not null,
  target_url text not null,
  include_price boolean default false,
  call_to_action text default 'Scanează pentru detalii',
  print_size text default '80mm'
);

create table if not exists artwork_relations (
  artwork_id uuid references artworks(id) on delete cascade,
  related_artwork_id uuid references artworks(id) on delete cascade,
  position int default 0,
  primary key (artwork_id, related_artwork_id)
);

create table if not exists expositions (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  title text not null,
  slug text not null,
  venue text not null,
  location text not null,
  start_date date not null,
  end_date date not null,
  description text,
  status text default 'upcoming',
  hero_asset_id uuid references media_assets(id)
);

create table if not exists exposition_links (
  id uuid primary key default gen_random_uuid(),
  exposition_id uuid references expositions(id) on delete cascade,
  label text not null,
  url text not null,
  position int default 0
);

create table if not exists exposition_artworks (
  exposition_id uuid references expositions(id) on delete cascade,
  artwork_id uuid references artworks(id) on delete cascade,
  position int default 0,
  primary key (exposition_id, artwork_id)
);

create table if not exists cms_snapshots (
  site_id text primary key,
  payload jsonb not null,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create policy "Enable read for all" on cms_snapshots for select using (true);
create policy "Owner writes" on cms_snapshots for all using (auth.role() = 'authenticated');
