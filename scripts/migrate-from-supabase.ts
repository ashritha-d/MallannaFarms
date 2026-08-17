// One-off local script — copies the live site's current content
// (products/videos/faqs/settings/media/gallery) from Supabase into the new
// MongoDB collections, so the real content already on the site isn't lost
// on cutover. Run once, right before switching the frontend over.
//
// contact_messages/orders/admins are intentionally NOT migrated (see the
// migration plan) — Orders/Enquiries start empty on Mongo, and the one
// admin account is created fresh via `npm run seed:admin`.
//
// Reads Supabase creds from .env (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY —
// the existing public anon key is enough since these are all public-read
// tables) and MONGODB_URI from .env.local.
//
// Usage: npm run migrate:data            (refuses to touch a non-empty collection)
//        npm run migrate:data -- --force (re-imports anyway; may duplicate)
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env" });
loadDotenv({ path: ".env.local" });

import mongoose from "mongoose";
import { Product } from "../api/_lib/models/Product";
import { Video } from "../api/_lib/models/Video";
import { Faq } from "../api/_lib/models/Faq";
import { Setting } from "../api/_lib/models/Setting";
import { Media } from "../api/_lib/models/Media";
import { Gallery } from "../api/_lib/models/Gallery";

const FORCE = process.argv.includes("--force");

async function fetchTable<T>(table: string): Promise<T[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — check .env.");
  const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Fetching ${table} from Supabase failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T[];
}

async function guardEmpty(name: string, count: number) {
  if (count > 0 && !FORCE) {
    throw new Error(`${name} already has ${count} document(s) in MongoDB — refusing to re-import. Pass --force to import anyway (may create duplicates).`);
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set — add it to .env.local first.");
  await mongoose.connect(uri);

  // --- Independent tables first ---
  const [products, videos, faqs, settings] = await Promise.all([
    fetchTable<Record<string, unknown>>("products"),
    fetchTable<Record<string, unknown>>("videos"),
    fetchTable<Record<string, unknown>>("faqs"),
    fetchTable<Record<string, unknown>>("settings"),
  ]);

  await guardEmpty("products", await Product.countDocuments({}));
  if (products.length) {
    await Product.insertMany(products.map(({ id, ...rest }) => rest));
    console.log(`Migrated ${products.length} product(s).`);
  }

  await guardEmpty("videos", await Video.countDocuments({}));
  if (videos.length) {
    await Video.insertMany(videos.map(({ id, ...rest }) => rest));
    console.log(`Migrated ${videos.length} video(s).`);
  }

  await guardEmpty("faqs", await Faq.countDocuments({}));
  if (faqs.length) {
    await Faq.insertMany(faqs.map(({ id, ...rest }) => rest));
    console.log(`Migrated ${faqs.length} FAQ(s).`);
  }

  await guardEmpty("settings", await Setting.countDocuments({}));
  if (settings.length) {
    await Setting.insertMany(settings.map(({ id, updated_at, ...rest }) => rest));
    console.log(`Migrated ${settings.length} setting(s).`);
  }

  // --- media, then gallery (which references media by id) ---
  // NOTE: verify before relying on this — if `media` turns out not to be
  // publicly readable via the anon key (unlike the other tables above),
  // this fetch will fail with a clear error; media/gallery would then need
  // the same admin-credentials treatment as contact_messages/orders instead.
  const media = await fetchTable<Record<string, unknown> & { id: string }>("media");
  await guardEmpty("media", await Media.countDocuments({}));
  const oldToNewMediaId = new Map<string, string>();
  if (media.length) {
    for (const m of media) {
      const { id: oldId, ...rest } = m;
      const created = await Media.create(rest);
      oldToNewMediaId.set(oldId, String(created._id));
    }
    console.log(`Migrated ${media.length} media item(s).`);
  }

  const gallery = await fetchTable<Record<string, unknown> & { id: string; media_id: string }>("gallery");
  await guardEmpty("gallery", await Gallery.countDocuments({}));
  if (gallery.length) {
    const docs = gallery
      .map(({ id, media_id, ...rest }) => ({ ...rest, media_id: oldToNewMediaId.get(media_id) }))
      .filter((g) => g.media_id); // drop rows whose media reference didn't migrate
    await Gallery.insertMany(docs);
    console.log(`Migrated ${docs.length} of ${gallery.length} gallery item(s) (skipped any with an unmatched media reference).`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
