import {
  Award,
  Handshake,
  LineChart,
  Megaphone,
  Network,
  Package,
  Rocket,
  ShoppingCart,
  Store,
  Target,
  TrendingUp,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import FarmImage from "@/components/ui/FarmImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";
import { FARM_IMAGES, FOUNDER_IMAGE } from "@/data/seed";

const WHAT_I_BRING = [
  { icon: Award, text: "20+ years of Sales & Public Relations experience" },
  { icon: Package, text: "Expertise across multiple FMCG and consumer categories" },
  { icon: Store, text: "South India Modern Trade experience" },
  { icon: ShoppingCart, text: "E-Commerce & Quick Commerce expertise" },
  { icon: TrendingUp, text: "Regional Modern Trade market development" },
  { icon: LineChart, text: "Sales growth and business expansion" },
  { icon: Megaphone, text: "Brand building and activation" },
  { icon: Rocket, text: "New product launches" },
  { icon: Network, text: "Market development and channel management" },
  { icon: Handshake, text: "Strong customer, distributor, and trade relationships" },
  { icon: Target, text: "Strategic business development and execution" },
];

export default function About() {
  const { data: settings } = useSettings();

  return (
    <>
      <Seo
        title="About Us"
        description="Meet the person behind Mallanna Farms — 20 years of Sales & Public Relations experience across FMCG, and the mission and vision behind our free-range eggs."
        path="/about"
      />
      {/* 1. Client Introduction */}
      <Section tone="white" className="pt-28 sm:pt-32">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="mx-auto w-full max-w-xs lg:mx-0">
            <FarmImage
              src={settings.founder_image || FOUNDER_IMAGE}
              alt="Founder of Mallanna Farms"
              aspect="aspect-[4/5]"
              rounded="rounded-3xl"
              className="shadow-lift"
            />
          </div>
          <div>
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-current opacity-60" />
              About the Client
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">
              20 Years in Sales &amp; Public Relations
            </h1>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-forest-700 sm:text-lg">
              {(settings.founder_intro ?? "").split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 2. About the Client — Professional Experience & Expertise */}
      <Section tone="cream">
        <SectionHeading align="left" eyebrow="My Experience" title="About the Client" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-base leading-relaxed text-forest-700 sm:text-lg">
            {(settings.founder_experience ?? "").split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-forest-900">What I Bring</h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {WHAT_I_BRING.map(({ icon: Icon, text }) => (
                <li key={text} className="card flex items-start gap-3 px-4 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm leading-snug text-forest-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {settings.founder_vision_quote && (
          <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-gold-200 bg-gradient-to-br from-white to-gold-50 px-8 py-10 text-center shadow-card">
            <p className="font-display text-xl italic leading-snug text-forest-900 sm:text-2xl">
              “{settings.founder_vision_quote}”
            </p>
          </div>
        )}
      </Section>

      {/* 3. Mission & Vision */}
      <Section tone="white">
        <SectionHeading eyebrow="Mission & Vision" title="What Drives Mallanna Farms" />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-display text-2xl font-semibold text-forest-900">{settings.mission_title || "Our Mission"}</h3>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-forest-700">
              {(settings.mission_content ?? "").split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <FarmImage src={settings.mission_image || FARM_IMAGES.henWithBasket} alt="Our mission at Mallanna Farms" aspect="aspect-[4/3]" rounded="rounded-3xl" className="shadow-lift" />
        </div>

        <div className="my-14 flex items-center justify-center gap-4 text-forest-300" aria-hidden="true">
          <span className="h-px w-16 bg-forest-200" />
          <span className="text-2xl">🌿</span>
          <span className="h-px w-16 bg-forest-200" />
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FarmImage
            src={settings.vision_image || FARM_IMAGES.eggsInHay}
            alt="Our vision at Mallanna Farms"
            aspect="aspect-[4/3]"
            rounded="rounded-3xl"
            className="order-2 shadow-lift lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <h3 className="font-display text-2xl font-semibold text-forest-900">{settings.vision_title || "Our Vision"}</h3>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-forest-700">
              {(settings.vision_content ?? "").split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="forest">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl italic text-cream-50 sm:text-3xl">“{settings.vision_statement}”</p>
        </div>
      </Section>
    </>
  );
}
