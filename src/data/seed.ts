// Local fallback/seed content shown on the public site until a Supabase
// project is connected and real data is entered through /admin. Everything
// here uses the actual uploaded farm photography — nothing is stock or
// AI-generated. Once Supabase is connected, live database rows replace this
// automatically (see src/data/content.ts).

import type { Faq, GalleryItemWithMedia, Product, ProductWithGallery, VideoItem } from "@/lib/database.types";

export const FARM_IMAGES = {
  hero: "/assets/farm/f2.jpeg",
  f1: "/assets/farm/f1.jpeg",
  f2: "/assets/farm/f2.jpeg",
  f3: "/assets/farm/f3.jpeg",
  f4: "/assets/farm/f4.jpeg",
  f5: "/assets/farm/f5.jpeg",
  f6: "/assets/farm/f6.jpeg",
  f7: "/assets/farm/f7.jpeg",
  f8: "/assets/farm/f8.jpeg",
  f9: "/assets/farm/f9.jpeg",
};

export const LOGO = {
  primary: "/assets/logo/logoF.jpeg",
  alt1: "/assets/logo/logo.jpeg",
  alt2: "/assets/logo/logo2.jpeg",
  alt3: "/assets/logo/logo3.jpeg",
};

export const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "Mallanna Farms",
  tagline_primary: "Naturally Raised. Freshly Delivered. Made for Healthy Families.",
  tagline_secondary: "From our farm, with care — naturally nourishing every family.",

  hero_heading: "Mallanna Farms",
  hero_subheading: "Free Range Eggs",
  hero_tagline: "Naturally Raised. Freshly Delivered. Made for Healthy Families.",
  hero_image: FARM_IMAGES.hero,
  hero_cta_primary_label: "Explore Our Eggs",
  hero_cta_primary_link: "/products",
  hero_cta_secondary_label: "Visit Our Farm",
  hero_cta_secondary_link: "/our-farm",

  about_content:
    "Mallanna Farms is committed to providing families with fresh, nutritious and naturally produced free-range eggs while caring for our hens and the environment.",
  about_image: FARM_IMAGES.f3,

  mission_title: "Our Mission",
  mission_content:
    "At Mallanna Farms, our mission is to provide families with fresh, nutritious, and naturally produced free-range eggs while caring for our hens and the environment.\n\nWe believe that healthy food begins with healthy farming. Our hens are raised in a natural, open environment with space to move freely, supported by responsible farming practices and quality nutrition.\n\nWe are committed to delivering eggs that our customers can trust—fresh from our farm, rich in nutrition, and produced with care.",
  mission_image: FARM_IMAGES.f4,

  vision_title: "Our Vision",
  vision_content:
    "At Mallanna Farms, our vision is to become a trusted name in natural and sustainable poultry farming by bringing healthy, nutritious, and high-quality free-range eggs from our farm to every family.\n\nWe believe that healthier food begins with healthier birds, natural surroundings, and responsible farming practices. Our goal is to provide eggs produced with care, while giving our hens a comfortable, natural environment to grow and thrive.\n\nWe aspire to build a future where quality, nutrition, animal well-being, and sustainability come together—supporting healthier families, stronger communities, and a greener planet.",
  vision_statement: "From our farm, with care — naturally nourishing every family.",
  vision_image: FARM_IMAGES.f5,

  // Placeholder contact details — edit these for real in /admin → Settings.
  contact_address: "Mallanna Farms, [Village/Mandal], [District], Telangana, India — [PIN]",
  contact_phone: "+91 90000 00000",
  contact_email: "hello@mallannafarms.com",
  contact_map_embed: "",

  social_instagram: "",
  social_facebook: "",
  social_whatsapp: "",
  social_youtube: "",

  footer_tagline: "Naturally Raised. Freshly Delivered. Made for Healthy Families.",
};

