import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { getProducts } from "@/data/content";
import { useWishlist } from "@/contexts/WishlistContext";
import { FARM_IMAGES } from "@/data/seed";
import type { ProductWithGallery } from "@/lib/apiTypes";

export default function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<ProductWithGallery[] | null>(null);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const saved = products?.filter((p) => ids.includes(p.id)) ?? [];

  return (
    <>
      <Seo title="Your Wishlist" description="Products you've saved from Mallanna Farms." path="/wishlist" />
      <PageHero eyebrow="Wishlist" title="Your Saved Eggs" image={FARM_IMAGES.eggsInHay} />

      <Section tone="cream">
        {products === null ? (
          <CardSkeleton count={3} />
        ) : saved.length === 0 ? (
          <EmptyState icon={Heart} title="No saved items yet" message="Tap the heart icon on any product to save it here." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
