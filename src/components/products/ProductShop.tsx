import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getProducts } from "@/data/content";
import { PRODUCT_FILTERS, matchesProductFilter, type FilterKey } from "@/lib/productFilters";
import type { ProductWithGallery } from "@/lib/database.types";

type Status = "loading" | "ready" | "error";

/**
 * Filterable product listing — the single implementation of "browse and
 * filter eggs by pack size" reused on both the homepage and the dedicated
 * Our Eggs page, so there's one product list and one filtering behavior
 * for the whole site (no separate static homepage product data).
 *
 * Mobile is a single horizontally-scrolling/swipeable row (scroll-snap,
 * next card peeking at the edge); `desktopGridClassName` controls the
 * column layout from `sm:` up, where each caller keeps its own existing
 * tablet/desktop grid. The `sm:contents` trick on each card's wrapper
 * lets the card become a direct grid item at that breakpoint, so the
 * mobile-only scroll wrapper doesn't affect desktop grid layout at all.
 */
export default function ProductShop({
  desktopGridClassName = "sm:grid-cols-2 lg:grid-cols-3 sm:gap-6",
}: {
  desktopGridClassName?: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [products, setProducts] = useState<ProductWithGallery[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");

  const load = () => {
    setStatus("loading");
    getProducts()
      .then((res) => {
        setProducts(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const filtered = useMemo(() => products.filter((p) => matchesProductFilter(p, filter)), [products, filter]);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {PRODUCT_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              filter === f.key ? "bg-forest-800 text-cream-50" : "bg-white text-forest-700 hover:bg-forest-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === "loading" && <CardSkeleton count={6} />}
      {status === "error" && <ErrorState onRetry={load} />}
      {status === "ready" && products.length === 0 && (
        <EmptyState title="No products available" message="Please check back soon — new products are added regularly." />
      )}
      {status === "ready" && products.length > 0 && filtered.length === 0 && (
        <EmptyState title="No products in this category" message="Try a different filter." />
      )}
      {status === "ready" && filtered.length > 0 && (
        <div
          className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 ${desktopGridClassName}`}
        >
          {filtered.map((p) => (
            <div key={p.id} className="w-[76%] max-w-[280px] shrink-0 snap-start sm:contents">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
