import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Award, ChevronLeft, ChevronRight, Compass, Sprout, UserRound } from "lucide-react";
import FarmImage from "@/components/ui/FarmImage";
import { useSettings } from "@/hooks/useSettings";
import { ROUTES } from "@/routes";
import { FARM_IMAGES, FOUNDER_IMAGE } from "@/data/seed";

const AUTOPLAY_MS = 5500;
// Minimum horizontal drag (px) before a touch gesture counts as a swipe
// rather than a tap or a vertical page scroll.
const SWIPE_THRESHOLD = 40;

/** First paragraph (or first N) of a settings field, trimmed to a banner-friendly length. */
function excerpt(text: string | undefined, max = 220, paragraphs = 1): string {
  const joined = (text ?? "")
    .split("\n\n")
    .slice(0, paragraphs)
    .join(" ")
    .trim();
  if (joined.length <= max) return joined;
  const cut = joined.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}

// A component (not a shared JSX element) — the carousel keeps all slides
// mounted at once for the crossfade, so each slide needs its own distinct
// element instance rather than reusing one object in multiple tree
// positions simultaneously.
//
// `onDark` picks the secondary button's contrast variant: the photo slide
// has a light cream background (needs dark text/border), while the
// image/solid slides are dark (need light text/border) — using the wrong
// one makes the button nearly invisible against its own background.
// `compact` shrinks the buttons further for the mobile side-by-side photo
// slide, where the CTA column is only ~60% of a phone-width slide —
// reverts to the normal size from `sm:` up.
// Order is fixed across every slide — "Learn More" first (primary),
// "Shop Free Range Eggs" second — driven from this one shared component
// so it can't drift out of sync slide to slide; flex-col stacks them in
// source order on mobile too, so that's "Learn More" on top there as well.
function SlideCtas({ onDark = true, compact = false }: { onDark?: boolean; compact?: boolean }) {
  const sizing = compact
    ? "!px-2.5 !py-1.5 text-[11px] sm:!px-5 sm:!py-2.5 sm:text-sm"
    : "!px-5 !py-2.5 text-sm";
  const spacing = compact ? "mt-2 gap-1.5 sm:mt-4 sm:gap-3" : "mt-4 gap-2.5 sm:gap-3";
  return (
    <div className={`flex flex-col sm:flex-row ${spacing}`}>
      <NavLink to={ROUTES.about} className={`w-full sm:w-auto ${onDark ? "btn-outline-light" : "btn-secondary"} ${sizing}`}>
        Learn More
      </NavLink>
      <NavLink to={ROUTES.products} className={`btn-gold w-full sm:w-auto ${sizing}`}>
        Shop Free Range Eggs
      </NavLink>
    </div>
  );
}

