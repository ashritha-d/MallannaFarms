import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Egg, Heart, Leaf, ShieldCheck, Sprout } from "lucide-react";
import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { ROUTES } from "@/routes";
import { useSettings } from "@/hooks/useSettings";
import { getProducts } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import type { ProductWithGallery } from "@/lib/database.types";

const PROMISE_ITEMS = [
  { icon: Egg, label: "Free Range", desc: "Hens raised with room to roam, not cages." },
  { icon: Sprout, label: "Natural Feed", desc: "A wholesome, natural diet every day." },
  { icon: Leaf, label: "Fresh & Nutritious", desc: "Collected and delivered farm-fresh." },
  { icon: Heart, label: "Quality & Trust", desc: "Hygiene and food safety, always." },
  { icon: ShieldCheck, label: "Sustainable Farming", desc: "Responsible practices for the planet." },
];

const FARM_STRIP = [
  FARM_IMAGES.henCloseup,
  FARM_IMAGES.farmGate,
  FARM_IMAGES.orchardHens,
  FARM_IMAGES.eggsInHay,
  FARM_IMAGES.farmerWithBasket,
];

export default function Home() {
  const { data: settings } = useSettings();
  const [products, setProducts] = useState<ProductWithGallery[] | null>(null);

  useEffect(() => {
    getProducts({ featuredOnly: true }).then((res) => setProducts(res.data));
  }, []);

  return (
    <>
      <Seo
        title="Mallanna Farms | Free Range Eggs"
        description="Fresh, natural, free-range eggs raised with care on Mallanna Farms. Naturally Raised. Freshly Delivered. Made for Healthy Families."
        path="/"
      />

      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden sm:min-h-[92vh]">
        <div className="absolute inset-0">
          <img
            src={settings.hero_image || FARM_IMAGES.hero}
            alt="Free range hens roaming naturally at Mallanna Farms"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950/85" />
        </div>

        <div className="container-page relative z-10 py-24 text-center text-cream-50 sm:py-32">
          <span className="section-eyebrow justify-center text-gold-300">
            <span className="h-px w-8 bg-gold-300/70" />
            Free Range Eggs
            <span className="h-px w-8 bg-gold-300/70" />
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-cream-50 sm:text-6xl lg:text-7xl">
            {settings.hero_heading || "Mallanna Farms"}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream-100/90 sm:text-lg">
            {settings.hero_tagline || "Naturally Raised. Freshly Delivered. Made for Healthy Families."}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <NavLink to={settings.hero_cta_primary_link || ROUTES.products} className="btn-gold w-full sm:w-auto">
              {settings.hero_cta_primary_label || "Explore Our Eggs"}
            </NavLink>
            <NavLink to={settings.hero_cta_secondary_link || ROUTES.farm} className="btn-outline-light w-full sm:w-auto">
              {settings.hero_cta_secondary_label || "Visit Our Farm"}
            </NavLink>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream-50 to-transparent" />
      </section>

      {/* Our Promise */}
      <Section tone="cream">
        <SectionHeading eyebrow="Our Promise" title="What Mallanna Farms Stands For" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {PROMISE_ITEMS.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="card flex flex-col items-center gap-3 px-4 py-8 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-sm font-semibold text-forest-900 sm:text-base">{label}</h3>
              <p className="hidden text-xs text-forest-600 sm:block">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section tone="white">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FarmImage
            src={settings.about_image || FARM_IMAGES.farmerWithBasket}
            alt="Mallanna Farms open natural surroundings"
            aspect="aspect-[4/3]"
            rounded="rounded-2xl2 rounded-3xl"
            className="shadow-lift"
          />
          <div>
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-current opacity-60" />
              About Mallanna Farms
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">
              Healthier food begins with healthier farming
            </h2>
            <p className="mt-5 text-base leading-relaxed text-forest-700 sm:text-lg">{settings.about_content}</p>
            <NavLink to={ROUTES.about} className="mt-6 inline-flex items-center gap-1 font-semibold text-gold-600 hover:underline">
              Learn More →
            </NavLink>
          </div>
        </div>
      </Section>

      {/* Fresh From Our Farm */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="Fresh From Our Farm"
          title="Naturally Raised, Every Single Day"
          description="From open green spaces to daily egg collection, take a glimpse into life on Mallanna Farms."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {FARM_STRIP.map((src, i) => (
            <FarmImage
              key={src + i}
              src={src}
              alt="Life at Mallanna Farms"
              aspect={i === 0 ? "aspect-square col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : "aspect-square"}
              rounded="rounded-2xl"
              className="shadow-card"
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <NavLink to={ROUTES.farm} className="btn-secondary">
            Visit Our Farm
          </NavLink>
        </div>
      </Section>

      {/* Products */}
      <Section tone="white">
        <SectionHeading eyebrow="Our Products" title="Free Range Eggs, Farm to Family" />
        {products === null ? (
          <CardSkeleton />
        ) : products.length === 0 ? (
          <EmptyState title="No products yet" message="Products added in the admin dashboard will appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <NavLink to={ROUTES.products} className="btn-primary">
            View All Products
          </NavLink>
        </div>
      </Section>

      {/* Vision quote strip */}
      <Section tone="forest">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl italic leading-snug text-cream-50 sm:text-3xl">
            “{settings.vision_statement}”
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-gold-300">Mallanna Farms</p>
        </div>
      </Section>
    </>
  );
}