export const SEED_PRODUCTS: ProductWithGallery[] = [
  {
    id: "seed-1",
    name: "Mallanna Farms Free Range Eggs",
    slug: "free-range-eggs-tray-of-12",
    description:
      "Our signature free-range eggs, laid by hens raised in open, natural surroundings and fed a wholesome natural diet. Each egg is collected fresh from the farm and graded for quality before it reaches your table — rich in flavour and nutrition, the way eggs are meant to be.",
    short_description: "Fresh from our farm. Grade A. Naturally nutritious.",
    price: 120,
    discount_price: null,
    pack_size: "Tray of 12",
    egg_count: 12,
    grade: "Grade A",
    sku: "MF-EGG-12",
    barcode: null,
    category: "Free Range Eggs",
    stock_status: "in_stock",
    features: [
      "100% free-range hens",
      "Natural, open farming environment",
      "No hormones or antibiotics",
      "Collected and packed fresh",
      "Rich, deep-yellow yolk",
    ],
    nutrition: { Protein: "6g per egg", "Omega-3": "Naturally present", Vitamin_D: "Naturally present" },
    feed_info: "Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.",
    main_image_url: FARM_IMAGES.f7,
    video_url: null,
    featured: true,
    active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gallery: [],
  },
  {
    id: "seed-2",
    name: "Mallanna Farms Free Range Eggs — Family Pack",
    slug: "free-range-eggs-family-pack-30",
    description:
      "A larger family pack for households that love their eggs — 30 free-range eggs from the same trusted farm, same natural care, same freshness guarantee.",
    short_description: "30 eggs. Grade A. Great for families.",
    price: 280,
    discount_price: 260,
    pack_size: "Tray of 30",
    egg_count: 30,
    grade: "Grade A",
    sku: "MF-EGG-30",
    barcode: null,
    category: "Free Range Eggs",
    stock_status: "in_stock",
    features: [
      "100% free-range hens",
      "Best value family pack",
      "No hormones or antibiotics",
      "Collected and packed fresh",
    ],
    nutrition: { Protein: "6g per egg", "Omega-3": "Naturally present", Vitamin_D: "Naturally present" },
    feed_info: "Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.",
    main_image_url: FARM_IMAGES.f8,
    video_url: null,
    featured: true,
    active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gallery: [],
  },
  {
    id: "seed-3",
    name: "Mallanna Farms Free Range Eggs — Trial Pack",
    slug: "free-range-eggs-trial-pack-6",
    description:
      "New to Mallanna Farms? Start with our trial pack of 6 farm-fresh, free-range eggs and taste the difference natural farming makes.",
    short_description: "6 eggs. Perfect to try us out.",
    price: 65,
    discount_price: null,
    pack_size: "Tray of 6",
    egg_count: 6,
    grade: "Grade A",
    sku: "MF-EGG-06",
    barcode: null,
    category: "Free Range Eggs",
    stock_status: "in_stock",
    features: ["100% free-range hens", "Small trial size", "No hormones or antibiotics"],
    nutrition: { Protein: "6g per egg", "Omega-3": "Naturally present" },
    feed_info: "Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.",
    main_image_url: FARM_IMAGES.f9,
    video_url: null,
    featured: false,
    active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gallery: [],
  },
];

