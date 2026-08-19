import { NavLink } from "react-router-dom";
import { ExternalLink, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { LOGO } from "@/data/seed";
import { useSettings } from "@/hooks/useSettings";
import { getMapsUrl } from "@/lib/floatingContact";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Footer() {
  const { data: settings } = useSettings();
  const mapsUrl = getMapsUrl(settings);

  const socialLinks = [
    { key: "social_instagram", icon: Instagram, label: "Instagram" },
    { key: "social_facebook", icon: Facebook, label: "Facebook" },
    { key: "social_whatsapp", icon: WhatsAppIcon, label: "WhatsApp" },
  ].filter((s) => settings[s.key]);

  return (
    <footer className="bg-forest-900 text-cream-100">
      <div className="container-page grid grid-cols-1 items-stretch gap-10 py-14 lg:grid-cols-2 lg:gap-14">
        <div>
          <NavLink to="/" className="flex items-center gap-3">
            <img src={LOGO.primary} alt="Mallanna Farms logo" className="h-14 w-14 rounded-full object-cover shadow-card" />
            <span className="font-display text-xl font-semibold text-cream-50">Mallanna Farms</span>
          </NavLink>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/75">
            {settings.footer_tagline ?? "Naturally Raised. Freshly Delivered. Made for Healthy Families."}
          </p>
          <div className="mt-5 space-y-2 text-sm text-cream-100/75">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <span>{settings.contact_address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-300" />
              <a href={`tel:${settings.contact_phone?.replace(/\s+/g, "")}`} className="hover:text-gold-300">
                {settings.contact_phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gold-300" />
              <a href={`mailto:${settings.contact_email}`} className="hover:text-gold-300">
                {settings.contact_email}
              </a>
            </p>
          </div>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ key, icon: Icon, label }) => (
                <a
                  key={key}
                  href={settings[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-gold-400 hover:text-forest-900"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Whole card is one link — an overlay this size necessarily takes
            over the iframe's own drag/zoom (a transparent click-catcher has
            to sit above it to make the full visible area open Maps, not
            just a small button), so this trades in-page panning for a
            single unambiguous "tap to open Google Maps" affordance. The
            live embed is still real Google Maps content underneath, not a
            static image — roads, labels and the red pin are all genuine. */}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Mallanna Farms location in Google Maps"
            className="group relative block min-h-[300px] overflow-hidden rounded-2xl ring-1 ring-cream-50/15 transition-shadow hover:ring-gold-300/40 lg:min-h-[360px]"
          >
            {settings.contact_map_embed ? (
              <iframe
                src={settings.contact_map_embed}
                title="Mallanna Farms location"
                loading="lazy"
                tabIndex={-1}
                className="pointer-events-none h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-forest-800 text-sm text-cream-100/60">
                Map location coming soon.
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-forest-950/0 transition-colors group-hover:bg-forest-950/10" />
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 shadow-card">
              <ExternalLink className="h-3.5 w-3.5" />
              View on Google Maps
            </span>
          </a>
        )}
      </div>

      <div className="border-t border-cream-50/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Mallanna Farms. All Rights Reserved.</p>
          <p>Naturally Raised. Freshly Delivered. Made for Healthy Families.</p>
        </div>
      </div>
    </footer>
  );
}
