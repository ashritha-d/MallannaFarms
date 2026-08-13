import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getProducts } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import type { ProductWithGallery } from "@/lib/database.types";

type Status = "loading" | "ready" | "error";
type FilterKey = "all" | "six" | "twelve" | "family" | "premium";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Eggs" },
  { key: "six", label: "6 Eggs" },
  { key: "twelve", label: "12 Eggs" },
  { key: "family", label: "Family Packs" },
  { key: "premium", label: "Premium Packs" },
];

function matchesFilter(p: ProductWithGallery, key: FilterKey): boolean {
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

export default function Products() {
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

  const filtered = useMemo(() => products.filter((p) => matchesFilter(p, filter)), [products, filter]);

  return (
    <>
      <Seo
        title="Our Eggs — Shop Free Range Eggs"
        description="Shop Mallanna Farms' free-range eggs — Grade A, naturally raised, fresh from our farm to your family."
        path="/products"
      />
      <PageHero
        eyebrow="Shop Mallanna Farms"
        title="Our Fresh Free Range Eggs"
        subtitle="Every tray is collected fresh, graded for quality, and packed with care."
        image={FARM_IMAGES.eggCartonBowl}
      />

      <Section tone="cream">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
