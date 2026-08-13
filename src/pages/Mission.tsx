import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";
import { FARM_IMAGES } from "@/data/seed";

const COMMITMENTS = [
  { emoji: "🐔", title: "Happy & Healthy Hens", desc: "Giving our birds a natural environment and proper care." },
  { emoji: "🌱", title: "Natural Farming", desc: "Promoting responsible and sustainable farming practices." },
  { emoji: "🥚", title: "Fresh & Nutritious Eggs", desc: "Delivering quality eggs from farm to family." },
  { emoji: "❤️", title: "Quality & Trust", desc: "Maintaining high standards of hygiene, freshness, and food safety." },
  { emoji: "🌍", title: "Sustainable Future", desc: "Farming responsibly for our customers, animals, and environment." },
];

export default function Mission() {
  const { data: settings } = useSettings();
  return (
    <>
      <Seo
        title="Our Mission"
        description="Our mission at Mallanna Farms is to provide families with fresh, nutritious, naturally produced free-range eggs while caring for our hens and the environment."
        path="/mission"
      />
      <PageHero eyebrow="Our Mission" title={settings.mission_title || "Our Mission"} image={settings.mission_image || FARM_IMAGES.f4} />

      <Section tone="white">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 text-base leading-relaxed text-forest-700 sm:text-lg">
            {(settings.mission_content ?? "").split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <FarmImage src={settings.mission_image || FARM_IMAGES.f4} alt="Our mission at Mallanna Farms" aspect="aspect-[4/3]" rounded="rounded-3xl" className="shadow-lift" />
        </div>
      </Section>

      <Section tone="cream">
        <h2 className="text-center font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Our Commitment</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="card px-5 py-8 text-center">
              <span className="text-3xl">{c.emoji}</span>
              <h3 className="mt-3 font-display text-sm font-semibold text-forest-900">{c.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-forest-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="forest">
        <p className="mx-auto max-w-2xl text-center font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
          Mallanna Farms — Naturally Raised. Freshly Delivered. Made for Healthy Families.
        </p>
      </Section>
    </>
  );
}