export const SEED_GALLERY: GalleryItemWithMedia[] = [
  { id: "g1", media_id: "m1", title: "Hens roaming freely", description: "Our hens enjoy open, natural surroundings every day.", category: "Free Range Hens", sort_order: 1, featured: true, active: true, created_at: new Date().toISOString(), media: { id: "m1", file_name: "f1.jpeg", file_url: FARM_IMAGES.f1, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Hens roaming freely", caption: null, alt_text: "Free range hens roaming in an open natural farm setting", description: null, category: "Free Range Hens", created_at: new Date().toISOString() } },
  { id: "g2", media_id: "m2", title: "Open green farm spaces", description: "Natural surroundings for our birds to thrive.", category: "Our Farm", sort_order: 2, featured: true, active: true, created_at: new Date().toISOString(), media: { id: "m2", file_name: "f2.jpeg", file_url: FARM_IMAGES.f2, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Open green farm spaces", caption: null, alt_text: "Open green farm spaces at Mallanna Farms", description: null, category: "Our Farm", created_at: new Date().toISOString() } },
  { id: "g3", media_id: "m3", title: "Farm life", description: "Everyday life on the farm.", category: "Farm Life", sort_order: 3, featured: false, active: true, created_at: new Date().toISOString(), media: { id: "m3", file_name: "f3.jpeg", file_url: FARM_IMAGES.f3, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Farm life", caption: null, alt_text: "Farm life at Mallanna Farms", description: null, category: "Farm Life", created_at: new Date().toISOString() } },
  { id: "g4", media_id: "m4", title: "Natural feeding practices", description: "Wholesome, natural feed for healthier hens.", category: "Farm Life", sort_order: 4, featured: false, active: true, created_at: new Date().toISOString(), media: { id: "m4", file_name: "f4.jpeg", file_url: FARM_IMAGES.f4, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Natural feeding practices", caption: null, alt_text: "Natural feeding practices at Mallanna Farms", description: null, category: "Farm Life", created_at: new Date().toISOString() } },
  { id: "g5", media_id: "m5", title: "Egg collection", description: "Fresh eggs collected daily with care.", category: "Egg Collection", sort_order: 5, featured: true, active: true, created_at: new Date().toISOString(), media: { id: "m5", file_name: "f5.jpeg", file_url: FARM_IMAGES.f5, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Egg collection", caption: null, alt_text: "Fresh free range eggs collected at Mallanna Farms", description: null, category: "Egg Collection", created_at: new Date().toISOString() } },
  { id: "g6", media_id: "m6", title: "Farm surroundings", description: "The natural, open landscape of our farm.", category: "Our Farm", sort_order: 6, featured: false, active: true, created_at: new Date().toISOString(), media: { id: "m6", file_name: "f6.jpeg", file_url: FARM_IMAGES.f6, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Farm surroundings", caption: null, alt_text: "Farm surroundings at Mallanna Farms", description: null, category: "Our Farm", created_at: new Date().toISOString() } },
  { id: "g7", media_id: "m7", title: "Farm fresh eggs", description: "Grade A eggs, ready for packaging.", category: "Products", sort_order: 7, featured: true, active: true, created_at: new Date().toISOString(), media: { id: "m7", file_name: "f7.jpeg", file_url: FARM_IMAGES.f7, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Farm fresh eggs", caption: null, alt_text: "Farm fresh free range eggs from Mallanna Farms", description: null, category: "Products", created_at: new Date().toISOString() } },
  { id: "g8", media_id: "m8", title: "Packed and ready", description: "Trays packed fresh for delivery.", category: "Packaging", sort_order: 8, featured: false, active: true, created_at: new Date().toISOString(), media: { id: "m8", file_name: "f8.jpeg", file_url: FARM_IMAGES.f8, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Packed and ready", caption: null, alt_text: "Packed eggs ready for delivery from Mallanna Farms", description: null, category: "Packaging", created_at: new Date().toISOString() } },
  { id: "g9", media_id: "m9", title: "Behind the scenes", description: "A closer look at daily farm operations.", category: "Behind the Scenes", sort_order: 9, featured: false, active: true, created_at: new Date().toISOString(), media: { id: "m9", file_name: "f9.jpeg", file_url: FARM_IMAGES.f9, file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "Behind the scenes", caption: null, alt_text: "Behind the scenes at Mallanna Farms", description: null, category: "Behind the Scenes", created_at: new Date().toISOString() } },
];

export const SEED_VIDEOS: VideoItem[] = [];

export const SEED_FAQS: Faq[] = [
  {
    id: "f1",
    question: "What does \"free range\" mean at Mallanna Farms?",
    answer:
      "Our hens are not confined to cages. They have daily access to open, natural surroundings where they can roam, forage and move freely, supported by a natural diet and responsible farming practices.",
    category: "Farming",
    sort_order: 1,
    active: true,
  },
  {
    id: "f2",
    question: "How fresh are the eggs?",
    answer:
      "Eggs are collected daily from the farm, graded for quality, and packed for delivery promptly — so every tray you receive is genuinely farm-fresh.",
    category: "Freshness",
    sort_order: 2,
    active: true,
  },
  {
    id: "f3",
    question: "Do you use hormones or antibiotics?",
    answer:
      "No. Our hens are raised without added hormones or antibiotics, on a natural diet in a natural environment.",
    category: "Quality",
    sort_order: 3,
    active: true,
  },
  {
    id: "f4",
    question: "What pack sizes are available?",
    answer:
      "We currently offer trial packs of 6, standard trays of 12, and family packs of 30 free-range eggs. Availability may vary — check the Products page for current stock.",
    category: "Products",
    sort_order: 4,
    active: true,
  },
  {
    id: "f5",
    question: "How can I place an order or ask a question?",
    answer:
      "Use the Contact page to send us a message, or reach out directly via the phone number, email or WhatsApp listed in our footer.",
    category: "Orders",
    sort_order: 5,
    active: true,
  },
];

export const FALLBACK_PRODUCT_IMAGE = FARM_IMAGES.f7;
export const FALLBACK_GALLERY_IMAGE = FARM_IMAGES.f2;
