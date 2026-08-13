// Central route map — single source of truth for navigation, the sitemap
// generator, and internal links.

export const ROUTES = {
  home: "/",
  about: "/about",
  mission: "/mission",
  vision: "/vision",
  farm: "/our-farm",
  products: "/products",
  productDetail: (slug: string) => `/products/${slug}`,
  gallery: "/gallery",
  videos: "/videos",
  whyChooseUs: "/why-choose-us",
  contact: "/contact",
  faq: "/faq",
  privacy: "/privacy-policy",
  terms: "/terms-conditions",
} as const;

export const PRIMARY_NAV = [
  { label: "Home", to: ROUTES.home },
  { label: "About", to: ROUTES.about },
  { label: "Our Farm", to: ROUTES.farm },
  { label: "Products", to: ROUTES.products },
  { label: "Gallery", to: ROUTES.gallery },
  { label: "Videos", to: ROUTES.videos },
  { label: "Contact", to: ROUTES.contact },
];

export const MORE_NAV = [
  { label: "Our Mission", to: ROUTES.mission },
  { label: "Our Vision", to: ROUTES.vision },
  { label: "Why Choose Us", to: ROUTES.whyChooseUs },
  { label: "FAQ", to: ROUTES.faq },
];

export const FOOTER_NAV = [
  { label: "Home", to: ROUTES.home },
  { label: "About", to: ROUTES.about },
  { label: "Our Farm", to: ROUTES.farm },
  { label: "Products", to: ROUTES.products },
  { label: "Gallery", to: ROUTES.gallery },
  { label: "Videos", to: ROUTES.videos },
  { label: "Contact", to: ROUTES.contact },
];

export const FOOTER_LEGAL = [
  { label: "Privacy Policy", to: ROUTES.privacy },
  { label: "Terms & Conditions", to: ROUTES.terms },
  { label: "FAQ", to: ROUTES.faq },
];
