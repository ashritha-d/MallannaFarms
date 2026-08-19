import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";
import { getMapsUrl, getWhatsAppUrl } from "@/lib/floatingContact";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Contact() {
  const { data: settings } = useSettings();
  const mapsUrl = getMapsUrl(settings);
  const whatsappUrl = getWhatsAppUrl(settings);

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with Mallanna Farms — reach out for enquiries about our free-range eggs, farm visits, or partnerships."
        path="/contact"
      />
      <Section tone="cream" className="pt-8 sm:pt-12">
        {/* Visible eyebrow/heading removed per request; sr-only h1 kept so
            the page still has one real heading for a11y/SEO (same pattern
            as the Products page). pt-8/12 (was pt-28/32, sized for the
            removed heading text) matches Products.tsx's own no-visible-
            heading top padding, so content starts right below the navbar
            with no leftover gap. */}
        <h1 className="sr-only">Contact Us</h1>

        {/* Info (left) + map (right) — own row so the map sits directly
            beside the contact details rather than sharing a column with
            them. items-stretch (grid default) lets the map match the info
            column's height on desktop; min-h keeps it from ever going
            below a sensible size when the info column is short. */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:gap-14">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest-900">Get in Touch</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">Farm Address</p>
                  <p className="text-sm text-forest-600">{settings.contact_address}</p>
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-medium text-gold-600 hover:underline">
                      Get Directions →
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">Phone</p>
                  <a href={`tel:${settings.contact_phone?.replace(/\s+/g, "")}`} className="text-sm text-forest-600 hover:text-gold-600">
                    {settings.contact_phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">Email</p>
                  <a href={`mailto:${settings.contact_email}`} className="text-sm text-forest-600 hover:text-gold-600">
                    {settings.contact_email}
                  </a>
                </div>
              </li>
            </ul>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-7 !bg-[#25D366] hover:!bg-[#1fbd5a]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Message Us on WhatsApp
              </a>
            )}
          </div>

          <div className="relative min-h-[350px] overflow-hidden rounded-2xl border border-forest-900/10 shadow-lift md:min-h-[400px] lg:min-h-[420px]">
            {settings.contact_map_embed ? (
              <iframe
                src={settings.contact_map_embed}
                title="Mallanna Farms location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-forest-50 p-6 text-center text-sm text-forest-500">
                Map will appear here once a Google Maps location is set in Admin → Settings.
              </div>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 shadow-card transition-colors hover:bg-forest-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
