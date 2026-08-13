import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Egg, Heart, Minus, Plus } from "lucide-react";
import FarmImage from "@/components/ui/FarmImage";
import { ROUTES } from "@/routes";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ProductWithGallery } from "@/lib/database.types";

export default function ProductCard({ product }: { product: ProductWithGallery }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isSaved, toggle } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const outOfStock = product.stock_status === "out_of_stock";
  const saved = isSaved(product.id);

  const adjustQty = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => Math.max(1, q + delta));
  };

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, qty);
  };

  const onBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, qty);
    navigate(ROUTES.checkout);
  };

  const onToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

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
        <button
          onClick={onToggleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-forest-700 shadow-card transition-colors hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-earth-500 text-earth-500" : ""}`} />
        </button>
        <span
          className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            outOfStock ? "bg-forest-900/85 text-cream-50" : "bg-forest-50/95 text-forest-700"
          }`}
        >
          {outOfStock ? t("out_of_stock") : t("in_stock")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-earth-600">
          <Egg className="h-3.5 w-3.5" />
          {product.grade ?? "Grade A"} · {product.pack_size}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-forest-900">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-forest-600">{product.short_description}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold text-forest-900">
            ₹{product.discount_price ?? product.price}
          </span>
          {product.discount_price && <span className="text-sm text-forest-400 line-through">₹{product.price}</span>}
        </div>

        {!outOfStock && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-forest-900/15 px-1">
              <button onClick={(e) => adjustQty(e, -1)} aria-label="Decrease quantity" className="rounded-full p-1.5 text-forest-700 hover:bg-forest-100">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-medium">{qty}</span>
              <button onClick={(e) => adjustQty(e, 1)} aria-label="Increase quantity" className="rounded-full p-1.5 text-forest-700 hover:bg-forest-100">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={onAddToCart}
            disabled={outOfStock}
            className="btn-secondary flex-1 !px-3 !py-2 text-xs disabled:opacity-50"
          >
            {t("add_to_cart")}
          </button>
          <button
            onClick={onBuyNow}
            disabled={outOfStock}
            className="btn-primary flex-1 !px-3 !py-2 text-xs disabled:opacity-50"
          >
            {t("buy_now")}
          </button>
        </div>
      </div>
    </Link>
  );
}
