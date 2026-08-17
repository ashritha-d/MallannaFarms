// Admin-side data access layer. All writes require an authenticated admin
// session — enforced both by ProtectedRoute in the UI and by the
// requireAdmin middleware on the API (see api/_lib/auth.ts), via an httpOnly
// session cookie sent automatically on every same-origin request.

import type {
  ContactMessage,
  Faq,
  GalleryItem,
  Media,
  Order,
  OrderStatus,
  Product,
  VideoItem,
} from "@/lib/apiTypes";

export interface AdminResult<T> {
  data: T | null;
  error: string | null;
}

// Surfaces the real API error alongside a friendly fallback. This is the
// admin dashboard (used only by the site owner, not the public), so showing
// the actual cause — an auth failure, a validation error, a duplicate key —
// is far more useful than hiding it, and lets problems get diagnosed
// without needing browser devtools.
//
// Checked with `error && typeof error === "object"` rather than
// `instanceof Error` — the API's error responses carry the useful detail in
// `hint`/`code`/`message` fields (see api/_lib/errors.ts), and duck-typing
// here means a plain error-shaped object (not every rejection is a real
// Error instance) still surfaces its message instead of silently falling
// back to the generic text.
function friendlyError(error: unknown, fallback: string): string {
  console.error(fallback, error);
  if (error && typeof error === "object") {
    const e = error as { message?: string; hint?: string; code?: string; details?: string };
    const detail = e.hint || e.message || e.details;
    if (detail) return `${fallback} (${detail}${e.code ? ` — code ${e.code}` : ""})`;
  }
  return fallback;
}

