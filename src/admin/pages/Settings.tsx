import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import Seo from "@/components/seo/Seo";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { saveSettings } from "../lib/adminApi";
import { getSettings } from "@/data/content";
import { invalidateSettingsCache } from "@/hooks/useSettings";

export default function AdminSettings() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((res) => {
      setValues(res.data);
      setLoading(false);
    });
  }, []);

  const set = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }));

  const save = async () => {
    if (!configured) return;
    setSaving(true);
    const res = await saveSettings({
      contact_address: values.contact_address ?? "",
      contact_phone: values.contact_phone ?? "",
      contact_email: values.contact_email ?? "",
      contact_map_embed: values.contact_map_embed ?? "",
      contact_map_link: values.contact_map_link ?? "",
      whatsapp_number: values.whatsapp_number ?? "",
      footer_tagline: values.footer_tagline ?? "",
      site_name: values.site_name ?? "",
      tagline_primary: values.tagline_primary ?? "",
      tagline_secondary: values.tagline_secondary ?? "",
    });
    setSaving(false);
    if (res.error) notify(res.error, "error");
    else {
      notify("Settings saved.");
      invalidateSettingsCache();
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <>
      <Seo title="Settings" description="Mallanna Farms site settings." path="/admin/settings" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Settings</h1>
          <p className="mt-1 text-sm text-forest-600">Contact details, footer tagline and brand text.</p>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        <div className="card space-y-4 p-5">
          <h2 className="font-display text-base font-semibold text-forest-900">Contact Details</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Farm Address</label>
            <textarea value={values.contact_address ?? ""} onChange={(e) => set("contact_address", e.target.value)} rows={2} className="input resize-none" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-forest-800">Phone</label>
              <input value={values.contact_phone ?? ""} onChange={(e) => set("contact_phone", e.target.value)} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-forest-800">Email</label>
              <input value={values.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} className="input" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Google Maps Embed URL</label>
            <input
              value={values.contact_map_embed ?? ""}
              onChange={(e) => set("contact_map_embed", e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="input"
            />
            <p className="mt-1 text-xs text-forest-500">
              From Google Maps: Share → Embed a map → copy the "src" URL from the iframe code. Powers the map shown
              on the Contact page.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Google Maps Link</label>
            <input
              value={values.contact_map_link ?? ""}
              onChange={(e) => set("contact_map_link", e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="input"
            />
            <p className="mt-1 text-xs text-forest-500">
              A normal shareable Google Maps link (Share → Copy link). Powers the floating Location button on every
              page — if left blank, it falls back to searching your Farm Address above.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">WhatsApp Number</label>
            <input
              value={values.whatsapp_number ?? ""}
              onChange={(e) => set("whatsapp_number", e.target.value)}
              placeholder="e.g. 919000000000 (country code, no + or spaces)"
              className="input"
            />
            <p className="mt-1 text-xs text-forest-500">
              Powers the floating WhatsApp button on every page. If left blank, it falls back to the Phone number
              above.
            </p>
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="font-display text-base font-semibold text-forest-900">Brand Text</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Site Name</label>
            <input value={values.site_name ?? ""} onChange={(e) => set("site_name", e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Main Tagline</label>
            <input value={values.tagline_primary ?? ""} onChange={(e) => set("tagline_primary", e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Secondary Tagline</label>
            <input value={values.tagline_secondary ?? ""} onChange={(e) => set("tagline_secondary", e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Footer Tagline</label>
            <input value={values.footer_tagline ?? ""} onChange={(e) => set("footer_tagline", e.target.value)} className="input" />
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </>
  );
}
