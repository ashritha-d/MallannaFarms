// Typed schema mirror of supabase/schema.sql
// Regenerate with `supabase gen types typescript` once the project is live
// for drift-proof types; this hand-written version keeps the app compiling
// and fully typed before a Supabase project exists.
//
// Note: each table includes an empty `Relationships: []` array — the
// @supabase/supabase-js client's generic types require it to be present
// (even when unused) for type inference on .from(...) calls to resolve
// correctly instead of falling back to `never`.

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";
export type MediaType = "image" | "video";
export type EnquiryStatus = "new" | "read" | "responded" | "archived";

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          role: "owner" | "admin";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admins"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["admins"]["Row"]>;
        Relationships: [];
      };
      media: {
        Row: {
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
        };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]> & {
          file_name: string;
          file_url: string;
          file_type: MediaType;
          mime_type: string;
          file_size: number;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
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
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & { name: string; slug: string; price: number };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          media_id: string;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["product_images"]["Row"]> & { product_id: string; media_id: string };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          media_id: string;
          title: string | null;
          description: string | null;
          category: string;
          sort_order: number;
          featured: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery"]["Row"]> & { media_id: string; category: string };
        Update: Partial<Database["public"]["Tables"]["gallery"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "gallery_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          video_url: string;
          thumbnail_url: string | null;
          category: string | null;
          featured: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["videos"]["Row"]> & { title: string; video_url: string };
        Update: Partial<Database["public"]["Tables"]["videos"]["Row"]>;
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string | null;
          hero_image: string | null;
          active: boolean;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pages"]["Row"]> & { slug: string; title: string };
        Update: Partial<Database["public"]["Tables"]["pages"]["Row"]>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          sort_order: number;
          active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["faqs"]["Row"]> & { question: string; answer: string };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string;
          subject: string | null;
          message: string;
          status: EnquiryStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]> & { name: string; email: string; message: string };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["settings"]["Row"]> & { key: string; value: string };
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Relationships: [];
      };
      site_visits: {
        Row: {
          id: string;
          path: string;
          created_at: string;
        };
        Insert: { id?: string; path: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["site_visits"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Media = Database["public"]["Tables"]["media"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery"]["Row"];
export type VideoItem = Database["public"]["Tables"]["videos"]["Row"];
export type PageContent = Database["public"]["Tables"]["pages"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];

/** Convenience shape used across the public site once gallery media is joined. */
export interface GalleryItemWithMedia extends GalleryItem {
  media: Media | null;
}

export interface ProductWithGallery extends Product {
  gallery: Media[];
}
