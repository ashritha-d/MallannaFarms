import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import Seo from "@/components/seo/Seo";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import MediaPicker from "../components/MediaPicker";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { saveSettings } from "../lib/adminApi";
import { getSettings } from "@/data/content";
import { invalidateSettingsCache } from "@/hooks/useSettings";

const TABS = ["Homepage Hero", "About", "Our Mission", "Our Vision"] as const;
type Tab = (typeof TABS)[number];

export default function AdminContent() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [tab, setTab] = useState<Tab>("Homepage Hero");
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerField, setPickerField] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then((res) => {
      setValues(res.data);
      setLoading(false);
    });
  }, []);

  const set = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }));

  const save = async (keys: string[]) => {
    if (!configured) return;
    setSaving(true);
    const patch = Object.fromEntries(keys.map((k) => [k, values[k] ?? ""]));
    const res = await saveSettings(patch);
    setSaving(false);
    if (res.error) notify(res.error, "error");
    else {
      notify("Saved successfully.");
      invalidateSettingsCache();
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <>
      <Seo title="Homepage & Pages" description="Edit Mallanna Farms website content." path="/admin/content" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Homepage & Pages</h1>
          <p className="mt-1 text-sm text-forest-600">Edit text and images shown across the public website.</p>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        <div className="flex flex-wrap gap-2 border-b border-forest-900/10 pb-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-forest-800 text-cream-50" : "bg-forest-100 text-forest-700 hover:bg-forest-200"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Homepage Hero" && (
          <div className="card space-y-4 p-5">
            <Field label="Hero Heading" value={values.hero_heading} onChange={(v) => set("hero_heading", v)} />
            <Field label="Hero Tagline" value={values.hero_tagline} onChange={(v) => set("hero_tagline", v)} />
            <ImageField label="Hero Background Image" value={values.hero_image} onPick={() => setPickerField("hero_image")} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary CTA Label" value={values.hero_cta_primary_label} onChange={(v) => set("hero_cta_primary_label", v)} />
              <Field label="Primary CTA Link" value={values.hero_cta_primary_link} onChange={(v) => set("hero_cta_primary_link", v)} />
              <Field label="Secondary CTA Label" value={values.hero_cta_secondary_label} onChange={(v) => set("hero_cta_secondary_label", v)} />
              <Field label="Secondary CTA Link" value={values.hero_cta_secondary_link} onChange={(v) => set("hero_cta_secondary_link", v)} />
            </div>
            <SaveButton
              saving={saving}
              onClick={() =>
                save([
                  "hero_heading",
                  "hero_tagline",
                  "hero_image",
                  "hero_cta_primary_label",
                  "hero_cta_primary_link",
                  "hero_cta_secondary_label",
                  "hero_cta_secondary_link",
                ])
              }
            />
          </div>
        )}

        {tab === "About" && (
          <div className="card space-y-4 p-5">
            <TextAreaField label="About Content" value={values.about_content} onChange={(v) => set("about_content", v)} rows={5} />
            <ImageField label="About Image" value={values.about_image} onPick={() => setPickerField("about_image")} />
            <SaveButton saving={saving} onClick={() => save(["about_content", "about_image"])} />
          </div>
        )}

        {tab === "Our Mission" && (
          <div className="card space-y-4 p-5">
            <Field label="Title" value={values.mission_title} onChange={(v) => set("mission_title", v)} />
            <TextAreaField
              label="Content (use a blank line to separate paragraphs)"
              value={values.mission_content}
              onChange={(v) => set("mission_content", v)}
              rows={8}
            />
            <ImageField label="Mission Image" value={values.mission_image} onPick={() => setPickerField("mission_image")} />
            <SaveButton saving={saving} onClick={() => save(["mission_title", "mission_content", "mission_image"])} />
          </div>
        )}

        {tab === "Our Vision" && (
          <div className="card space-y-4 p-5">
            <Field label="Title" value={values.vision_title} onChange={(v) => set("vision_title", v)} />
            <TextAreaField
              label="Content (use a blank line to separate paragraphs)"
              value={values.vision_content}
              onChange={(v) => set("vision_content", v)}
              rows={8}
            />
            <Field label="Vision Statement (short quote)" value={values.vision_statement} onChange={(v) => set("vision_statement", v)} />
            <ImageField label="Vision Image" value={values.vision_image} onPick={() => setPickerField("vision_image")} />
            <SaveButton saving={saving} onClick={() => save(["vision_title", "vision_content", "vision_statement", "vision_image"])} />
          </div>
        )}
      </div>

      <MediaPicker
        open={!!pickerField}
        accept="image"
        onClose={() => setPickerField(null)}
        onSelect={(m) => {
          if (pickerField) set(pickerField, m.file_url);
          setPickerField(null);
        }}
      />
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 4 }: { label: string; value?: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">{label}</label>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows} className="input resize-none" />
    </div>
  );
}

function ImageField({ label, value, onPick }: { label: string; value?: string; onPick: () => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">{label}</label>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />}
        <button type="button" onClick={onPick} className="btn-secondary !py-2 text-xs">
          Choose Image
        </button>
      </div>
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={saving} className="btn-primary">
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {saving ? "Saving…" : "Save Changes"}
    </button>
  );
}
