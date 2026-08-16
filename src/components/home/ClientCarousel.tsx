import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Award, ChevronLeft, ChevronRight, Compass, Sprout, UserRound } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ROUTES } from "@/routes";
import { FARM_IMAGES, FOUNDER_IMAGE } from "@/data/seed";

const AUTOPLAY_MS = 5500;

/** First paragraph of a settings field, trimmed to a banner-friendly length. */
function excerpt(text: string | undefined, max = 200): string {
  const first = (text ?? "").split("\n\n")[0]?.trim() ?? "";
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}

export default function ClientCarousel() {
  const { data: settings } = useSettings();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = [
    {
      key: "about",
      icon: UserRound,
      eyebrow: "About Us",
      heading: "The People Behind Mallanna Farms",
      body: excerpt(settings.founder_intro),
      image: FARM_IMAGES.farmerWithBasket,
      imagePosition: "object-center",
    },
    {
      key: "mission",
      icon: Sprout,
      eyebrow: "Our Mission",
      heading: settings.mission_title || "Our Mission",
      body: excerpt(settings.mission_content),
      image: FARM_IMAGES.henWithBasket,
      imagePosition: "object-center",
    },
    {
      key: "vision",
      icon: Compass,
      eyebrow: "Our Vision",
      heading: settings.vision_title || "Our Vision",
      body: settings.vision_statement || excerpt(settings.vision_content),
      image: FARM_IMAGES.eggsInHay,
      imagePosition: "object-center",
    },
    {
      key: "experience",
      icon: Award,
      eyebrow: "Our Experience",
      heading: "20+ Years in Sales & Public Relations",
      body: excerpt(settings.founder_experience, 170),
      image: settings.founder_image || FOUNDER_IMAGE,
      // Portrait headshot forced into a wide banner — bias the crop toward
      // the top so the face stays in frame instead of centering on the torso.
      imagePosition: "object-[50%_22%]",
    },
  ];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, slides.length]);

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section
      className="relative overflow-hidden rounded-2xl shadow-lift sm:rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="About Mallanna Farms"
    >
      <div className="relative h-72 sm:h-80 lg:h-96">
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover ${slide.imagePosition}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/65 to-forest-950/20 sm:via-forest-950/55" />

            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-5 py-4 text-cream-50 sm:px-10 sm:py-6 lg:px-14">
              <span className="section-eyebrow text-gold-300">
                <slide.icon className="h-4 w-4" />
                {slide.eyebrow}
              </span>
              <h2 className="line-clamp-2 mt-2 font-display text-xl font-semibold leading-tight text-cream-50 sm:text-2xl lg:text-3xl">
                {slide.heading}
              </h2>
              <p className="line-clamp-2 mt-2 max-w-md text-sm leading-relaxed text-cream-100/90 sm:mt-3 sm:line-clamp-3 sm:text-base">
                {slide.body}
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <NavLink to={ROUTES.products} className="btn-gold !px-5 !py-2.5 text-sm w-full sm:w-auto">
                  Shop Free Range Eggs
                </NavLink>
                <NavLink to={ROUTES.about} className="btn-outline-light !px-5 !py-2.5 text-sm w-full sm:w-auto">
                  Learn More
                </NavLink>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-cream-50/10 p-2 text-cream-50 backdrop-blur-sm transition-colors hover:bg-cream-50/25 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-cream-50/10 p-2 text-cream-50 backdrop-blur-sm transition-colors hover:bg-cream-50/25 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-4">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              onClick={() => goTo(i)}
              aria-label={`Go to ${slide.eyebrow} slide`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-gold-400" : "w-2 bg-cream-50/50 hover:bg-cream-50/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
