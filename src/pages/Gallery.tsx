import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import FarmImage from "@/components/ui/FarmImage";
import Lightbox from "@/components/ui/Lightbox";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getGallery } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import type { GalleryItemWithMedia } from "@/lib/apiTypes";

type Status = "loading" | "ready" | "error";

export default function Gallery() {
  const [status, setStatus] = useState<Status>("loading");
  const [items, setItems] = useState<GalleryItemWithMedia[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const load = () => {
    setStatus("loading");
    getGallery()
      .then((res) => {
        setItems(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const filtered = useMemo(
    () => (activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory]
  );

  const slides = filtered.map((g) => ({
    src: g.media?.file_url ?? "",
    alt: g.media?.alt_text ?? g.title ?? "Mallanna Farms gallery photo",
    caption: g.title,
  }));

  return (
    <>
      <Seo
        title="Gallery"
        description="Explore the Mallanna Farms photo gallery — free range hens, open farm spaces, egg collection, packaging and behind-the-scenes farm life."
        path="/gallery"
      />
      <PageHero eyebrow="Gallery" title="A Visual Journey Through Mallanna Farms" image={FARM_IMAGES.orchardHens} />

      <Section tone="cream">
        {status === "loading" && <CardSkeleton count={8} />}
        {status === "error" && <ErrorState onRetry={load} />}

        {status === "ready" && (
          <>
            {items.length === 0 ? (
              <EmptyState title="No gallery images yet" message="Photos added in the admin gallery will appear here." />
            ) : (
              <>
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        activeCategory === cat
                          ? "bg-forest-800 text-cream-50"
                          : "bg-white text-forest-700 hover:bg-forest-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <EmptyState title="No photos in this category" />
                ) : (
                  <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
                    {filtered.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => setLightboxIndex(i)}
                        className="group relative block w-full overflow-hidden rounded-2xl shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                        aria-label={`View ${item.title ?? "photo"} full-screen`}
                      >
                        <FarmImage
                          src={item.media?.file_url ?? ""}
                          alt={item.media?.alt_text ?? item.title ?? "Mallanna Farms"}
                          fit="cover"
                          className="w-full transition-transform duration-500 group-hover:scale-105"
                        />
                        {item.title && (
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/80 to-transparent p-3 text-left text-xs font-medium text-cream-50 opacity-0 transition-opacity group-hover:opacity-100">
                            {item.title}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Section>

      {lightboxIndex !== null && (
        <Lightbox slides={slides} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </>
  );
}
