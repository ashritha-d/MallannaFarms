// Public content service layer.
//
// Every getter tries the live /api backend first. If the request fails —
// network error, /api not reachable (e.g. plain `npm run dev` without
// `vercel dev`), or a non-2xx response — it falls back to the local seed
// content in ./seed.ts so the public site is never blank. The `source`
// field always tells the caller (and the admin UI) whether it's looking at
// live data or fallback content, so nothing is misrepresented as
// "connected" when it isn't. This mirrors exactly the resilience behavior
// this file had when it talked to Supabase directly — only the transport
// underneath changed.

import type { Faq, GalleryItemWithMedia, OrderLineItem, ProductWithGallery, VideoItem } from "@/lib/apiTypes";
import {
  DEFAULT_SETTINGS,
  SEED_FAQS,
  SEED_GALLERY,
  SEED_PRODUCTS,
  SEED_VIDEOS,
} from "./seed";

export type DataSource = "live" | "seed";

export interface Result<T> {
  data: T;
  source: DataSource;
  error: string | null;
}

/** GETs from /api and returns the parsed `data` field, or null on any failure (network error, non-2xx, bad JSON) — callers decide the seed fallback. */
async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const body = await res.json();
    return body.data as T;
  } catch {
    return null;
  }
}

export async function getSettings(): Promise<Result<Record<string, string>>> {
  const data = await apiGet<Record<string, string>>("/api/settings");
  if (data && Object.keys(data).length > 0) {
    return { data: { ...DEFAULT_SETTINGS, ...data }, source: "live", error: null };
  }
  return { data: DEFAULT_SETTINGS, source: "seed", error: null };
}

export async function getProducts(opts?: { featuredOnly?: boolean }): Promise<Result<ProductWithGallery[]>> {
  const query = opts?.featuredOnly ? "?featured=true" : "";
  const data = await apiGet<ProductWithGallery[]>(`/api/products${query}`);
  if (data) return { data, source: "live", error: null };
  const list = opts?.featuredOnly ? SEED_PRODUCTS.filter((p) => p.featured) : SEED_PRODUCTS;
  return { data: list, source: "seed", error: null };
}

export async function getProductBySlug(slug: string): Promise<Result<ProductWithGallery | null>> {
  const data = await apiGet<ProductWithGallery | null>(`/api/products/${encodeURIComponent(slug)}`);
  if (data) return { data, source: "live", error: null };
  const found = SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  return { data: found, source: "seed", error: null };
}

export async function getGallery(): Promise<Result<GalleryItemWithMedia[]>> {
  const data = await apiGet<GalleryItemWithMedia[]>("/api/gallery");
  if (data) return { data, source: "live", error: null };
  return { data: SEED_GALLERY, source: "seed", error: null };
}

export async function getVideos(): Promise<Result<VideoItem[]>> {
  const data = await apiGet<VideoItem[]>("/api/videos");
  if (data) return { data, source: "live", error: null };
  return { data: SEED_VIDEOS, source: "seed", error: null };
}

export async function getFaqs(): Promise<Result<Faq[]>> {
  const data = await apiGet<Faq[]>("/api/faqs");
  if (data) return { data, source: "live", error: null };
  return { data: SEED_FAQS, source: "seed", error: null };
}

export async function submitContactMessage(input: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean; error: string | null }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error();
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "We couldn't send your message right now. Please try again in a moment." };
  }
}

/**
 * Places an "order enquiry" — no payment gateway is connected, so this
 * records the cart + delivery details for the farm to confirm by phone or
 * WhatsApp, rather than charging a card. See api/_lib/models/Order.ts for
 * the collection this writes to, and /admin/orders for how the farm sees it.
 */
export async function submitOrder(input: {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
  items: OrderLineItem[];
  subtotal: number;
}): Promise<{ ok: boolean; orderNumber: string | null; error: string | null }> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error();
    const body = await res.json();
    return { ok: true, orderNumber: body.orderNumber, error: null };
  } catch {
    return { ok: false, orderNumber: null, error: "We couldn't place your order right now. Please try again in a moment." };
  }
}