/** Parses a fetch Response's JSON body into an error-shaped object ({message, code, hint}) for friendlyError() to read, without assuming a particular error class. */
async function toApiError(res: Response): Promise<{ message?: string; code?: string; hint?: string }> {
  try {
    return await res.json();
  } catch {
    return { message: `Request failed (${res.status}).` };
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin", ...init });
  if (!res.ok) throw await toApiError(res);
  const body = await res.json();
  return body.data as T;
}

function json(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

// ---------- Dashboard ----------
export async function getDashboardStats() {
  try {
    const data = await apiFetch<{
      totalProducts: number;
      activeProducts: number;
      mediaCount: number;
      videoCount: number;
      galleryCount: number;
      newEnquiries: number;
      newOrders: number;
    }>("/api/admin/dashboard/stats");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load dashboard stats.") };
  }
}

// ---------- Products ----------
export async function listProducts(): Promise<AdminResult<Product[]>> {
  try {
    const data = await apiFetch<Product[]>("/api/admin/products");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load products.") };
  }
}

export async function getProduct(id: string): Promise<AdminResult<Product>> {
  try {
    const data = await apiFetch<Product>(`/api/admin/products/${id}`);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load product.") };
  }
}

export async function upsertProduct(product: Partial<Product> & { name: string; slug: string; price: number }): Promise<AdminResult<Product>> {
  try {
    const { id, ...rest } = product;
    const data = id
      ? await apiFetch<Product>(`/api/admin/products/${id}`, json("PUT", rest))
      : await apiFetch<Product>("/api/admin/products", json("POST", rest));
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save product.") };
  }
}

export async function deleteProduct(id: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/products/${id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete product.") };
  }
}

// ---------- Media ----------
export async function listMedia(): Promise<AdminResult<Media[]>> {
  try {
    const data = await apiFetch<Media[]>("/api/admin/media");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load media library.") };
  }
}

// Uploads never transit our own API (Vercel's serverless functions cap
// request bodies at 4.5MB, well under the 100MB this app allows for video):
// 1) ask our API to sign a Cloudinary upload, 2) POST the file straight to
// Cloudinary using that signature, 3) tell our API the resulting URL so it
// can save a Media document. See api/_lib/cloudinary.ts for the server side.
export async function uploadMedia(file: File, category: string): Promise<AdminResult<Media>> {
  try {
    const type = file.type.startsWith("video") ? "video" : "image";
    const maxSize = type === "video" ? 100 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large. Max size is ${type === "video" ? "100MB" : "8MB"}.`);
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/ogg"];
    if (!allowed.includes(file.type)) {
      throw new Error("Unsupported file type.");
    }

    const signature = await apiFetch<{ signature: string; timestamp: number; apiKey: string; cloudName: string; folder: string }>(
      "/api/admin/media/signature",
      json("POST", { category })
    );

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signature.apiKey);
    form.append("timestamp", String(signature.timestamp));
    form.append("signature", signature.signature);
    form.append("folder", signature.folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    });
    if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed.");
    const uploaded = await uploadRes.json();

    const data = await apiFetch<Media>(
      "/api/admin/media",
      json("POST", {
        file_name: file.name,
        file_url: uploaded.secure_url,
        file_type: type,
        mime_type: file.type,
        file_size: file.size,
        category,
        cloudinary_public_id: uploaded.public_id,
      })
    );
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Upload failed. Please try again.") };
  }
}

export async function updateMedia(id: string, patch: Partial<Media>): Promise<AdminResult<Media>> {
  try {
    const data = await apiFetch<Media>(`/api/admin/media/${id}`, json("PATCH", patch));
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not update media.") };
  }
}

export async function deleteMedia(media: Media): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/media/${media.id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete media.") };
  }
}

// ---------- Gallery ----------
export async function listGalleryAdmin(): Promise<AdminResult<(GalleryItem & { media: Media | null })[]>> {
  try {
    const data = await apiFetch<(GalleryItem & { media: Media | null })[]>("/api/admin/gallery");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load gallery.") };
  }
}

export async function upsertGalleryItem(item: Partial<GalleryItem> & { media_id: string; category: string }): Promise<AdminResult<GalleryItem>> {
  try {
    const { id, ...rest } = item;
    const data = id
      ? await apiFetch<GalleryItem>(`/api/admin/gallery/${id}`, json("PUT", rest))
      : await apiFetch<GalleryItem>("/api/admin/gallery", json("POST", rest));
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save gallery item.") };
  }
}

export async function deleteGalleryItem(id: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/gallery/${id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete gallery item.") };
  }
}

// ---------- Videos ----------
export async function listVideosAdmin(): Promise<AdminResult<VideoItem[]>> {
  try {
    const data = await apiFetch<VideoItem[]>("/api/admin/videos");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load videos.") };
  }
}

export async function upsertVideo(video: Partial<VideoItem> & { title: string; video_url: string }): Promise<AdminResult<VideoItem>> {
  try {
    const { id, ...rest } = video;
    const data = id
      ? await apiFetch<VideoItem>(`/api/admin/videos/${id}`, json("PUT", rest))
      : await apiFetch<VideoItem>("/api/admin/videos", json("POST", rest));
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save video.") };
  }
}

export async function deleteVideo(id: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/videos/${id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete video.") };
  }
}

// ---------- FAQs ----------
export async function listFaqsAdmin(): Promise<AdminResult<Faq[]>> {
  try {
    const data = await apiFetch<Faq[]>("/api/admin/faqs");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load FAQs.") };
  }
}

export async function upsertFaq(faq: Partial<Faq> & { question: string; answer: string }): Promise<AdminResult<Faq>> {
  try {
    const { id, ...rest } = faq;
    const data = id
      ? await apiFetch<Faq>(`/api/admin/faqs/${id}`, json("PUT", rest))
      : await apiFetch<Faq>("/api/admin/faqs", json("POST", rest));
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save FAQ.") };
  }
}

export async function deleteFaq(id: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/faqs/${id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete FAQ.") };
  }
}

// ---------- Settings ----------
export async function saveSettings(values: Record<string, string>): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>("/api/admin/settings", json("PUT", values));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not save settings.") };
  }
}

// ---------- Enquiries ----------
export async function listEnquiries(): Promise<AdminResult<ContactMessage[]>> {
  try {
    const data = await apiFetch<ContactMessage[]>("/api/admin/enquiries");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load enquiries.") };
  }
}

export async function updateEnquiryStatus(id: string, status: ContactMessage["status"]): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/enquiries/${id}`, json("PATCH", { status }));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not update enquiry.") };
  }
}

export async function deleteEnquiry(id: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/enquiries/${id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete enquiry.") };
  }
}

// ---------- Orders ----------
// Orders are "order enquiries" (see api/_lib/models/Order.ts) — no payment
// gateway is connected, so these are confirmed by phone/WhatsApp, not
// charged automatically.
export async function listOrders(): Promise<AdminResult<Order[]>> {
  try {
    const data = await apiFetch<Order[]>("/api/admin/orders");
    return { data, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not load orders.") };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/orders/${id}`, json("PATCH", { status }));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not update order.") };
  }
}

export async function deleteOrder(id: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>(`/api/admin/orders/${id}`, json("DELETE"));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not delete order.") };
  }
}

// ---------- Account ----------
export async function changePassword(password: string): Promise<AdminResult<null>> {
  try {
    await apiFetch<null>("/api/auth/change-password", json("POST", { password }));
    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e, "Could not change password.") };
  }
}
