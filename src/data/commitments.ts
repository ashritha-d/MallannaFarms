import { FARM_IMAGES } from "@/data/seed";

// "Happy & Healthy Hens" uses a real Natu Kodi (native/country chicken)
// photo instead of the generic white-hen emoji the other four still use.
export const COMMITMENTS = [
  { image: FARM_IMAGES.natuKodi, title: "Happy & Healthy Hens", desc: "Giving our birds a natural environment and proper care." },
  { emoji: "🌱", title: "Natural Farming", desc: "Promoting responsible and sustainable farming practices." },
  { emoji: "🥚", title: "Fresh & Nutritious Eggs", desc: "Delivering quality eggs from farm to family." },
  { emoji: "❤️", title: "Quality & Trust", desc: "Maintaining high standards of hygiene, freshness, and food safety." },
  { emoji: "🌍", title: "Sustainable Future", desc: "Farming responsibly for our customers, animals, and environment." },
] as const;
