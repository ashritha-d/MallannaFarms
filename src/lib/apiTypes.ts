// Shapes returned by /api (see api/_lib/models/*.ts for the Mongoose side).
// Field names and semantics are unchanged from the old Postgres/Supabase
// schema this replaced — every model's toJSON transform (idTransform.ts)
// renames Mongo's `_id` to a plain string `id`, so nothing here needed to
// change to match what the rest of the app already expected.

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";
export type MediaType = "image" | "video";
export type EnquiryStatus = "new" | "read" | "responded" | "archived";
export type OrderStatus = "new" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";

export interface OrderLineItem {
  product_id: string;
  name: string;
  pack_size: string | null;
  image: string | null;
  price: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  pack_size: string | null;
  egg_count: number | null;
  grade: string | null;
  sku: string | null;
  barcode: string | null;
  category: string | null;
  stock_status: StockStatus;
  features: string[] | null;
  nutrition: Record<string, string> | null;
  feed_info: string | null;
  main_image_url: string | null;
  video_url: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type: MediaType;
  mime_type: string;
  file_size: number;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  media_id: string;
  title: string | null;
  description: string | null;
  category: string;
  sort_order: number;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  subject: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  pincode: string | null;
  notes: string | null;
  items: OrderLineItem[];
  subtotal: number;
  status: OrderStatus;
  created_at: string;
}

/** Convenience shape used across the public site once gallery media is joined. */
export interface GalleryItemWithMedia extends GalleryItem {
  media: Media | null;
}

export interface ProductWithGallery extends Product {
  gallery: Media[];
}
