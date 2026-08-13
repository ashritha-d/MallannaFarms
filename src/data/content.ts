// Public content service layer.
//
// Every getter tries the live Supabase database first. If Supabase isn't
// connected yet (no env vars) or a query fails, it falls back to the local
// seed content in ./seed.ts so the public site is never blank — but the
// `source` field always tells the caller (and the admin UI) whether it's
// looking at live data or fallback content, so nothing is misrepresented
// as "connected" when it isn't.

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Faq, GalleryItemWithMedia, OrderLineItem, ProductWithGallery, VideoItem } from "@/lib/database.types";
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

export async function getSettings(): Promise<Result<Record<string, string>>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("settings").select("key, value");
    if (!error && data && data.length > 0) {
      const map: Record<string, string> = { ...DEFAULT_SETTINGS };
      for (const row of data) map[row.key] = row.value;
      return { data: map, source: "live", error: null };
    }
  }
  return { data: DEFAULT_SETTINGS, source: "seed", error: null };
}

export async function getProducts(opts?: { featuredOnly?: boolean }): Promise<Result<ProductWithGallery[]>> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("products").select("*").eq("active", true).order("sort_order", { ascending: true });
    if (opts?.featuredOnly) query = query.eq("featured", true);
    const { data, error } = await query;
    if (!error && data) {
      return { data: data.map((p) => ({ ...p, gallery: [] })), source: "live", error: null };
    }
  }
  const list = opts?.featuredOnly ? SEED_PRODUCTS.filter((p) => p.featured) : SEED_PRODUCTS;
  return { data: list, source: "seed", error: null };
}

export async function getProductBySlug(slug: string): Promise<Result<ProductWithGallery | null>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
    if (!error && data) {
      return { data: { ...data, gallery: [] }, source: "live", error: null };
    }
  }
  const found = SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  return { data: found, source: "seed", error: null };
}

export async function getGallery(): Promise<Result<GalleryItemWithMedia[]>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("gallery")
      .select("*, media(*)")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (!error && data) {
      return { data: data as unknown as GalleryItemWithMedia[], source: "live", error: null };
    }
  }
  return { data: SEED_GALLERY, source: "seed", error: null };
}

export async function getVideos(): Promise<Result<VideoItem[]>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("videos").select("*").eq("active", true).order("created_at", { ascending: false });
    if (!error && data) {
      return { data, source: "live", error: null };
    }
  }
  return { data: SEED_VIDEOS, source: "seed", error: null };
}

export async function getFaqs(): Promise<Result<Faq[]>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("faqs").select("*").eq("active", true).order("sort_order", { ascending: true });
    if (!error && data) {
      return { data, source: "live", error: null };
    }
  }
  return { data: SEED_FAQS, source: "seed", error: null };
}

export async function submitContactMessage(input: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      error:
        "This form can't be submitted yet because the website isn't connected to a database. Please reach out using the phone number or email below instead.",
    };
  }
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name,
    phone: input.phone || null,
    email: input.email,
    subject: input.subject || null,
    message: input.message,
    status: "new",
  });
  if (error) {
    return { ok: false, error: "We couldn't send your message right now. Please try again in a moment." };
  }
  return { ok: true, error: null };
}

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MF-${stamp}-${rand}`;
}

/**
 * Places an "order enquiry" — no payment gateway is connected, so this
 * records the cart + delivery details for the farm to confirm by phone or
 * WhatsApp, rather than charging a card. See supabase/schema.sql for the
 * `orders` table this writes to, and /admin/orders for how the farm sees it.
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
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      orderNumber: null,
      error:
        "Online ordering isn't connected yet because the website isn't linked to a database. Please call, WhatsApp or email us directly to place your order — see the details below.",
    };
  }
  const orderNumber = generateOrderNumber();
  const { error } = await supabase.from("orders").insert({
    order_number: orderNumber,
    customer_name: input.customerName,
    phone: input.phone,
    email: input.email || null,
    address: input.address,
    city: input.city || null,
    pincode: input.pincode || null,
    notes: input.notes || null,
    items: input.items,
    subtotal: input.subtotal,
    status: "new",
  });
  if (error) {
    return { ok: false, orderNumber: null, error: "We couldn't place your order right now. Please try again in a moment." };
  }
  return { ok: true, orderNumber, error: null };
}
