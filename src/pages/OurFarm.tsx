import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Leaf, PlayCircle, Sprout, Users } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import FarmImage from "@/components/ui/FarmImage";
import Lightbox from "@/components/ui/Lightbox";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { getGallery, getVideos } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import { ROUTES } from "@/routes";
import type { GalleryItemWithMedia, VideoItem } from "@/lib/database.types";

const PRACTICES = [
  { icon: Sprout, title: "Hens Roaming Freely", desc: "Daily access to open, natural surroundings for our birds." },
  { icon: Leaf, title: "Natural Feeding", desc: "A wholesome, balanced diet with open pasture foraging." },
  { icon: Users, title: "Careful Egg Collection", desc: "Eggs collected fresh and handled with care by our farm team." },
];

export default function OurFarm() {
  const [gallery, setGallery] = useState<GalleryItemWithMedia[] | null>(null);
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getGallery().then((res) => setGallery(res.data));
    getVideos().then((res) => setVideos(res.data));
  }, []);

  const slides = (gallery ?? []).map((g) => ({
    src: g.media?.file_url ?? "",
    alt: g.media?.alt_text ?? g.title ?? "Mallanna Farms",
    caption: g.title,
  }));

  return (
    <>
      <Seo
        title="Our Farm"
        description="Step inside Mallanna Farms — see how our hens roam freely, how we feed them naturally, and how eggs are collected and cared for every day."
        path="/our-farm"
      />
      <PageHero
        eyebrow="Our Farm"
        title="Life on Mallanna Farms"
        subtitle="An open, natural home for our hens — and the source of every fresh egg we deliver."
        image={FARM_IMAGES.farmGate}
      />

      <Section tone="white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PRACTICES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card px-6 py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-forest-900">{title}</h3>
              <p className="mt-2 text-sm text-forest-600">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Farm Gallery" title="A Closer Look at Our Farm" description="Tap any photo for a full-screen view." />
        {gallery === null ? (
          <CardSkeleton count={6} />
        ) : gallery.length === 0 ? (
          <EmptyState title="No farm photos yet" message="Photos added in the admin gallery will appear here." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(i)}
                className="group relative overflow-hidden rounded-2xl shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                aria-label={`View ${item.title ?? "photo"} full-screen`}
              >
                <FarmImage
                  src={item.media?.file_url ?? ""}
                  alt={item.media?.alt_text ?? item.title ?? "Mallanna Farms"}
                  aspect="aspect-square"
                  className="transition-transform duration-500 group-hover:scale-110"
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
        <div className="mt-8 text-center">
          <NavLink to={ROUTES.gallery} className="btn-secondary">
            View Full Gallery
          </NavLink>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Farm Videos" title="Watch Life on the Farm" />
        {videos === null ? (
          <CardSkeleton count={3} />
        ) : videos.length === 0 ? (
          <EmptyState
            icon={PlayCircle}
            title="No videos yet"
            message="Farm videos uploaded in the admin dashboard will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <div key={v.id} className="card overflow-hidden">
                <FarmImage src={v.thumbnail_url ?? FARM_IMAGES.henCloseup} alt={v.title} aspect="aspect-video" />
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-forest-900">{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <NavLink to={ROUTES.videos} className="btn-secondary">
            View All Videos
          </NavLink>
        </div>
      </Section>

      {lightboxIndex !== null && (
        <Lightbox slides={slides} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </>
  );
}
