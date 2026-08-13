import {
  Egg,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Images,
  Settings as SettingsIcon,
  Share2,
  UserCircle,
  Video,
} from "lucide-react";

export const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Egg },
  { label: "Media Library", to: "/admin/media", icon: ImageIcon },
  { label: "Gallery", to: "/admin/gallery", icon: Images },
  { label: "Videos", to: "/admin/videos", icon: Video },
  { label: "Homepage & Pages", to: "/admin/content", icon: FileText },
  { label: "FAQs", to: "/admin/faqs", icon: HelpCircle },
  { label: "Enquiries", to: "/admin/enquiries", icon: Inbox },
  { label: "Settings", to: "/admin/settings", icon: SettingsIcon },
  { label: "Social Links", to: "/admin/social", icon: Share2 },
  { label: "Profile", to: "/admin/profile", icon: UserCircle },
];
