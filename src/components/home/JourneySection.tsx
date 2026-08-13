import { Egg, Heart, Home as HomeIcon, ShieldCheck, Truck } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { useLanguage } from "@/contexts/LanguageContext";

const STEPS = [
  { number: "01", icon: HomeIcon, title: "Natural Environment", desc: "Hens enjoy an open and natural surroundings." },
  { number: "02", icon: Heart, title: "Responsible Care", desc: "Healthy birds receive proper care and quality nutrition." },
  { number: "03", icon: Egg, title: "Fresh Eggs", desc: "Eggs are carefully collected and handled." },
  { number: "04", icon: ShieldCheck, title: "Quality Check", desc: "Freshness and quality are maintained." },
  { number: "05", icon: Truck, title: "Your Family", desc: "Fresh eggs make their way from our farm to your home." },
];

export default function JourneySection() {
  const { t } = useLanguage();
  return (
    <Section tone="white">
      <SectionHeading eyebrow={t("section_journey_eyebrow")} title={t("section_journey_title")} />
      <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        <div className="absolute left-0 right-0 top-9 hidden h-px bg-forest-200 lg:block" aria-hidden="true" />
        {STEPS.map(({ number, icon: Icon, title, desc }) => (
          <div key={number} className="relative flex flex-col items-center text-center">
            <span className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-cream-50 bg-forest-100 text-forest-700 shadow-card">
              <Icon className="h-7 w-7" />
            </span>
            <span className="mt-3 font-display text-xs font-semibold uppercase tracking-widest text-gold-600">{number}</span>
            <h3 className="mt-1 font-display text-base font-semibold text-forest-900">{title}</h3>
            <p className="mt-1.5 text-sm text-forest-600">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
