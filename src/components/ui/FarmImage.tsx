import { useState, type ImgHTMLAttributes } from "react";
import { FALLBACK_GALLERY_IMAGE } from "@/data/seed";

interface FarmImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onError" | "src" | "alt"> {
  src: string;
  alt: string;
  fallback?: string;
  fit?: "cover" | "contain";
  rounded?: string;
  aspect?: string;
}

/** Image with lazy loading, graceful error fallback, and a soft loading shimmer. */
export default function FarmImage({
  src,
  alt,
  fallback = FALLBACK_GALLERY_IMAGE,
  fit = "cover",
  rounded = "",
  aspect = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  ...rest
}: FarmImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={`relative block overflow-hidden ${aspect} ${rounded} ${!loaded ? "bg-forest-100/70" : ""}`}>
      {!loaded && <span className="absolute inset-0 animate-pulse bg-forest-100/70" aria-hidden="true" />}
      <img
        src={errored ? fallback : src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onError={() => setErrored(true)}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...rest}
      />
    </span>
  );
}
