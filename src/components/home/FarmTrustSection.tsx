import { Section, SectionHeading } from "@/components/ui/Section";
import FarmImage from "@/components/ui/FarmImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { FARM_IMAGES } from "@/data/seed";

const HIGHLIGHTS = [
  { label: "Happy Hens", image: FARM_IMAGES.henCloseup },
  { label: "Responsible Farming", image: FARM_IMAGES.farmGate },
  { label: "Fresh Eggs", image: FARM_IMAGES.eggsInHay },
  { label: "Healthy Families", image: FARM_IMAGES.farmerWithBasket },
];

export default function FarmTrustSection() {
  const { t } = useLanguage();
  return (
    <Section tone="white">
      <SectionHeading eyebrow={t("section_trust_eyebrow")} title={t("section_trust_title")} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="group relative overflow-hidden rounded-2xl shadow-card">
            <FarmImage src={h.image} alt={h.label} aspect="aspect-square" className="transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/85 to-transparent p-4">
              <span className="font-display text-sm font-semibold text-cream-50 sm:text-base">{h.label}</span>
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
