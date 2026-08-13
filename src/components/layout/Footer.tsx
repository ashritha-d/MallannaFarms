import { NavLink } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_EXPLORE, FOOTER_LEARN, FOOTER_SUPPORT } from "@/routes";
import { LOGO } from "@/data/seed";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/contexts/LanguageContext";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.08c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2.01.9 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.47-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.44.29.15.46.13.63-.08.17-.21.72-.84.92-1.13.19-.29.39-.24.65-.14.27.1 1.69.8 1.98.94.29.15.48.22.55.34.07.13.07.72-.17 1.4z" />
    </svg>
  );
}

export default function Footer() {
  const { data: settings } = useSettings();
  const { t } = useLanguage();

  const socialLinks = [
    { key: "social_instagram", icon: Instagram, label: "Instagram" },
    { key: "social_facebook", icon: Facebook, label: "Facebook" },
    { key: "social_whatsapp", icon: WhatsAppIcon, label: "WhatsApp" },
  ].filter((s) => settings[s.key]);

  const columns = [
    { title: t("footer_explore"), items: FOOTER_EXPLORE },
    { title: t("footer_learn"), items: FOOTER_LEARN },
    { title: t("footer_support"), items: FOOTER_SUPPORT },
  ];

  return (
    <footer className="bg-forest-900 text-cream-100">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
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

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-base font-semibold text-cream-50">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="text-sm text-cream-100/75 transition-colors hover:text-gold-300">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-base font-semibold text-cream-50">{t("footer_connect")}</h3>
          <p className="mt-4 text-sm text-cream-100/75">
            Follow Mallanna Farms for fresh updates from the farm.
          </p>
          {socialLinks.length === 0 && (
            <p className="mt-3 text-xs text-cream-100/50">Social links are added in Admin → Social Links.</p>
          )}
        </div>
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
