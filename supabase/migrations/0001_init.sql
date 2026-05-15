-- machi-select initial schema
-- Run this in Supabase SQL editor when ready to switch from local JSON store.

create extension if not exists "pgcrypto";

-- users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- regions (region/prefecture/city/area)
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('region','prefecture','city','area')),
  parent_id uuid references public.regions(id) on delete set null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists regions_parent_idx on public.regions(parent_id);

-- categories (main/sub/detail)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  level text not null check (level in ('main','sub','detail')),
  parent_id uuid references public.categories(id) on delete set null,
  description text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug, parent_id)
);
create index if not exists categories_parent_idx on public.categories(parent_id);

-- businesses
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  main_image_url text,
  region_id uuid references public.regions(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  address text,
  phone text,
  business_hours text,
  regular_holiday text,
  price_range text,
  website_url text,
  instagram_url text,
  x_url text,
  line_url text,
  google_map_url text,
  map_embed_url text,
  features text[],
  recommend_points text[],
  services text[],
  menu jsonb,
  status text not null default 'draft' check (status in ('draft','published','pending_review','claimed','archived')),
  is_featured boolean not null default false,
  is_paid boolean not null default false,
  is_claimed boolean not null default false,
  is_premium boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists businesses_region_idx on public.businesses(region_id);
create index if not exists businesses_category_idx on public.businesses(category_id);
create index if not exists businesses_status_idx on public.businesses(status);

-- business_images
create table if not exists public.business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  lead_type text not null check (lead_type in ('free_listing_application','claim_business','correction_request','diagnosis_request','contact')),
  company_name text not null,
  contact_name text,
  contact_role text,
  decision_maker_name text,
  decision_maker_role text,
  email text,
  phone text,
  needs text,
  has_website boolean,
  has_google_business_profile boolean,
  uses_sns boolean,
  has_recruiting_issue boolean,
  interested_services text[] not null default '{}',
  sales_status text not null default 'untouched' check (sales_status in ('untouched','contacted','meeting_scheduled','proposed','won','lost','on_hold')),
  memo text,
  next_action_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads(sales_status);
create index if not exists leads_type_idx on public.leads(lead_type);

-- lead_activities
create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  note text,
  created_at timestamptz not null default now()
);

-- articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  main_image_url text,
  region_id uuid references public.regions(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- business_article_relations
create table if not exists public.business_article_relations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  unique(business_id, article_id)
);

-- inquiries (general contact form)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- settings
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security (lock down by default; admin-only access via service role)
alter table public.users enable row level security;
alter table public.regions enable row level security;
alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.business_images enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.articles enable row level security;
alter table public.business_article_relations enable row level security;
alter table public.inquiries enable row level security;
alter table public.settings enable row level security;

-- Public read: regions, categories, articles (published), businesses (published)
drop policy if exists "public read regions" on public.regions;
create policy "public read regions" on public.regions for select using (true);

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read articles" on public.articles;
create policy "public read articles" on public.articles for select using (status = 'published');

drop policy if exists "public read businesses" on public.businesses;
create policy "public read businesses" on public.businesses for select using (status = 'published');

-- Leads / inquiries: insert only for anon (rate-limit recommended via Supabase Edge Functions)
drop policy if exists "anyone can insert lead" on public.leads;
create policy "anyone can insert lead" on public.leads for insert with check (true);

drop policy if exists "anyone can insert inquiry" on public.inquiries;
create policy "anyone can insert inquiry" on public.inquiries for insert with check (true);

-- No public read on leads / inquiries; admin access via service role only.
