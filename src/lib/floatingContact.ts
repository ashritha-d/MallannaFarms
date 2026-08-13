// Central place that turns site settings (editable in /admin → Settings)
// into the three links the floating action buttons use. Keeping this in
// one module means the WhatsApp number, phone number and Maps link only
// ever need to be reasoned about in one place.

const DEFAULT_WHATSAPP_MESSAGE = "Hello, I would like to know more about your free-range eggs.";

/** Strips everything but digits, e.g. "+91 90000 00000" -> "919000000000". */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function getWhatsAppUrl(settings: Record<string, string>, message = DEFAULT_WHATSAPP_MESSAGE): string | null {
  const number = digitsOnly(settings.whatsapp_number || settings.contact_phone || "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getCallUrl(settings: Record<string, string>): string | null {
  const phone = (settings.contact_phone || "").trim();
  if (!phone) return null;
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function getMapsUrl(settings: Record<string, string>): string | null {
  if (settings.contact_map_link) return settings.contact_map_link;
  if (settings.contact_address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.contact_address)}`;
  }
  return null;
}
