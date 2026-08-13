-- ============================================================================
-- Mallanna Farms — Supabase schema, storage and Row Level Security policies
--
-- How to use:
--   1. Create a Supabase project at https://supabase.com
--   2. Open the SQL Editor and run this entire file.
--   3. Go to Authentication → Users → Add User to create your first admin
--      login (email + password), then run the INSERT at the bottom of this
--      file (with that user's UUID) to grant them admin access.
--   4. Copy your Project URL and anon public key into .env (see .env.example).
-- ============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null check (file_type in ('image', 'video')),
  mime_type text not null,
  file_size bigint not null default 0,
  title text,
  caption text,
  alt_text text,
  description text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10, 2) not null default 0,
  discount_price numeric(10, 2),
  pack_size text,
  egg_count integer,
  grade text,
  sku text,
  barcode text,
  category text default 'Free Range Eggs',
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock', 'low_stock', 'out_of_stock', 'preorder')),
  features text[],
  nutrition jsonb,
  feed_info text,
  main_image_url text,
  video_url text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  media_id uuid not null references media (id) on delete cascade,
  sort_order integer not null default 0
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references media (id) on delete cascade,
  title text,
  description text,
  category text not null default 'Our Farm',
  sort_order integer not null default 0,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  category text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  hero_image text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'responded', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists site_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz not null default now()
);

