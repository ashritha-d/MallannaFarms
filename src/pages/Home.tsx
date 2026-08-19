import { NavLink } from "react-router-dom";
import { Egg, Heart, Leaf, ShieldCheck } from "lucide-react";
import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import ProductShop from "@/components/products/ProductShop";
import ClientCarousel from "@/components/home/ClientCarousel";
import JourneySection from "@/components/home/JourneySection";
import FarmTrustSection from "@/components/home/FarmTrustSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { ROUTES } from "@/routes";
import { useLanguage } from "@/contexts/LanguageContext";
import { FARM_IMAGES } from "@/data/seed";
import CommitmentCards from "@/components/ui/CommitmentCards";

// Free-range item uses a real Natu Kodi (native/country chicken) photo
// instead of the generic white-hen emoji — the others stay as emoji.
const TRUST_STRIP = [
  { image: FARM_IMAGES.natuKodi, key: "trust_free_range" as const },
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

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title="Mallanna Farms | Free Range Eggs"
        description="Fresh, nutritious eggs from naturally raised hens at Mallanna Farms. Naturally Raised. Freshly Delivered. Made for Healthy Families."
        path="/"
      />

      {/* Client info carousel */}
      <div className="container-page pt-4 sm:pt-6">
        {/* Trust strip */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 rounded-full bg-forest-800 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-cream-50 sm:gap-x-8 sm:text-xs">
          {TRUST_STRIP.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5 whitespace-nowrap">
              {"image" in item ? (
                <img src={item.image} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
              ) : (
                <span>{item.emoji}</span>
              )}
              {t(item.key)}
            </span>
          ))}
        </div>

        <ClientCarousel />
      </div>

      {/* Products — immediately below, filterable by pack size, no filler content in between */}
      <Section tone="white" className="!pt-8 sm:!pt-12">
        <SectionHeading
          eyebrow={t("section_products_eyebrow")}
          title={t("section_products_title")}
          titleSize="text-xl sm:text-4xl"
        />
        <ProductShop />
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

      <JourneySection />

      {/* Our Commitment */}
      <Section tone="white">
        <SectionHeading eyebrow={t("section_commitment_eyebrow")} title={t("section_commitment_title")} description={t("section_commitment_subtitle")} />
        <CommitmentCards />
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
