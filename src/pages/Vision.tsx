import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";
import { FARM_IMAGES } from "@/data/seed";

export default function Vision() {
  const { data: settings } = useSettings();
  return (
    <>
      <Seo
        title="Our Vision"
        description="Our vision at Mallanna Farms is to become a trusted name in natural and sustainable poultry farming, bringing healthy free-range eggs from our farm to every family."
        path="/vision"
      />
      <PageHero eyebrow="Our Vision" title={settings.vision_title || "Our Vision"} image={settings.vision_image || FARM_IMAGES.eggsInHay} />

      <Section tone="white">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <FarmImage src={settings.vision_image || FARM_IMAGES.eggsInHay} alt="Our vision at Mallanna Farms" aspect="aspect-[4/3]" rounded="rounded-3xl" className="order-2 shadow-lift lg:order-1" />
          <div className="order-1 space-y-5 text-base leading-relaxed text-forest-700 sm:text-lg lg:order-2">
            {(settings.vision_content ?? "").split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="forest">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow justify-center text-gold-300">
            <span className="h-px w-8 bg-gold-300/70" />
            Vision Statement
            <span className="h-px w-8 bg-gold-300/70" />
          </span>
          <p className="mt-5 font-display text-2xl italic leading-snug text-cream-50 sm:text-4xl">
            “{settings.vision_statement}”
          </p>
        </div>
      </Section>
    </>
  );
}
