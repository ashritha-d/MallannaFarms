import { NavLink } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_EXPLORE, FOOTER_LEARN, FOOTER_SUPPORT } from "@/routes";
import { LOGO } from "@/data/seed";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

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
