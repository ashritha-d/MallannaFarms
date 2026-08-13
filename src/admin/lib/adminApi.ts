// Admin-side data access layer. All writes require an authenticated admin
// session — enforced both by ProtectedRoute in the UI and by Supabase Row
// Level Security policies on the database (see supabase/schema.sql), so
// these calls are safe even though the anon key is public.

import { requireSupabase } from "@/lib/supabase";
import type {
  ContactMessage,
  Faq,
  GalleryItem,
  Media,
  Product,
  VideoItem,
} from "@/lib/database.types";

export interface AdminResult<T> {
  data: T | null;
  error: string | null;
}

function friendlyError(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message.includes("not connected") ? error.message : fallback;
  return fallback;
}

// ---------- Dashboard ----------
export async function getDashboardStats() {
  try {
    const db = requireSupabase();
    const [products, activeProducts, media, videos, gallery, enquiries] = await Promise.all([
      db.from("products").select("id", { count: "exact", head: true }),
      db.from("products").select("id", { count: "exact", head: true }).eq("active", true),
      db.from("media").select("id", { count: "exact", head: true }),
      db.from("videos").select("id", { count: "exact", head: true }),
      db.from("gallery").select("id", { count: "exact", head: true }),
      db.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    ]);
    return {
      data: {
        totalProducts: products.count ?? 0,
        activeProducts: activeProducts.count ?? 0,
        mediaCount: media.count ?? 0,
        videoCount: videos.count ?? 0,
        galleryCount: gallery.count ?? 0,
        newEnquiries: enquiries.count ?? 0,
      },
      error: null,
    };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load dashboard stats.") };
  }
}

// ---------- Products ----------
export async function listProducts(): Promise<AdminResult<Product[]>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("products").select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load products.") };
  }
}

export async function upsertProduct(product: Partial<Product> & { name: string; slug: string; price: number }): Promise<AdminResult<Product>> {
  try {
    const db = requireSupabase();
    const payload = { ...product, updated_at: new Date().toISOString() };
    const { data, error } = await db.from("products").upsert(payload).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save product.") };
  }
}

export async function deleteProduct(id: string): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete product.") };
  }
}

// ---------- Media ----------
export async function listMedia(): Promise<AdminResult<Media[]>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("media").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load media library.") };
  }
}

export async function uploadMedia(file: File, category: string): Promise<AdminResult<Media>> {
  try {
    const db = requireSupabase();
    const type = file.type.startsWith("video") ? "video" : "image";
    const maxSize = type === "video" ? 100 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large. Max size is ${type === "video" ? "100MB" : "8MB"}.`);
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/ogg"];
    if (!allowed.includes(file.type)) {
      throw new Error("Unsupported file type.");
    }

    const path = `${category || "uncategorized"}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: uploadError } = await db.storage.from("media").upload(path, file, { cacheControl: "3600" });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = db.storage.from("media").getPublicUrl(path);

    const { data, error } = await db
      .from("media")
      .insert({
        file_name: file.name,
        file_url: publicUrl.publicUrl,
        file_type: type,
        mime_type: file.type,
        file_size: file.size,
        category,
      })
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Upload failed. Please try again.") };
  }
}

export async function updateMedia(id: string, patch: Partial<Media>): Promise<AdminResult<Media>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("media").update(patch).eq("id", id).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not update media.") };
  }
}

export async function deleteMedia(media: Media): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const url = new URL(media.file_url);
    const path = decodeURIComponent(url.pathname.split("/object/public/media/")[1] ?? "");
    if (path) await db.storage.from("media").remove([path]);
    const { error } = await db.from("media").delete().eq("id", media.id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete media.") };
  }
}

// ---------- Gallery ----------
export async function listGalleryAdmin(): Promise<AdminResult<(GalleryItem & { media: Media | null })[]>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("gallery").select("*, media(*)").order("sort_order", { ascending: true });
    if (error) throw error;
    return { data: data as unknown as (GalleryItem & { media: Media | null })[], error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load gallery.") };
  }
}

export async function upsertGalleryItem(item: Partial<GalleryItem> & { media_id: string; category: string }): Promise<AdminResult<GalleryItem>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("gallery").upsert(item).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save gallery item.") };
  }
}

export async function deleteGalleryItem(id: string): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const { error } = await db.from("gallery").delete().eq("id", id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete gallery item.") };
  }
}

// ---------- Videos ----------
export async function listVideosAdmin(): Promise<AdminResult<VideoItem[]>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("videos").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load videos.") };
  }
}

export async function upsertVideo(video: Partial<VideoItem> & { title: string; video_url: string }): Promise<AdminResult<VideoItem>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("videos").upsert(video).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save video.") };
  }
}

export async function deleteVideo(id: string): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const { error } = await db.from("videos").delete().eq("id", id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete video.") };
  }
}

// ---------- FAQs ----------
export async function listFaqsAdmin(): Promise<AdminResult<Faq[]>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("faqs").select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load FAQs.") };
  }
}

export async function upsertFaq(faq: Partial<Faq> & { question: string; answer: string }): Promise<AdminResult<Faq>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("faqs").upsert(faq).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save FAQ.") };
  }
}

export async function deleteFaq(id: string): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const { error } = await db.from("faqs").delete().eq("id", id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete FAQ.") };
  }
}

// ---------- Settings ----------
export async function saveSettings(values: Record<string, string>): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const rows = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await db.from("settings").upsert(rows, { onConflict: "key" });
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save settings.") };
  }
}

// ---------- Enquiries ----------
export async function listEnquiries(): Promise<AdminResult<ContactMessage[]>> {
  try {
    const db = requireSupabase();
    const { data, error } = await db.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load enquiries.") };
  }
}

export async function updateEnquiryStatus(id: string, status: ContactMessage["status"]): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const { error } = await db.from("contact_messages").update({ status }).eq("id", id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not update enquiry.") };
  }
}

export async function deleteEnquiry(id: string): Promise<AdminResult<null>> {
  try {
    const db = requireSupabase();
    const { error } = await db.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete enquiry.") };
  }
}
