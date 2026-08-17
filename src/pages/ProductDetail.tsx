import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, Egg, Heart, Leaf, Minus, Plus } from "lucide-react";
import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import { ErrorState } from "@/components/ui/States";
import { getProductBySlug, getProducts } from "@/data/content";
import { ROUTES } from "@/routes";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ProductWithGallery } from "@/lib/apiTypes";

const STOCK_LABEL: Record<string, { label: string; className: string }> = {
  in_stock: { label: "In Stock", className: "bg-forest-100 text-forest-700" },
  low_stock: { label: "Low Stock", className: "bg-gold-100 text-gold-700" },
  out_of_stock: { label: "Out of Stock", className: "bg-earth-100 text-earth-700" },
  preorder: { label: "Available for Pre-order", className: "bg-forest-100 text-forest-700" },
};

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isSaved, toggle } = useWishlist();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");
  const [product, setProduct] = useState<ProductWithGallery | null>(null);
  const [related, setRelated] = useState<ProductWithGallery[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setStatus("loading");
    getProductBySlug(slug)
      .then((res) => {
        if (!res.data) {
          setStatus("notfound");
          return;
        }
        setProduct(res.data);
        setStatus("ready");
        getProducts().then((all) => setRelated(all.data.filter((p) => p.id !== res.data!.id).slice(0, 3)));
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  if (status === "loading") {
    return (
      <Section tone="cream">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="skeleton aspect-square w-full" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-10 w-40" />
          </div>
        </div>
      </Section>
    );
  }

  if (status === "error") {
    return (
      <Section tone="cream">
        <ErrorState />
      </Section>
    );
  }

  if (status === "notfound" || !product) {
    return (
      <Section tone="cream">
        <div className="py-10 text-center">
          <h1 className="font-display text-2xl font-semibold text-forest-900">Product not found</h1>
          <p className="mt-2 text-forest-600">This product may have been removed or renamed.</p>
          <Link to={ROUTES.products} className="btn-primary mt-6 inline-flex">
            Back to Products
          </Link>
        </div>
      </Section>
    );
  }

  const stock = STOCK_LABEL[product.stock_status] ?? STOCK_LABEL.in_stock;

  return (
    <>
      <Seo
        title={product.name}
        description={product.short_description ?? product.description ?? "Free range eggs from Mallanna Farms."}
        path={ROUTES.productDetail(product.slug)}
        image={product.main_image_url ?? undefined}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.short_description ?? product.description,
          image: product.main_image_url,
          sku: product.sku,
          offers: {
            "@type": "Offer",
            price: product.discount_price ?? product.price,
            priceCurrency: "INR",
            availability:
              product.stock_status === "out_of_stock"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
          },
        }}
      />

      <nav className="container-page pt-6 text-xs text-forest-500 sm:text-sm" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to={ROUTES.products} className="hover:text-forest-800">
              Products
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" />
          <li className="text-forest-800">{product.name}</li>
        </ol>
      </nav>

      <Section tone="cream" className="pt-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <FarmImage
            src={product.main_image_url ?? ""}
            alt={product.name}
            aspect="aspect-square"
            rounded="rounded-3xl"
            className="shadow-lift"
          />

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-earth-600">
              <Egg className="h-4 w-4" />
              {product.grade} · {product.pack_size}
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold text-forest-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-forest-700">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-forest-900">
                  ₹{product.discount_price ?? product.price}
                </span>
                {product.discount_price && <span className="text-lg text-forest-400 line-through">₹{product.price}</span>}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stock.className}`}>{stock.label}</span>
            </div>

            {product.features && product.features.length > 0 && (
              <ul className="mt-7 space-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-forest-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {product.stock_status !== "out_of_stock" && (
              <div className="mt-8 flex items-center gap-3">
                <span className="text-sm font-medium text-forest-700">Quantity</span>
                <div className="flex items-center gap-1 rounded-full border border-forest-900/15 px-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="rounded-full p-2 text-forest-700 hover:bg-forest-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="rounded-full p-2 text-forest-700 hover:bg-forest-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => addItem(product, qty)}
                disabled={product.stock_status === "out_of_stock"}
                className="btn-secondary disabled:opacity-50"
              >
                {t("add_to_cart")}
              </button>
              <button
                onClick={() => {
                  addItem(product, qty);
                  navigate(ROUTES.checkout);
                }}
                disabled={product.stock_status === "out_of_stock"}
                className="btn-primary disabled:opacity-50"
              >
                {t("buy_now")}
              </button>
              <button
                onClick={() => toggle(product.id)}
                aria-pressed={isSaved(product.id)}
                className="btn-secondary !px-4"
                aria-label={isSaved(product.id) ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={`h-4 w-4 ${isSaved(product.id) ? "fill-earth-500 text-earth-500" : ""}`} />
              </button>
            </div>

            <p className="mt-3 text-xs text-forest-500">
              Checkout collects your delivery details — payment is confirmed by our team on call/WhatsApp
              (cash or UPI on delivery). Prefer to talk first?{" "}
              <Link to={ROUTES.contact} className="text-gold-600 hover:underline">
                Contact us
              </Link>
              .
            </p>

            {(product.nutrition || product.feed_info) && (
              <div className="mt-9 rounded-2xl border border-forest-900/10 bg-white p-5">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold text-forest-900">
                  <Leaf className="h-4 w-4 text-forest-600" />
                  Nutrition & Farm Information
                </h2>
                {product.nutrition && (
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                    {Object.entries(product.nutrition).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-forest-500">{k.replace(/_/g, " ")}</dt>
                        <dd className="font-medium text-forest-800">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {product.feed_info && <p className="mt-3 text-sm text-forest-600">{product.feed_info}</p>}
              </div>
            )}
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="You May Also Like" title="More From Mallanna Farms" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
