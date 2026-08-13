import { Phone, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useSettings } from "@/hooks/useSettings";
import { getCallUrl, getMapsUrl, getWhatsAppUrl } from "@/lib/floatingContact";

interface FabConfig {
  key: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}

/**
 * Floating WhatsApp / Call / Location buttons, fixed to the bottom-right of
 * every public page. Numbers and the maps link are configured centrally in
 * /admin → Settings (see src/lib/floatingContact.ts for the fallback logic)
 * — nothing here is hard-coded per page.
 */
export default function FloatingActionButtons() {
  const { data: settings } = useSettings();

  const whatsappUrl = getWhatsAppUrl(settings);
  const callUrl = getCallUrl(settings);
  const mapsUrl = getMapsUrl(settings);

  const buttons: FabConfig[] = [];
  if (whatsappUrl) {
    buttons.push({ key: "whatsapp", href: whatsappUrl, label: "WhatsApp", icon: <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6" />, external: true });
  }
  if (callUrl) {
    buttons.push({ key: "call", href: callUrl, label: "Call", icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6" /> });
  }
  if (mapsUrl) {
    buttons.push({ key: "location", href: mapsUrl, label: "Location", icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />, external: true });
  }

  if (buttons.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      aria-label="Quick contact"
    >
      {buttons.map((btn) => (
        <div key={btn.key} className="group relative flex items-center">
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-forest-900 px-3 py-1.5 text-xs font-medium text-cream-50 opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {btn.label}
          </span>
          <a
            href={btn.href}
            target={btn.external ? "_blank" : undefined}
            rel={btn.external ? "noopener noreferrer" : undefined}
            aria-label={btn.label}
            title={btn.label}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest-700 shadow-lift ring-1 ring-forest-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 hover:text-cream-50 active:translate-y-0 sm:h-14 sm:w-14"
          >
            {btn.icon}
          </a>
        </div>
      ))}
    </div>
  );
}
