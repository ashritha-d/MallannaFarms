import { Link } from "react-router-dom";
import { Egg } from "lucide-react";
import FarmImage from "@/components/ui/FarmImage";
import { ROUTES } from "@/routes";
import type { ProductWithGallery } from "@/lib/database.types";

export default function ProductCard({ product }: { product: ProductWithGallery }) {
  const outOfStock = product.stock_status === "out_of_stock";
  return (
    <Link
      to={ROUTES.productDetail(product.slug)}
      className="card group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <FarmImage
          src={product.main_image_url ?? ""}
          alt={product.name}
          aspect="aspect-[4/3]"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-forest-900 shadow-card">
            Farm Favourite
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-forest-900/85 px-3 py-1 text-xs font-semibold text-cream-50">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-earth-600">
          <Egg className="h-3.5 w-3.5" />
          {product.grade ?? "Grade A"} · {product.pack_size}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-forest-900">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-forest-600">{product.short_description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold text-forest-900">
              ₹{product.discount_price ?? product.price}
            </span>
            {product.discount_price && (
              <span className="text-sm text-forest-400 line-through">₹{product.price}</span>
            )}
          </div>
          <span className="text-sm font-semibold text-gold-600 group-hover:underline">View Product →</span>
        </div>
      </div>
    </Link>
  );
}
