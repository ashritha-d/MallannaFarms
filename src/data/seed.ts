// Local fallback/seed content shown on the public site until a Supabase
// project is connected and real data is entered through /admin. Once
// Supabase is connected, live database rows replace this automatically
// (see src/data/content.ts).
//
// Image sourcing note: the uploaded "f1–f9" files turned out to be mostly
// composite marketing mockups (logo concept sheets, packaging renders, a
// multi-panel moodboard) rather than individual candid farm photos. The
// images below (hen-closeup.jpg, farm-gate-entrance.jpg, etc.) are cropped
// directly from the clean, text-free photo panels inside those uploads —
// real pixels from the user's own assets, just isolated from the
// surrounding collage grid/captions so they read well as standalone photos.
// One uploaded file (f7.jpeg) was a screenshot of an unrelated third-party
// business's website and is intentionally not used anywhere on the site.

import type { Faq, GalleryItemWithMedia, Product, ProductWithGallery, VideoItem } from "@/lib/database.types";

export const FARM_IMAGES = {
  hero: "/assets/farm/hen-with-egg-basket.jpg",
  henCloseup: "/assets/farm/hen-closeup.jpg",
  henWithBasket: "/assets/farm/hen-with-egg-basket.jpg",
  eggsInHay: "/assets/farm/eggs-in-basket-hay.jpg",
  farmGate: "/assets/farm/farm-gate-entrance.jpg",
  eggCartonBowl: "/assets/farm/egg-carton-and-bowl.jpg",
  orchardHens: "/assets/farm/hens-in-orchard.jpg",
  cartonCloseup: "/assets/farm/mallanna-carton-closeup.jpg",
  farmerWithBasket: "/assets/farm/farmer-with-basket.jpg",
  packagingBox: "/assets/farm/f6.jpeg",
  packagingCartons: "/assets/farm/f5.jpeg",
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
  about_image: FARM_IMAGES.farmerWithBasket,

  mission_title: "Our Mission",
  mission_content:
    "At Mallanna Farms, our mission is to provide families with fresh, nutritious, and naturally produced free-range eggs while caring for our hens and the environment.\n\nWe believe that healthy food begins with healthy farming. Our hens are raised in a natural, open environment with space to move freely, supported by responsible farming practices and quality nutrition.\n\nWe are committed to delivering eggs that our customers can trust—fresh from our farm, rich in nutrition, and produced with care.",
  mission_image: FARM_IMAGES.henWithBasket,

  vision_title: "Our Vision",
  vision_content:
    "At Mallanna Farms, our vision is to become a trusted name in natural and sustainable poultry farming by bringing healthy, nutritious, and high-quality free-range eggs from our farm to every family.\n\nWe believe that healthier food begins with healthier birds, natural surroundings, and responsible farming practices. Our goal is to provide eggs produced with care, while giving our hens a comfortable, natural environment to grow and thrive.\n\nWe aspire to build a future where quality, nutrition, animal well-being, and sustainability come together—supporting healthier families, stronger communities, and a greener planet.",
  vision_statement: "From our farm, with care — naturally nourishing every family.",
  vision_image: FARM_IMAGES.eggsInHay,

  // Address, nutrition facts, FSSAI license and barcode below are taken
  // directly from the farm's own uploaded packaging artwork (f6.jpeg).
  // Phone and email were not legible on the artwork (the phone number was
  // shown redacted as placeholder Xs), so those remain placeholders —
  // edit them for real in /admin → Settings.
  contact_address: "Sy. No. 174/2/2, Thallasingaram Village, Choutuppal Municipality, Yadadri Bhuvanagiri District, Telangana – 508252",
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
    barcode: "8906199682345",
    category: "Free Range Eggs",
    stock_status: "in_stock",
    features: [
      "100% free-range hens",
      "Natural, open farming environment",
      "No hormones or antibiotics",
      "Collected and packed fresh",
      "FSSAI licensed (Lic. No. 13624010001234)",
    ],
    nutrition: {
      Energy: "143 kcal",
      Protein: "12.6 g",
      Total_Fat: "9.5 g",
      Carbohydrate: "0.7 g",
      Cholesterol: "372 mg",
    },
    feed_info: "Fed a natural, balanced diet with free access to grain, greens and open pasture foraging. Nutrition values shown per 100g of egg, as printed on our packaging.",
    main_image_url: FARM_IMAGES.eggCartonBowl,
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
    nutrition: { Energy: "143 kcal", Protein: "12.6 g", Total_Fat: "9.5 g", Carbohydrate: "0.7 g", Cholesterol: "372 mg" },
    feed_info: "Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.",
    main_image_url: FARM_IMAGES.cartonCloseup,
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
    nutrition: { Energy: "143 kcal", Protein: "12.6 g", Cholesterol: "372 mg" },
    feed_info: "Fed a natural, balanced diet with free access to grain, greens and open pasture foraging.",
    main_image_url: FARM_IMAGES.eggsInHay,
    video_url: null,
    featured: false,
    active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gallery: [],
  },
];

function galleryItem(
  id: string,
  fileName: string,
  url: string,
  title: string,
  category: string,
  featured = false
): GalleryItemWithMedia {
  return {
    id,
    media_id: `m-${id}`,
    title,
    description: null,
    category,
    sort_order: Number(id.replace(/\D/g, "")) || 0,
    featured,
    active: true,
    created_at: new Date().toISOString(),
    media: {
      id: `m-${id}`,
      file_name: fileName,
      file_url: url,
      file_type: "image",
      mime_type: "image/jpeg",
      file_size: 0,
      title,
      caption: null,
      alt_text: `${title} — Mallanna Farms`,
      description: null,
      category,
      created_at: new Date().toISOString(),
    },
  };
}

export const SEED_GALLERY: GalleryItemWithMedia[] = [
  galleryItem("g1", "hen-closeup.jpg", FARM_IMAGES.henCloseup, "One of our free-range hens", "Free Range Hens", true),
  galleryItem("g2", "hen-with-egg-basket.jpg", FARM_IMAGES.henWithBasket, "Hen beside a fresh basket of eggs", "Free Range Hens", true),
  galleryItem("g3", "hens-in-orchard.jpg", FARM_IMAGES.orchardHens, "Hens roaming freely under the trees", "Farm Life", false),
  galleryItem("g4", "farm-gate-entrance.jpg", FARM_IMAGES.farmGate, "The entrance to Mallanna Farms", "Our Farm", true),
  galleryItem("g5", "farmer-with-basket.jpg", FARM_IMAGES.farmerWithBasket, "Carrying home a fresh harvest of eggs", "Behind the Scenes", false),
  galleryItem("g6", "eggs-in-basket-hay.jpg", FARM_IMAGES.eggsInHay, "Freshly collected eggs", "Egg Collection", true),
  galleryItem("g7", "egg-carton-and-bowl.jpg", FARM_IMAGES.eggCartonBowl, "Mallanna Farms eggs, ready to deliver", "Products", true),
  galleryItem("g8", "mallanna-carton-closeup.jpg", FARM_IMAGES.cartonCloseup, "A closer look at our packaging", "Packaging", false),
  galleryItem("g9", "f6.jpeg", FARM_IMAGES.packagingBox, "Our egg carton — front, side and back", "Packaging", false),
  galleryItem("g10", "f5.jpeg", FARM_IMAGES.packagingCartons, "Trays ready for delivery", "Packaging", false),
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

export const FALLBACK_PRODUCT_IMAGE = FARM_IMAGES.eggCartonBowl;
export const FALLBACK_GALLERY_IMAGE = FARM_IMAGES.henCloseup;
