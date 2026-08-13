import { useEffect, useState } from "react";
import { PlayCircle, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import FarmImage from "@/components/ui/FarmImage";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getVideos } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import type { VideoItem } from "@/lib/database.types";

type Status = "loading" | "ready" | "error";

function toEmbedUrl(url: string) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default function Videos() {
  const [status, setStatus] = useState<Status>("loading");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  const load = () => {
    setStatus("loading");
    getVideos()
      .then((res) => {
        setVideos(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  return (
    <>
      <Seo
        title="Videos"
        description="Watch videos from Mallanna Farms — see our free-range hens, natural farming practices and daily farm life."
        path="/videos"
      />
      <PageHero eyebrow="Videos" title="Watch Life at Mallanna Farms" image={FARM_IMAGES.orchardHens} />

      <Section tone="cream">
        {status === "loading" && <CardSkeleton count={6} />}
        {status === "error" && <ErrorState onRetry={load} />}
        {status === "ready" && videos.length === 0 && (
          <EmptyState
            icon={PlayCircle}
            title="No videos yet"
            message="Videos added in the admin dashboard will appear here soon."
          />
        )}
        {status === "ready" && videos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <button
                key={v.id}
                onClick={() => setPlaying(v)}
                className="card group overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
              >
                <div className="relative">
                  <FarmImage src={v.thumbnail_url ?? FARM_IMAGES.henCloseup} alt={v.title} aspect="aspect-video" />
                  <span className="absolute inset-0 flex items-center justify-center bg-forest-950/25 transition-colors group-hover:bg-forest-950/40">
                    <PlayCircle className="h-14 w-14 text-cream-50 drop-shadow-lg" />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-forest-900">{v.title}</h3>
                  {v.description && <p className="mt-1 line-clamp-2 text-sm text-forest-600">{v.description}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {playing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-950/90 p-4 animate-fadeIn safe-top safe-bottom"
          onClick={() => setPlaying(null)}
        >
          <button
            onClick={() => setPlaying(null)}
            aria-label="Close video"
            className="absolute right-4 top-4 rounded-full bg-cream-50/10 p-2.5 text-cream-50 hover:bg-cream-50/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full bg-black">
              {/\.(mp4|webm|ogg)$/i.test(playing.video_url) ? (
                <video src={playing.video_url} controls autoPlay className="h-full w-full" />
              ) : (
                <iframe
                  src={toEmbedUrl(playing.video_url)}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              )}
            </div>
            <div className="bg-forest-900 p-4">
              <h2 className="font-display text-lg font-semibold text-cream-50">{playing.title}</h2>
              {playing.description && <p className="mt-1 text-sm text-cream-100/80">{playing.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
