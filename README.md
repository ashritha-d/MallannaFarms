# Mallanna Farms — Website & Admin Dashboard

Official website and admin dashboard for **Mallanna Farms**, a natural free-range egg farming brand.

> **Naturally Raised. Freshly Delivered. Made for Healthy Families.**

Built with React + Vite + TypeScript + Tailwind CSS, backed by Supabase (Postgres, Auth, Storage).

---

## What's in this repo

- **Public website** — Home, About, Mission, Vision, Our Farm, Products, Product Details, Gallery, Videos, Why Choose Us, Contact, FAQ, Privacy Policy, Terms & Conditions.
- **Admin dashboard** (`/admin`) — secure, authenticated CMS for products, media, gallery, videos, homepage/page content, FAQs, contact enquiries, settings and social links.
- **Data layer** — every public page reads from Supabase; if Supabase isn't connected yet, the site falls back to curated local content (using the real uploaded farm photography) so it's never blank, and the admin UI clearly flags when it's running without a live backend.

## Current status

⚠️ **No Supabase project is connected yet.** The frontend, database schema, and admin dashboard are fully built, but you need to create a Supabase project and connect it (steps below) before:
- the admin login works,
- products/gallery/videos/content can be edited,
- the contact form can store enquiries.

Until then, the public site displays real farm photography and placeholder text so it's presentable, and admin screens show a clear "Supabase is not connected" banner instead of pretending to save data.

---

## 1. Prerequisites

- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) account

## 2. Install dependencies

```bash
npm install
```

## 3. Connect Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your Supabase project and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql). This creates all tables, Row Level Security policies, and a public `media` storage bucket.
3. Go to **Authentication → Users → Add User** and create your first admin login (email + password).
4. Copy that user's UUID (shown in the Users table) and run this in the SQL Editor, replacing the placeholders:
   ```sql
   insert into admins (id, email, role)
   values ('PASTE-USER-UUID-HERE', 'you@example.com', 'owner');
   ```
5. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.
6. Copy `.env.example` to `.env` and paste them in:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
7. Restart the dev server. The public site now reads live data, and `/admin/login` works with the credentials you created in step 3.

**Never** put your Supabase `service_role` key anywhere in this project — only the `anon` key belongs in `.env`, and RLS policies (already defined in `schema.sql`) keep writes restricted to authenticated admins.

## 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`. Admin dashboard: `http://localhost:5173/admin`.

## 5. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Project structure

```
src/
  admin/            # Admin dashboard: auth, layout, CRUD pages, data-access layer
  components/        # Shared UI (layout, cards, image, lightbox, SEO, empty/error states)
  data/               # seed.ts (local fallback content) + content.ts (public data service)
  hooks/              # useSettings (cached site settings)
  lib/                # Supabase client + generated-style database types
  pages/              # Public website pages
  App.tsx, main.tsx, routes.ts
public/
  assets/farm/        # Uploaded farm photography
  assets/logo/         # Official Mallanna Farms logo (logoF.jpeg) — used as-is, unmodified
  robots.txt, sitemap.xml
supabase/
  schema.sql          # Full database schema, RLS policies, storage bucket, seed settings
```

## Design system

Deep forest green, earthy brown, soft gold and warm cream — defined as Tailwind tokens in `tailwind.config.js` (`forest`, `earth`, `gold`, `cream`). Display type is **Fraunces**, body type is **Inter**. The official logo (`logoF.jpeg`) is used unmodified throughout — navbar, footer, favicon — and is never redrawn or altered.

## Notes on the sitemap

`public/sitemap.xml` lists the static pages. Individual product URLs (`/products/:slug`) are database-driven and not included since this is a static file — for full SEO coverage in production, generate the sitemap server-side (e.g. a small Supabase Edge Function or build-time script that queries `products` and appends `<url>` entries) once your catalog is live.

## Capacitor / Android WebView

The site uses relative units, touch-friendly tap targets, safe-area padding (`env(safe-area-inset-*)`), and avoids hover-only interactions, so it's ready to drop into a Capacitor WebView shell. No Capacitor project exists yet in this repo — run `npx cap init` and `npx cap add android` when you're ready to wrap it.

## Git & GitHub

This repo is initialized locally. To push it to GitHub:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

`.env` is git-ignored — never commit real credentials. Share `.env.example` instead.

## Deploying

Any static host that serves a Vite SPA works (Vercel, Netlify, Cloudflare Pages, etc.). Set the two `VITE_SUPABASE_*` environment variables in your host's dashboard, set the build command to `npm run build` and the output directory to `dist`, and configure a SPA fallback (`/* → /index.html`) so client-side routing works on refresh/deep links.
