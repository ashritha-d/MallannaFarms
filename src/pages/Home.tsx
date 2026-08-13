import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Egg, Heart, Leaf, ShieldCheck } from "lucide-react";
import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import ProductCard from "@/components/products/ProductCard";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import JourneySection from "@/components/home/JourneySection";
import FarmTrustSection from "@/components/home/FarmTrustSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { ROUTES } from "@/routes";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProducts } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import { COMMITMENTS } from "@/data/commitments";
import type { ProductWithGallery } from "@/lib/database.types";

const TRUST_STRIP = [
  { emoji: "🐔", key: "trust_free_range" as const },
  { emoji: "🌱", key: "trust_natural_feed" as const },
  { emoji: "🥚", key: "trust_fresh_eggs" as const },
  { emoji: "❤️", key: "trust_quality" as const },
];

const WHY_CARDS = [
  { icon: Egg, title: "Happy & Healthy Hens", desc: "Our hens are raised in a natural environment with space to move freely." },
  { icon: Leaf, title: "Natural Farming", desc: "We follow responsible farming practices with a focus on natural surroundings and quality nutrition." },
  { icon: Heart, title: "Fresh & Nutritious", desc: "Fresh eggs carefully collected and delivered from farm to family." },
  { icon: ShieldCheck, title: "Quality & Trust", desc: "We focus on hygiene, freshness, consistency, and food safety." },
  { icon: Leaf, title: "Sustainable Future", desc: "We believe responsible farming creates a healthier future for families, animals, and the environment." },
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
  const { t } = useLanguage();
  const [products, setProducts] = useState<ProductWithGallery[] | null>(null);

  useEffect(() => {
    getProducts({ featuredOnly: true }).then((res) => setProducts(res.data));
  }, []);

  return (
    <>
      <Seo
        title="Mallanna Farms | Free Range Eggs"
        description="Fresh, nutritious eggs from naturally raised hens at Mallanna Farms. Naturally Raised. Freshly Delivered. Made for Healthy Families."
        path="/"
      />

      {/* Compact promotional banner */}
      <div className="container-page pt-4 sm:pt-6">
        {/* Trust strip */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 rounded-full bg-forest-800 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-cream-50 sm:gap-x-8 sm:text-xs">
          {TRUST_STRIP.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5 whitespace-nowrap">
              <span>{item.emoji}</span>
              {t(item.key)}
            </span>
          ))}
        </div>

        <section className="relative overflow-hidden rounded-2xl shadow-lift sm:rounded-3xl">
          <div className="relative h-56 sm:h-72 lg:h-96">
            <img
              src={settings.hero_image || FARM_IMAGES.hero}
              alt="Free range hens roaming naturally at Mallanna Farms"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/60 to-forest-950/10 sm:via-forest-950/50" />

            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-5 py-4 text-cream-50 sm:px-10 sm:py-6 lg:px-14">
              <span className="section-eyebrow text-gold-300">
                <span className="h-px w-6 bg-gold-300/70" />
                {t("hero_eyebrow")}
              </span>
              <h1 className="mt-2 font-display text-2xl font-semibold leading-[1.1] text-cream-50 sm:text-3xl lg:text-4xl">
                {t("hero_heading")}
              </h1>
              <p className="mt-1.5 font-display text-sm text-gold-200 sm:text-lg">{t("hero_heading_line2")}</p>
              <p className="mt-2 hidden max-w-sm text-sm leading-relaxed text-cream-100/90 sm:block">
                {t("hero_description")}
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <NavLink to={ROUTES.products} className="btn-gold !px-5 !py-2.5 text-sm w-full sm:w-auto">
                  {t("hero_cta_shop")}
                </NavLink>
                <NavLink to={ROUTES.farm} className="btn-outline-light !px-5 !py-2.5 text-sm w-full sm:w-auto">
                  {t("hero_cta_farm")}
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Products — immediately below the banner, no filler content in between */}
      <Section tone="white" className="!pt-8 sm:!pt-12">
        <SectionHeading eyebrow={t("section_products_eyebrow")} title={t("section_products_title")} description={t("section_products_subtitle")} />
        {products === null ? (
          <CardSkeleton />
        ) : products.length === 0 ? (
          <EmptyState title="No products yet" message="Products added in the admin dashboard will appear here." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <NavLink to={ROUTES.products} className="btn-primary">
            {t("cta_shop_eggs")}
          </NavLink>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section tone="cream">
        <SectionHeading eyebrow={t("section_why_eyebrow")} title={t("section_why_title")} description={t("section_why_subtitle")} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card flex flex-col gap-3 px-5 py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-sm font-semibold text-forest-900">{title}</h3>
              <p className="text-xs leading-relaxed text-forest-600">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Life at Mallanna Farms */}
      <Section tone="white">
        <SectionHeading
          eyebrow={t("section_farm_eyebrow")}
          title={t("section_farm_title")}
          description="Our hens are raised in an open, natural environment where they can move freely, explore, and grow naturally."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {FARM_STRIP.map((src, i) => (
            <FarmImage
              key={src + i}
              src={src}
              alt="Life at Mallanna Farms"
              aspect={i === 0 ? "aspect-square col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : "aspect-square"}
              rounded="rounded-2xl"
              className="shadow-card transition-transform duration-500 hover:scale-[1.03]"
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <NavLink to={ROUTES.farm} className="btn-secondary">
            {t("section_farm_cta")}
          </NavLink>
        </div>
      </Section>

      <JourneySection />

      {/* Mission teaser */}
      <Section tone="cream">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FarmImage
            src={settings.mission_image || FARM_IMAGES.henWithBasket}
            alt="Our mission at Mallanna Farms"
            aspect="aspect-[4/3]"
            rounded="rounded-3xl"
            className="shadow-lift"
          />
          <div>
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-current opacity-60" />
              {t("section_mission_eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">{t("section_mission_title")}</h2>
            <p className="mt-5 text-base leading-relaxed text-forest-700 sm:text-lg">
              {(settings.mission_content ?? "").split("\n\n")[0]}
            </p>
            <div className="my-6 flex items-center gap-3 text-forest-300" aria-hidden="true">
              <span className="h-px w-10 bg-forest-200" />
              <span className="text-xl">🌿</span>
            </div>
            <NavLink to={ROUTES.missionVision} className="inline-flex items-center gap-1 font-semibold text-gold-600 hover:underline">
              Read Our Full Mission & Vision →
            </NavLink>
          </div>
        </div>
      </Section>

      {/* Our Commitment */}
      <Section tone="white">
        <SectionHeading eyebrow={t("section_commitment_eyebrow")} title={t("section_commitment_title")} description={t("section_commitment_subtitle")} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="card px-5 py-8 text-center">
              <span className="text-3xl">{c.emoji}</span>
              <h3 className="mt-3 font-display text-sm font-semibold text-forest-900">{c.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-forest-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Vision quote */}
      <Section tone="cream">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gold-200 bg-gradient-to-br from-cream-100 to-gold-50 px-8 py-12 text-center shadow-card">
          <span className="section-eyebrow justify-center text-earth-600">{t("section_vision_eyebrow")}</span>
          <span className="mt-2 block text-3xl">🌾</span>
          <p className="mt-4 font-display text-2xl italic leading-snug text-forest-900 sm:text-3xl">
            “{settings.vision_statement}”
          </p>
          <NavLink to={ROUTES.missionVision} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:underline">
            Read Our Vision →
          </NavLink>
        </div>
      </Section>

      {/* Why Free Range teaser */}
      <Section tone="white">
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl bg-forest-50 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="section-eyebrow">{t("section_why_free_range_eyebrow")}</span>
            <h2 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">{t("section_why_free_range_title")}</h2>
            <p className="mt-4 text-base leading-relaxed text-forest-700">
              Natural movement, open surroundings, responsible nutrition — see what makes free-range eggs different.
            </p>
            <NavLink to={ROUTES.whyFreeRange} className="btn-primary mt-6 inline-flex">
              Learn More
            </NavLink>
          </div>
          <FarmImage src={FARM_IMAGES.orchardHens} alt="Free range hens" aspect="aspect-[4/3]" rounded="rounded-2xl" className="shadow-card" />
        </div>
      </Section>

      <FarmTrustSection />
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0">
          <img src={FARM_IMAGES.orchardHens} alt="" aria-hidden="true" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-forest-950/90" />
        </div>
        <div className="container-page relative z-10 text-center text-cream-50">
          <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">{t("cta_final_title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream-100/90">{t("cta_final_text")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <NavLink to={ROUTES.products} className="btn-gold w-full sm:w-auto">
              {t("cta_shop_eggs")}
            </NavLink>
            <NavLink to={ROUTES.contact} className="btn-outline-light w-full sm:w-auto">
              {t("cta_contact_us")}
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
