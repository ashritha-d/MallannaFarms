import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FALLBACK_GALLERY_IMAGE } from "@/data/seed";

export interface LightboxSlide {
  src: string;
  alt: string;
  caption?: string | null;
}

export default function Lightbox({
  slides,
  index,
  onClose,
  onNavigate,
}: {
  slides: LightboxSlide[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const goPrev = useCallback(() => onNavigate((index - 1 + slides.length) % slides.length), [index, slides.length, onNavigate]);
  const goNext = useCallback(() => onNavigate((index + 1) % slides.length), [index, slides.length, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-forest-950/95 backdrop-blur-sm animate-fadeIn safe-top safe-bottom"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute right-3 top-3 z-10 rounded-full bg-cream-50/10 p-2.5 text-cream-50 hover:bg-cream-50/20 sm:right-6 sm:top-6"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => e.stopPropagation()}>
        {slides.length > 1 && (
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream-50/10 p-2 text-cream-50 hover:bg-cream-50/20 sm:left-6 sm:p-3"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <img
          src={slide.src}
          alt={slide.alt}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_GALLERY_IMAGE;
          }}
          className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-lift sm:max-h-[80vh]"
        />
        {slides.length > 1 && (
          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream-50/10 p-2 text-cream-50 hover:bg-cream-50/20 sm:right-6 sm:p-3"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {(slide.caption || slides.length > 1) && (
        <div className="px-4 pb-6 text-center text-cream-100">
          {slide.caption && <p className="text-sm sm:text-base">{slide.caption}</p>}
          {slides.length > 1 && (
            <p className="mt-1 text-xs text-cream-100/60">
              {index + 1} / {slides.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
