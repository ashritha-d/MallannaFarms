# Mallanna Farms — Website & Admin Dashboard

Official website and admin dashboard for **Mallanna Farms**, a natural free-range egg farming brand.

> **Naturally Raised. Freshly Delivered. Made for Healthy Families.**

Built with React + Vite + TypeScript + Tailwind CSS, backed by a small Express API (deployed as Vercel Serverless Functions), MongoDB Atlas, and Cloudinary for media storage.

---

## What's in this repo

- **Public website** — Home, About, Mission, Vision, Our Farm, Products, Product Details, Gallery, Videos, Why Choose Us, Contact, FAQ, Privacy Policy, Terms & Conditions.
- **Admin dashboard** (`/admin`) — secure, authenticated CMS for products, media, gallery, videos, homepage/page content, FAQs, contact enquiries, settings and social links.
- **Backend API** (`/api`) — one Express app, exported as a single Vercel Function, talking to MongoDB via Mongoose. Public routes are unauthenticated and read-only (or insert-only for contact/orders); everything under `/api/admin/*` requires an admin session (httpOnly JWT cookie).
- **Data layer** — every public page reads from `/api`; if it's unreachable, the site falls back to curated local content (using the real uploaded farm photography) so it's never blank, and the admin UI clearly flags when it's running without a live backend.

## Current status

⚠️ **No backend is connected yet.** The frontend, API, and admin dashboard are fully built, but you need to create a MongoDB Atlas cluster and a Cloudinary account and wire up their credentials (steps below) before:
- the admin login works,
- products/gallery/videos/content can be edited,
- the contact form / order form can store submissions.

Until then, the public site displays real farm photography and placeholder text so it's presentable, and admin screens show a clear "Can't reach the backend" banner instead of pretending to save data.

---

## 1. Prerequisites

- Node.js 20.x and npm
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
- A free [Cloudinary](https://cloudinary.com/users/register/free) account
- The [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`, or just use the local devDependency via `npx vercel`) — needed to run the `/api` functions locally

## 2. Install dependencies

```bash
npm install
```

## 3. Connect the backend

1. **MongoDB Atlas** — create a free (M0) cluster, create a database user, then **Connect → Drivers** to get your connection string.
2. **Cloudinary** — from the dashboard home page, copy your Cloud Name, API Key and API Secret (Account Details card).
3. Copy `.env.example` to `.env.local` and fill in all five values (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`):
   ```bash
   cp .env.example .env.local
   ```
   Generate a `JWT_SECRET` with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
4. Create your admin account (also how you reset a forgotten password later — just rerun this):
   ```bash
   npm run seed:admin -- you@example.com "a-strong-password"
   ```
5. **(Optional, one-time)** If you have existing content in an old Supabase project, migrate it over:
   ```bash
   npm run migrate:data
   ```
   This reads `products`/`videos`/`faqs`/`settings`/`media`/`gallery` from Supabase's public REST API (needs the old `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` in `.env`) and writes them into MongoDB. It refuses to touch a collection that already has documents unless you pass `--force`. `contact_messages`/`orders`/`admins` are not migrated (see `scripts/migrate-from-supabase.ts`'s header comment for why).

