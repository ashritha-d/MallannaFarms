import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus } from "lucide-react";
import FarmImage from "@/components/ui/FarmImage";
import { ROUTES } from "@/routes";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ProductWithGallery } from "@/lib/apiTypes";

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
      className="card group flex w-64 shrink-0 snap-start flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-72 lg:w-80"
    >
      {/* Fixed height (not aspect-ratio) so every card's image area is
          identical regardless of the source photo's own dimensions — the
          wrapper's `aspect` slot here just takes sizing classes, so a fixed
          h-* works the same way an aspect-* class would. */}
      <div className="relative shrink-0">
        <FarmImage
          src={product.main_image_url ?? ""}
          alt={product.name}
          aspect="h-48 w-full sm:h-56 lg:h-64"
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
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* 1. Name — single line, truncated, so a long name can't grow this
            card taller than the one next to it. */}
        <h3 className="truncate font-display text-sm font-semibold text-forest-900 sm:text-base">{product.name}</h3>

        {/* 2 & 3. Price and pack size on one line, same spot on every card. */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="font-display text-base font-semibold text-forest-900 sm:text-lg">
            ₹{product.discount_price ?? product.price}
          </span>
          {product.discount_price && <span className="text-xs text-forest-400 line-through">₹{product.price}</span>}
          {product.pack_size && <span className="text-xs text-forest-500 sm:text-sm">{product.pack_size}</span>}
        </div>

        {/* 4. Action — quantity stepper + Add to Cart/Buy Now (kept as-is,
            just disabled rather than removed when out of stock, so this
            block's height never changes card to card). */}
        <div className="mt-auto pt-2.5 sm:pt-3">
          <div className={`mb-1.5 flex items-center gap-1 self-start rounded-full border border-forest-900/15 px-1 ${outOfStock ? "opacity-40" : ""}`}>
            <button
              onClick={(e) => adjustQty(e, -1)}
              disabled={outOfStock}
              aria-label="Decrease quantity"
              className="rounded-full p-1 text-forest-700 hover:bg-forest-100 disabled:pointer-events-none sm:p-1.5"
            >
              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
            <span className="w-4 text-center text-xs font-medium sm:w-5 sm:text-sm">{qty}</span>
            <button
              onClick={(e) => adjustQty(e, 1)}
              disabled={outOfStock}
              aria-label="Increase quantity"
              className="rounded-full p-1 text-forest-700 hover:bg-forest-100 disabled:pointer-events-none sm:p-1.5"
            >
              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={onAddToCart}
              disabled={outOfStock}
              className="btn-secondary flex-1 !px-2 !py-1.5 text-[11px] disabled:opacity-50 sm:!px-3 sm:!py-2 sm:text-xs"
            >
              {t("add_to_cart")}
            </button>
            <button
              onClick={onBuyNow}
              disabled={outOfStock}
              className="btn-primary flex-1 !px-2 !py-1.5 text-[11px] disabled:opacity-50 sm:!px-3 sm:!py-2 sm:text-xs"
            >
              {t("buy_now")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
