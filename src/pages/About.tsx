import { NavLink } from "react-router-dom";
import { Heart, Leaf, ShieldCheck } from "lucide-react";
import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import { useSettings } from "@/hooks/useSettings";
import { FARM_IMAGES } from "@/data/seed";
import { ROUTES } from "@/routes";

const VALUES = [
  { icon: Leaf, title: "Natural Farming", desc: "Responsible, sustainable practices at every step." },
  { icon: Heart, title: "Caring for Our Hens", desc: "Space, comfort and a natural environment to thrive." },
  { icon: ShieldCheck, title: "Trust You Can Taste", desc: "Hygiene, freshness and food safety, always." },
];

export default function About() {
  const { data: settings } = useSettings();
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about Mallanna Farms — a natural, sustainable free-range egg farm committed to healthy hens, honest farming and fresh eggs for every family."
        path="/about"
      />
      <PageHero
        eyebrow="About Us"
        title="Rooted in Nature, Raised with Care"
        subtitle="Mallanna Farms is a family-run free-range egg farm built on honest, natural farming practices."
        image={FARM_IMAGES.f6}
      />

      <Section tone="white">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading align="left" eyebrow="Our Story" title="Healthier Food Begins with Healthier Farming" />
            <p className="text-base leading-relaxed text-forest-700 sm:text-lg">{settings.about_content}</p>
            <p className="mt-4 text-base leading-relaxed text-forest-700 sm:text-lg">
              We believe healthier food begins with healthier birds, natural surroundings, and responsible farming
              practices — so every tray of eggs that leaves our farm carries that care with it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <NavLink to={ROUTES.mission} className="btn-secondary">
                Our Mission
              </NavLink>
              <NavLink to={ROUTES.farm} className="btn-secondary">
                Our Farm
              </NavLink>
            </div>
          </div>
          <FarmImage src={FARM_IMAGES.f4} alt="Hens at Mallanna Farms" aspect="aspect-[4/3]" rounded="rounded-3xl" className="shadow-lift" />
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="What We Believe" title="Values That Guide Every Egg" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card px-6 py-9 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-forest-900">{title}</h3>
              <p className="mt-2 text-sm text-forest-600">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="forest">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl italic text-cream-50 sm:text-3xl">
            “{settings.tagline_secondary}”
          </p>
        </div>
      </Section>
    </>
  );
}