**Never** put these values anywhere except `.env.local` (or your host's environment variable settings) — none of them carry the `VITE_` prefix on purpose, so Vite never bundles them into the browser-shipped code.

## 4. Run the dev server

```bash
npm run dev:full
```

This runs `vercel dev`, which serves the Vite frontend **and** the `/api` functions together on one local port — use this whenever you need the backend (admin login, saving content, placing orders). Visit `http://localhost:3000`. Admin dashboard: `http://localhost:3000/admin`.

Plain `npm run dev` (just Vite, no `/api`) also works for quick frontend-only iteration — the site falls back to local seed content automatically, same as if the backend were down.

## 5. Build for production

```bash
npm run build
npm run preview   # preview the production build locally (frontend only, no /api)
```

---

## Project structure

```
api/
  index.ts            # Single Express app — the Vercel Function entry point
  _lib/
    db.ts              # Cached MongoDB connection (serverless-safe)
    auth.ts            # JWT session cookie helpers + requireAdmin middleware
    cloudinary.ts       # Signed direct-to-Cloudinary upload flow
    errors.ts           # Shared error shape + Express error handler
    models/             # One Mongoose model per collection
    routes/              # public.ts (no auth), auth.ts (login/session/logout), admin.ts (requireAdmin)
scripts/
  seed-admin.ts        # Create/reset the one admin account
  migrate-from-supabase.ts  # One-off import of old Supabase content
src/
  admin/            # Admin dashboard: auth, layout, CRUD pages, data-access layer (adminApi.ts)
  components/        # Shared UI (layout, cards, image, lightbox, SEO, empty/error states)
  data/               # seed.ts (local fallback content) + content.ts (public data service)
  hooks/              # useSettings (cached site settings)
  lib/                # apiTypes.ts — shapes returned by /api
  pages/              # Public website pages
  App.tsx, main.tsx, routes.ts
public/
  assets/farm/        # Uploaded farm photography
  assets/logo/         # Official Mallanna Farms logo (logoF.jpeg) — used as-is, unmodified
  robots.txt, sitemap.xml
_archive/
  supabase-schema-pre-mongodb-migration/  # Old Postgres schema, kept for reference only — not used
```

## Design system

Deep forest green, earthy brown, soft gold and warm cream — defined as Tailwind tokens in `tailwind.config.js` (`forest`, `earth`, `gold`, `cream`). Display type is **Fraunces**, body type is **Inter**. The official logo (`logoF.jpeg`) is used unmodified throughout — navbar, footer, favicon — and is never redrawn or altered.

## Notes on the uploaded images

The original `f1.jpeg`–`f9.jpeg` uploads turned out to be mostly composite marketing mockups — logo concept sheets, packaging renders, a multi-panel brand moodboard — rather than individual candid farm photos, several with promotional text baked into the pixels (placeholder phone numbers, alternate taglines, etc). The photos actually used across the site (`public/assets/farm/hen-closeup.jpg`, `farm-gate-entrance.jpg`, `hen-with-egg-basket.jpg`, and others) are cropped directly from the clean, text-free panels inside those uploads, so every image on the site is still real pixels from your own assets — just isolated from the surrounding collage grid and captions. The original uploads are untouched and still in that folder if you want to reuse them elsewhere.

One uploaded file, `f7.jpeg`, turned out to be a screenshot of an unrelated third-party egg farm's website (a New Zealand business) — it is intentionally not referenced anywhere on the site.

The farm's real postal address, nutrition-facts panel, FSSAI license number and barcode (visible on the `f6.jpeg` packaging artwork) are used as the seeded contact/product data in `src/data/seed.ts`. Update contact details for real in `/admin → Settings` once you're ready.

## Notes on the sitemap

`public/sitemap.xml` lists the static pages. Individual product URLs (`/products/:slug`) are database-driven and not included since this is a static file — for full SEO coverage in production, generate the sitemap server-side (e.g. a small script that queries the `products` collection and appends `<url>` entries) once your catalog is live.

## Capacitor / Android WebView

The site uses relative units, touch-friendly tap targets, safe-area padding (`env(safe-area-inset-*)`), and avoids hover-only interactions, so it's ready to drop into a Capacitor WebView shell. No Capacitor project exists yet in this repo — run `npx cap init` and `npx cap add android` when you're ready to wrap it.

## Deploying

Deployed on [Vercel](https://vercel.com) — `vercel.json` is already configured (build command, output directory, and rewrites that route `/api/*` to the Express function and everything else to the SPA). Set the five server-only environment variables from `.env.example` (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) in the Vercel project's **Settings → Environment Variables** for both Production and Preview, then push to the connected GitHub branch to deploy.
