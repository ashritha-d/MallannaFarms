// Shared pack-size filter logic for the shop grid — used by both the
// dedicated "Our Eggs" page and the homepage product section so the two
// never drift out of sync (single source of truth, per egg_count bucket).

import type { ProductWithGallery } from "@/lib/apiTypes";

export type FilterKey = "all" | "six" | "twelve" | "family" | "premium";

export const PRODUCT_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Eggs" },
  { key: "six", label: "6 Eggs" },
  { key: "twelve", label: "12 Eggs" },
  { key: "family", label: "Family Packs" },
  { key: "premium", label: "Premium Packs" },
];

export function matchesProductFilter(p: ProductWithGallery, key: FilterKey): boolean {
  const count = p.egg_count ?? 0;
  switch (key) {
    case "six":
      return count > 0 && count <= 6;
    case "twelve":
      return count > 6 && count <= 15;
    case "family":
      return count > 15 && count <= 36;
    case "premium":
      return count > 36 || (p.discount_price != null && p.discount_price < p.price && count === 0);
    default:
      return true;
  }
}
