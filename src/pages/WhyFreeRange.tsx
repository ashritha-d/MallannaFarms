import { Link } from "react-router-dom";
import { HeartHandshake, Leaf, ShieldCheck, Wind } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FARM_IMAGES } from "@/data/seed";
import { ROUTES } from "@/routes";

const POINTS = [
  {
    icon: Wind,
    title: "Natural Movement",
    desc: "Hens have room to move and behave naturally, instead of being confined to cages.",
  },
  {
    icon: Leaf,
    title: "Natural Environment",
    desc: "Open spaces, sunlight, greenery and fresh air are part of daily life on the farm.",
  },
  {
    icon: HeartHandshake,
    title: "Responsible Nutrition",
    desc: "Quality nutrition supports healthy birds, which in turn supports healthy eggs.",
  },
  {
    icon: ShieldCheck,
    title: "Freshness You Can Trust",
    desc: "Eggs are carefully handled from collection to packing, farm to family.",
  },
];

export default function WhyFreeRange() {
  return (
    <>
      <Seo
        title="Why Free Range?"
        description="What free range really means at Mallanna Farms — natural movement, open surroundings, responsible nutrition and freshness you can trust."
        path="/why-free-range"
      />
      <PageHero eyebrow="Why Free Range?" title="Why Free Range?" subtitle="Better care for our hens means better eggs for your family." image={FARM_IMAGES.orchardHens} />

      <Section tone="cream">
        <SectionHeading eyebrow="The Difference" title="What Free Range Really Means" align="left" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {POINTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card flex gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-forest-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-forest-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-forest-500">
          We keep our claims honest: we don't promise specific medical or nutritional outcomes — just hens raised with
          more space, more natural surroundings, and more care.
        </p>
        <div className="mt-8 text-center">
          <Link to={ROUTES.products} className="btn-primary">
            Shop Free Range Eggs
          </Link>
        </div>
      </Section>
    </>
  );
}