export default function ClientCarousel() {
  const { data: settings } = useSettings();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Touch-swipe state lives in refs, not React state — it changes on every
  // touchmove and shouldn't trigger re-renders while dragging.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);
  // Swallows the synthetic click a mobile browser fires after a drag
  // release, so a swipe doesn't also trigger the CTA/dot underneath the finger.
  const suppressClick = useRef(false);

  const founderPhoto = settings.founder_image || FOUNDER_IMAGE;

  const slides = [
    {
      key: "about",
      type: "photo" as const,
      eyebrow: "About Us",
      heading: "20 Years in Sales & Public Relations",
      body: excerpt(settings.founder_intro, 260, 2),
    },
    {
      key: "mission",
      type: "image" as const,
      icon: Sprout,
      eyebrow: "Our Mission",
      heading: settings.mission_title || "Our Mission",
      body: excerpt(settings.mission_content),
      image: FARM_IMAGES.henWithBasket,
    },
    {
      key: "vision",
      type: "image" as const,
      icon: Compass,
      eyebrow: "Our Vision",
      heading: settings.vision_title || "Our Vision",
      // Same excerpt treatment as Mission below (first paragraph of the
      // full content), not the one-line vision_statement tagline — that
      // made this slide read much thinner than Mission. Full text is one
      // tap away via "Learn More" -> the About page.
      body: excerpt(settings.vision_content),
      image: FARM_IMAGES.eggsInHay,
    },
    {
      key: "experience",
      type: "solid" as const,
      icon: Award,
      eyebrow: "Our Experience",
      heading: "20+ Years in Sales & Public Relations",
      body: excerpt(settings.founder_experience, 260, 2),
      tags: ["FMCG", "Personal Care", "Home Care", "OTC", "E-Commerce", "Modern Trade"],
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

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    isSwiping.current = false;
    setPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Only latch into "swiping" once the drag is clearly horizontal —
    // otherwise a vertical page scroll that starts on the banner would
    // get misread as a slide change.
    if (!isSwiping.current && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    setPaused(false);
    if (!start) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    if (isSwiping.current) {
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        goTo(dx < 0 ? index + 1 : index - 1);
      }
      // A drag just happened — swallow the click the browser is about to
      // fire on whatever's under the finger (CTA button, dot, arrow).
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 300);
    }
    isSwiping.current = false;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      className="relative touch-pan-y overflow-hidden rounded-2xl shadow-lift sm:rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClickCapture={handleClickCapture}
      role="region"
      aria-roledescription="carousel"
      aria-label="About Mallanna Farms"
    >
      {/* Grid-overlap: every slide occupies the same cell, so the track
          auto-sizes to the tallest slide (the photo+text one on mobile)
          instead of a hand-guessed fixed height that clips content. */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index;
          const visibility = active ? "relative z-10 opacity-100" : "pointer-events-none z-0 opacity-0";

          if (slide.type === "photo") {
            return (
              <div
                key={slide.key}
                className={`col-start-1 row-start-1 flex h-full items-center bg-cream-50 transition-opacity duration-700 ease-in-out ${visibility}`}
                aria-hidden={!active}
              >
                <div className="grid w-full grid-cols-[38%_1fr] items-center gap-3 px-3 py-4 sm:grid-cols-[200px_1fr] sm:gap-8 sm:px-8 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-12 lg:py-12">
                  <div>
                    <FarmImage
                      src={founderPhoto}
                      alt="Founder of Mallanna Farms"
                      aspect="aspect-[3/4] sm:aspect-[4/5]"
                      rounded="rounded-xl sm:rounded-2xl"
                      className="w-full shadow-card"
                    />
                    {(settings.founder_name || settings.founder_title) && (
                      <div className="mt-1.5 text-center sm:mt-2.5">
                        {settings.founder_name && (
                          <p className="text-[10px] font-semibold leading-tight text-forest-900 sm:text-sm">{settings.founder_name}</p>
                        )}
                        {settings.founder_title && (
                          <p className="text-[8px] font-medium uppercase tracking-wide text-gold-600 sm:text-xs">{settings.founder_title}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="section-eyebrow !text-[10px] sm:!text-sm">
                      <UserRound className="h-3 w-3 sm:h-4 sm:w-4" />
                      {slide.eyebrow}
                    </span>
                    <h2 className="mt-1 font-display text-sm font-semibold leading-tight text-forest-900 sm:mt-2 sm:text-2xl lg:text-3xl">
                      {slide.heading}
                    </h2>
                    <p className="line-clamp-3 mt-1 max-w-xl text-[11px] leading-snug text-forest-700 sm:mt-3 sm:line-clamp-3 sm:text-base sm:leading-relaxed">
                      {slide.body}
                    </p>
                    <SlideCtas onDark={false} compact />
                  </div>
                </div>
              </div>
            );
          }

          if (slide.type === "solid") {
            return (
              <div
                key={slide.key}
                className={`col-start-1 row-start-1 flex h-full items-center bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 transition-opacity duration-700 ease-in-out ${visibility}`}
                aria-hidden={!active}
              >
                <div className="flex w-full flex-col items-center px-5 py-6 text-center text-cream-50 sm:px-10 sm:py-14 lg:py-16">
                  <span className="section-eyebrow justify-center text-gold-300">
                    <slide.icon className="h-4 w-4" />
                    {slide.eyebrow}
                  </span>
                  <h2 className="mt-2 max-w-2xl font-display text-lg font-semibold leading-tight text-cream-50 sm:mt-3 sm:text-3xl lg:text-4xl">
                    {slide.heading}
                  </h2>
                  <p className="line-clamp-3 mt-2 max-w-2xl text-xs leading-snug text-cream-100/90 sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-relaxed lg:text-lg">
                    {slide.body}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:mt-5 sm:gap-2">
                    {slide.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cream-50/25 px-2 py-0.5 text-[10px] font-medium text-cream-100/90 sm:px-3 sm:py-1 sm:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <SlideCtas compact />
                </div>
              </div>
            );
          }

          // type === "image" (Mission / Vision)
          return (
            <div
              key={slide.key}
              className={`col-start-1 row-start-1 transition-opacity duration-700 ease-in-out ${visibility}`}
              aria-hidden={!active}
            >
              <div className="relative h-full min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem]">
                <img src={slide.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/65 to-forest-950/20 sm:via-forest-950/55" />
                <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-5 py-6 text-cream-50 sm:px-10 sm:py-10 lg:px-14">
                  <span className="section-eyebrow !text-xs text-gold-300 sm:!text-sm">
                    <slide.icon className="h-4 w-4" />
                    {slide.eyebrow}
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-tight text-cream-50 sm:text-2xl lg:text-3xl">
                    {slide.heading}
                  </h2>
                  <p className="line-clamp-3 mt-2 max-w-md text-xs leading-snug text-cream-100/90 sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-relaxed">
                    {slide.body}
                  </p>
                  <SlideCtas compact />
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows — own dark backing so they stay legible over both the
            light photo slide and the dark image/solid slides. */}
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-20 col-start-1 row-start-1 hidden -translate-y-1/2 rounded-full bg-forest-950/60 p-2 text-cream-50 backdrop-blur-sm transition-colors hover:bg-forest-950/80 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-20 col-start-1 row-start-1 hidden -translate-y-1/2 rounded-full bg-forest-950/60 p-2 text-cream-50 backdrop-blur-sm transition-colors hover:bg-forest-950/80 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 z-20 col-start-1 row-start-1 flex -translate-x-1/2 gap-2 rounded-full bg-forest-950/50 px-2.5 py-1.5 backdrop-blur-sm sm:bottom-4">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              onClick={() => goTo(i)}
              aria-label={`Go to ${slide.eyebrow} slide`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-gold-400" : "w-2 bg-cream-50/60 hover:bg-cream-50/90"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
