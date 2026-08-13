import { useEffect, useState, type ComponentType } from "react";
import { Facebook, Instagram, Loader2, Save, Youtube } from "lucide-react";
import Seo from "@/components/seo/Seo";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { saveSettings } from "../lib/adminApi";
import { getSettings } from "@/data/content";
import { invalidateSettingsCache } from "@/hooks/useSettings";

function WhatsAppGlyph({ className }: { className?: string }) {
  return <span className={`inline-flex items-center justify-center text-sm font-bold ${className ?? ""}`}>W</span>;
}

const FIELDS: { key: string; label: string; icon: ComponentType<{ className?: string }>; placeholder: string }[] = [
  { key: "social_instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/mallannafarms" },
  { key: "social_facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/mallannafarms" },
  { key: "social_whatsapp", label: "WhatsApp", icon: WhatsAppGlyph, placeholder: "https://wa.me/919000000000" },
  { key: "social_youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@mallannafarms" },
];

export default function AdminSocial() {
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

  const save = async () => {
    if (!configured) return;
    setSaving(true);
    const patch = Object.fromEntries(FIELDS.map((f) => [f.key, values[f.key] ?? ""]));
    const res = await saveSettings(patch);
    setSaving(false);
    if (res.error) notify(res.error, "error");
    else {
      notify("Social links saved.");
      invalidateSettingsCache();
    }
  };

  if (loading) return <div className="skeleton h-72 w-full" />;

  return (
    <>
      <Seo title="Social Links" description="Manage Mallanna Farms social media links." path="/admin/social" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Social Links</h1>
          <p className="mt-1 text-sm text-forest-600">Links shown in the footer. Leave blank to hide an icon.</p>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        <div className="card space-y-4 p-5">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-forest-800">
                <f.icon className="h-4 w-4" />
                {f.label}
              </label>
              <input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="input"
              />
            </div>
          ))}
        </div>

        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Social Links"}
        </button>
      </div>
    </>
  );
}
