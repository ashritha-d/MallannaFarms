import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";
import { FARM_IMAGES } from "@/data/seed";
import { COMMITMENTS } from "@/data/commitments";

export default function MissionVision() {
  const { data: settings } = useSettings();

  return (
    <>
      <Seo
        title="Mission & Vision"
        description="Mallanna Farms' mission and vision — providing families with fresh, nutritious, naturally produced free-range eggs while caring for our hens and the environment."
        path="/mission-vision"
      />
      <PageHero eyebrow="Mission & Vision" title="What Drives Mallanna Farms" image={settings.mission_image || FARM_IMAGES.henWithBasket} />

      {/* Mission */}
      <Section tone="white">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-current opacity-60" />
              Our Mission
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">{settings.mission_title || "Our Mission"}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-forest-700 sm:text-lg">
              {(settings.mission_content ?? "").split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <FarmImage src={settings.mission_image || FARM_IMAGES.henWithBasket} alt="Our mission at Mallanna Farms" aspect="aspect-[4/3]" rounded="rounded-3xl" className="shadow-lift" />
        </div>

        {/* Leaf divider */}
        <div className="my-14 flex items-center justify-center gap-4 text-forest-300" aria-hidden="true">
          <span className="h-px w-16 bg-forest-200" />
          <span className="text-2xl">🌿</span>
          <span className="h-px w-16 bg-forest-200" />
        </div>

        {/* Vision */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FarmImage
            src={settings.vision_image || FARM_IMAGES.eggsInHay}
            alt="Our vision at Mallanna Farms"
            aspect="aspect-[4/3]"
            rounded="rounded-3xl"
            className="order-2 shadow-lift lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-current opacity-60" />
              Our Vision
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">{settings.vision_title || "Our Vision"}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-forest-700 sm:text-lg">
              {(settings.vision_content ?? "").split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Vision quote card */}
      <Section tone="cream">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gold-200 bg-gradient-to-br from-cream-100 to-gold-50 px-8 py-12 text-center shadow-card">
          <span className="text-3xl">🌾</span>
          <p className="mt-4 font-display text-2xl italic leading-snug text-forest-900 sm:text-3xl">
            “{settings.vision_statement}”
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-earth-600">Mallanna Farms</p>
        </div>
      </Section>

      {/* Commitment */}
      <Section tone="white">
        <h2 className="text-center font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Our Commitment</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-forest-600">
          Caring for our hens. Respecting nature. Delivering better eggs.
        </p>
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
    </>
  );
}
