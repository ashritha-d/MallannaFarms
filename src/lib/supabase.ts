import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True once a real Supabase project has been connected via .env.
 * Until then, the public site renders curated local seed content and the
 * admin dashboard clearly explains that it needs to be connected —
 * nothing pretends to read/write a database that isn't there.
 */
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("YOUR_") && !anonKey.includes("YOUR_")
);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "mallanna-farms-admin-auth",
      },
    })
  : null;

/** Throws a friendly, catchable error when a write operation needs a real backend. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      "Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file (see .env.example), then run the schema in supabase/schema.sql."
    );
  }
  return supabase;
}
