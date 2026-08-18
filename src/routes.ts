// Central route map — single source of truth for navigation, the sitemap
// generator, and internal links.

export const ROUTES = {
  home: "/",
  about: "/about",
  mission: "/mission",
  vision: "/vision",
  missionVision: "/mission-vision",
  farm: "/our-farm",
  products: "/products",
  productDetail: (slug: string) => `/products/${slug}`,
  checkout: "/checkout",
  wishlist: "/wishlist",
  gallery: "/gallery",
  videos: "/videos",
  whyChooseUs: "/why-choose-us",
  whyFreeRange: "/why-free-range",
  delivery: "/delivery",
  contact: "/contact",
  faq: "/faq",
  privacy: "/privacy-policy",
  terms: "/terms-conditions",
} as const;

export const PRIMARY_NAV = [
  { label: "Home", to: ROUTES.home },
  { label: "Our Eggs", to: ROUTES.products },
  { label: "About Us", to: ROUTES.about },
  { label: "Contact", to: ROUTES.contact },
];

export const MOBILE_EXTRA_NAV = [
  { label: "Why Free Range?", to: ROUTES.whyFreeRange },
  { label: "Gallery", to: ROUTES.gallery },
  { label: "Videos", to: ROUTES.videos },
  { label: "FAQ", to: ROUTES.faq },
];