-- Orders are "order enquiries", not paid transactions: no payment gateway is
-- wired up (see README). A customer submits a cart + delivery details here,
-- the admin sees it in /admin/orders, and confirms payment/delivery by
-- phone or WhatsApp. `items` stores a denormalized snapshot of each line
-- (product name/price/qty at order time) so later product edits don't
-- rewrite historical orders.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text,
  pincode text,
  notes text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null default 0,
  status text not null default 'new' check (status in ('new', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_products_active on products (active);
create index if not exists idx_products_featured on products (featured);
create index if not exists idx_products_slug on products (slug);
create index if not exists idx_gallery_active_category on gallery (active, category);
create index if not exists idx_media_category on media (category);
create index if not exists idx_contact_messages_status on contact_messages (status);
create index if not exists idx_orders_status on orders (status);
create index if not exists idx_orders_created_at on orders (created_at desc);

-- ----------------------------------------------------------------------------
-- Helper: is the current authenticated user an admin?
-- ----------------------------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from admins where id = auth.uid());
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table admins enable row level security;
alter table media enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table gallery enable row level security;
alter table videos enable row level security;
alter table pages enable row level security;
alter table faqs enable row level security;
alter table contact_messages enable row level security;
alter table settings enable row level security;
alter table site_visits enable row level security;
alter table orders enable row level security;

-- admins: only admins can read the admin list; no public access
create policy "Admins can view admin list" on admins for select using (is_admin());
create policy "Admins can manage admin list" on admins for all using (is_admin()) with check (is_admin());

-- media: public can read; only admins can write
create policy "Public can view media" on media for select using (true);
create policy "Admins can manage media" on media for all using (is_admin()) with check (is_admin());

-- products: public can read active products; admins can read/write everything
create policy "Public can view active products" on products for select using (active = true or is_admin());
create policy "Admins can manage products" on products for insert with check (is_admin());
create policy "Admins can update products" on products for update using (is_admin()) with check (is_admin());
create policy "Admins can delete products" on products for delete using (is_admin());

create policy "Public can view product images" on product_images for select using (true);
create policy "Admins can manage product images" on product_images for all using (is_admin()) with check (is_admin());

create policy "Public can view active gallery" on gallery for select using (active = true or is_admin());
create policy "Admins can manage gallery" on gallery for insert with check (is_admin());
create policy "Admins can update gallery" on gallery for update using (is_admin()) with check (is_admin());
create policy "Admins can delete gallery" on gallery for delete using (is_admin());

create policy "Public can view active videos" on videos for select using (active = true or is_admin());
create policy "Admins can manage videos" on videos for insert with check (is_admin());
create policy "Admins can update videos" on videos for update using (is_admin()) with check (is_admin());
create policy "Admins can delete videos" on videos for delete using (is_admin());

create policy "Public can view active pages" on pages for select using (active = true or is_admin());
create policy "Admins can manage pages" on pages for all using (is_admin()) with check (is_admin());

create policy "Public can view active faqs" on faqs for select using (active = true or is_admin());
create policy "Admins can manage faqs" on faqs for insert with check (is_admin());
create policy "Admins can update faqs" on faqs for update using (is_admin()) with check (is_admin());
create policy "Admins can delete faqs" on faqs for delete using (is_admin());

-- contact_messages: anyone can submit (insert-only); only admins can read/manage
create policy "Public can submit enquiries" on contact_messages for insert with check (true);
create policy "Admins can view enquiries" on contact_messages for select using (is_admin());
create policy "Admins can update enquiries" on contact_messages for update using (is_admin()) with check (is_admin());
create policy "Admins can delete enquiries" on contact_messages for delete using (is_admin());

-- settings: public can read; only admins can write
create policy "Public can view settings" on settings for select using (true);
create policy "Admins can manage settings" on settings for all using (is_admin()) with check (is_admin());

-- site_visits: anyone can insert a page-view row; only admins can read
create policy "Public can log visits" on site_visits for insert with check (true);
create policy "Admins can view visits" on site_visits for select using (is_admin());

-- orders: anyone can place an order (insert-only); only admins can read/manage
create policy "Public can place orders" on orders for insert with check (true);
create policy "Admins can view orders" on orders for select using (is_admin());
create policy "Admins can update orders" on orders for update using (is_admin()) with check (is_admin());
create policy "Admins can delete orders" on orders for delete using (is_admin());

-- ----------------------------------------------------------------------------
-- Storage: public "media" bucket for images & videos
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 104857600, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'])
on conflict (id) do nothing;

create policy "Public can view media files" on storage.objects for select using (bucket_id = 'media');
create policy "Admins can upload media files" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
create policy "Admins can update media files" on storage.objects for update using (bucket_id = 'media' and is_admin());
create policy "Admins can delete media files" on storage.objects for delete using (bucket_id = 'media' and is_admin());

-- ----------------------------------------------------------------------------
-- Seed default settings (safe to re-run)
-- ----------------------------------------------------------------------------
insert into settings (key, value) values
  ('site_name', 'Mallanna Farms'),
  ('tagline_primary', 'Naturally Raised. Freshly Delivered. Made for Healthy Families.'),
  ('tagline_secondary', 'From our farm, with care — naturally nourishing every family.'),
  ('hero_heading', 'Mallanna Farms'),
  ('hero_subheading', 'Free Range Eggs'),
  ('hero_tagline', 'Naturally Raised. Freshly Delivered. Made for Healthy Families.'),
  ('hero_cta_primary_label', 'Explore Our Eggs'),
  ('hero_cta_primary_link', '/products'),
  ('hero_cta_secondary_label', 'Visit Our Farm'),
  ('hero_cta_secondary_link', '/our-farm'),
  ('about_content', 'Mallanna Farms is committed to providing families with fresh, nutritious and naturally produced free-range eggs while caring for our hens and the environment.'),
  ('mission_title', 'Our Mission'),
  ('mission_content', 'At Mallanna Farms, our mission is to provide families with fresh, nutritious, and naturally produced free-range eggs while caring for our hens and the environment.

We believe that healthy food begins with healthy farming. Our hens are raised in a natural, open environment with space to move freely, supported by responsible farming practices and quality nutrition.

We are committed to delivering eggs that our customers can trust—fresh from our farm, rich in nutrition, and produced with care.'),
  ('vision_title', 'Our Vision'),
  ('vision_content', 'At Mallanna Farms, our vision is to become a trusted name in natural and sustainable poultry farming by bringing healthy, nutritious, and high-quality free-range eggs from our farm to every family.

We believe that healthier food begins with healthier birds, natural surroundings, and responsible farming practices. Our goal is to provide eggs produced with care, while giving our hens a comfortable, natural environment to grow and thrive.

We aspire to build a future where quality, nutrition, animal well-being, and sustainability come together—supporting healthier families, stronger communities, and a greener planet.'),
  ('vision_statement', 'From our farm, with care — naturally nourishing every family.'),
  ('contact_address', 'Sy. No. 174/2/2, Thallasingaram Village, Choutuppal Municipality, Yadadri Bhuvanagiri District, Telangana – 508252'),
  ('contact_phone', '+91 90000 00000'),
  ('contact_email', 'hello@mallannafarms.com'),
  ('footer_tagline', 'Naturally Raised. Freshly Delivered. Made for Healthy Families.')
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- Grant yourself admin access (run manually after creating your auth user):
--
--   insert into admins (id, email, role)
--   values ('PASTE-YOUR-AUTH-USER-UUID-HERE', 'you@example.com', 'owner');
--
-- Find the UUID in Supabase Dashboard → Authentication → Users.
-- ----------------------------------------------------------------------------
