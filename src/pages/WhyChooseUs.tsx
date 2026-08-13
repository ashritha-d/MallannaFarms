import { Heart, Leaf, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { FARM_IMAGES } from "@/data/seed";

const REASONS = [
  { icon: Sprout, title: "Happy & Healthy Hens", desc: "Giving our birds a natural environment and proper care." },
  { icon: Leaf, title: "Natural Farming", desc: "Promoting responsible and sustainable farming practices." },
  { icon: Sparkles, title: "Fresh & Nutritious Eggs", desc: "Delivering quality eggs from farm to family." },
  { icon: Heart, title: "Quality & Trust", desc: "Maintaining high standards of hygiene, freshness and food safety." },
  { icon: ShieldCheck, title: "Sustainable Future", desc: "Farming responsibly for our customers, animals, and environment." },
];

export default function WhyChooseUs() {
  return (
    <>
      <Seo
        title="Why Choose Us"
        description="Why families trust Mallanna Farms — happy hens, natural farming, fresh nutritious eggs, and a genuine commitment to quality and sustainability."
        path="/why-choose-us"
      />
      <PageHero eyebrow="Why Choose Us" title="Why Families Trust Mallanna Farms" image={FARM_IMAGES.henCloseup} />

      <Section tone="cream">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card flex flex-col gap-4 px-6 py-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-lg font-semibold text-forest-900">{title}</h3>
              <p className="text-sm leading-relaxed text-forest-600">{desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
