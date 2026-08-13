import { useEffect, useState } from "react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getProducts } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import type { ProductWithGallery } from "@/lib/database.types";

type Status = "loading" | "ready" | "error";

export default function Products() {
  const [status, setStatus] = useState<Status>("loading");
  const [products, setProducts] = useState<ProductWithGallery[]>([]);

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

  return (
    <>
      <Seo
        title="Free Range Eggs — Products"
        description="Browse Mallanna Farms' free-range egg products — Grade A, naturally raised, fresh from our farm to your family."
        path="/products"
      />
      <PageHero
        eyebrow="Our Products"
        title="Free Range Eggs, Farm to Family"
        subtitle="Every tray is collected fresh, graded for quality, and packed with care."
        image={FARM_IMAGES.f7}
      />

      <Section tone="cream">
        {status === "loading" && <CardSkeleton count={6} />}
        {status === "error" && <ErrorState onRetry={load} />}
        {status === "ready" && products.length === 0 && (
          <EmptyState title="No products available" message="Please check back soon — new products are added regularly." />
        )}
        {status === "ready" && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
