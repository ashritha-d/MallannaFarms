import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_URL = "https://www.mallannafarms.com";
const JSON_LD_ID = "seo-jsonld";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Sets per-page document title, meta description, OG/Twitter tags, canonical URL and optional JSON-LD. */
export default function Seo({ title, description, path = "", image = "/assets/farm/f1.jpeg", type = "website", jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes("Mallanna Farms") ? title : `${title} | Mallanna Farms`;
    document.title = fullTitle;

    setMeta("name", "description", description);
    setLink("canonical", `${SITE_URL}${path}`);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `${SITE_URL}${path}`);
    setMeta("property", "og:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);
    setMeta("property", "og:type", type);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);

    let scriptEl = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = JSON_LD_ID;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, path, image, type, jsonLd]);

  return null;
}
