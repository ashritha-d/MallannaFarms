import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getProducts } from "@/data/content";
import { PRODUCT_FILTERS, matchesProductFilter, type FilterKey } from "@/lib/productFilters";
import type { ProductWithGallery } from "@/lib/apiTypes";

type Status = "loading" | "ready" | "error";

/**
 * Filterable product listing — the single implementation of "browse and
 * filter eggs by pack size" reused on both the homepage and the dedicated
 * Our Eggs page, so there's one product list and one filtering behavior
 * for the whole site (no separate static homepage product data).
 *
 * A single responsive CSS Grid at every breakpoint (1 column on mobile, up
 * through whatever `desktopGridClassName` specifies for `sm:`/`lg:`) — same
 * shape as `CardSkeleton`'s loading grid, so there's no layout jump between
 * the skeleton and the real cards. Grid's default row-stretch means every
 * card in a row is automatically the same height with no manual sizing;
 * `ProductCard` itself reserves equal space for title/description/quantity
 * regardless of content length so rows stay aligned as products change.
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

      {status === "loading" && <CardSkeleton count={6} gridClassName={desktopGridClassName} />}
      {status === "error" && <ErrorState onRetry={load} />}
      {status === "ready" && products.length === 0 && (
        <EmptyState title="No products available" message="Please check back soon — new products are added regularly." />
      )}
      {status === "ready" && products.length > 0 && filtered.length === 0 && (
        <EmptyState title="No products in this category" message="Try a different filter." />
      )}
      {status === "ready" && filtered.length > 0 && (
        <div className={`grid grid-cols-1 items-stretch gap-4 ${desktopGridClassName}`}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
