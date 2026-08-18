import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { getProducts } from "@/data/content";
import { PRODUCT_FILTERS, matchesProductFilter, type FilterKey } from "@/lib/productFilters";
import type { ProductWithGallery } from "@/lib/apiTypes";

type Status = "loading" | "ready" | "error";

// Matches ProductCard's own fixed card/image sizing exactly, so the loading
// skeleton doesn't jump in size once the real cards arrive.
const CARD_WIDTH = "w-64 sm:w-72 lg:w-80";
const IMAGE_HEIGHT = "h-48 sm:h-56 lg:h-64";

/**
 * Filterable product listing — the single implementation of "browse and
 * filter eggs by pack size" reused on both the homepage and the dedicated
 * Our Eggs page, so there's one product list and one filtering behavior
 * for the whole site (no separate static homepage product data).
 *
 * One horizontally-scrolling row at every breakpoint (scroll-snap, next
 * card peeking at the edge) — every card shares the same fixed width and
 * image height (see ProductCard), and `items-stretch` on the row makes the
 * content area the same height too, so nothing shifts card to card as
 * products are added or content length varies.
 */
export default function ProductShop() {
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
      <div className="no-scrollbar -mx-4 mb-8 flex justify-start gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-2 sm:overflow-visible sm:px-0">
        {PRODUCT_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              filter === f.key ? "bg-forest-800 text-cream-50" : "bg-white text-forest-700 hover:bg-forest-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`card ${CARD_WIDTH} shrink-0 snap-start overflow-hidden`}>
              <div className={`skeleton ${IMAGE_HEIGHT} w-full rounded-none`} />
              <div className="space-y-3 p-3 sm:p-4">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
      {status === "error" && <ErrorState onRetry={load} />}
      {status === "ready" && products.length === 0 && (
        <EmptyState title="No products available" message="Please check back soon — new products are added regularly." />
      )}
      {status === "ready" && products.length > 0 && filtered.length === 0 && (
        <EmptyState title="No products in this category" message="Try a different filter." />
      )}
      {status === "ready" && filtered.length > 0 && (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
