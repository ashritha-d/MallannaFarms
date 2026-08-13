import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Loader2, Save } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { requireSupabase } from "@/lib/supabase";
import { upsertProduct } from "../lib/adminApi";
import { useToast } from "../components/Toast";
import MediaPicker from "../components/MediaPicker";
import type { Product, StockStatus } from "@/lib/database.types";

const EMPTY: Partial<Product> = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  price: 0,
  discount_price: null,
  pack_size: "",
  egg_count: null,
  grade: "Grade A",
  sku: "",
  barcode: "",
  category: "Free Range Eggs",
  stock_status: "in_stock",
  featured: false,
  active: true,
  main_image_url: "",
  video_url: "",
  sort_order: 0,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { notify } = useToast();

  const [form, setForm] = useState<Partial<Product>>(EMPTY);
  const [featuresText, setFeaturesText] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const db = requireSupabase();
        const { data } = await db.from("products").select("*").eq("id", id).single();
        if (data) {
          setForm(data);
          setFeaturesText((data.features ?? []).join("\n"));
          setSlugTouched(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const update = <K extends keyof Product>(key: K, value: Product[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onNameChange = (name: string) => {
    update("name", name);
    if (!slugTouched) update("slug", slugify(name));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || form.price == null) {
      notify("Name, slug and price are required.", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    } as Product;
    const res = await upsertProduct(payload);
    setSaving(false);
    if (res.error) {
      notify(res.error, "error");
    } else {
      notify(isNew ? "Product created." : "Product updated.");
      navigate("/admin/products");
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <>
      <Seo title={isNew ? "Add Product" : "Edit Product"} description="Manage product." path="/admin/products" />
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-forest-900">{isNew ? "Add Product" : "Edit Product"}</h1>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card space-y-4 p-5">
              <h2 className="font-display text-base font-semibold text-forest-900">Basic Information</h2>
              <TextField label="Product Name" required value={form.name ?? ""} onChange={(v) => onNameChange(v)} />
              <TextField
                label="Slug"
                required
                value={form.slug ?? ""}
                onChange={(v) => {
                  setSlugTouched(true);
                  update("slug", slugify(v));
                }}
              />
              <TextArea label="Short Description" value={form.short_description ?? ""} onChange={(v) => update("short_description", v)} rows={2} />
              <TextArea label="Full Description" value={form.description ?? ""} onChange={(v) => update("description", v)} rows={5} />
            </div>

            <div className="card space-y-4 p-5">
              <h2 className="font-display text-base font-semibold text-forest-900">Pricing & Packaging</h2>
              <div className="grid grid-cols-2 gap-4">
                <NumberField label="Price (₹)" required value={form.price ?? 0} onChange={(v) => update("price", v ?? 0)} />
                <NumberField label="Discount Price (₹)" value={form.discount_price ?? undefined} onChange={(v) => update("discount_price", v ?? null)} />
                <TextField label="Pack Size" value={form.pack_size ?? ""} onChange={(v) => update("pack_size", v)} placeholder="e.g. Tray of 12" />
                <NumberField label="Egg Count" value={form.egg_count ?? undefined} onChange={(v) => update("egg_count", v ?? null)} />
                <TextField label="Grade" value={form.grade ?? ""} onChange={(v) => update("grade", v)} placeholder="e.g. Grade A" />
                <TextField label="Category" value={form.category ?? ""} onChange={(v) => update("category", v)} />
              </div>
            </div>

            <div className="card space-y-4 p-5">
              <h2 className="font-display text-base font-semibold text-forest-900">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextField label="SKU" value={form.sku ?? ""} onChange={(v) => update("sku", v)} />
                <TextField label="Barcode" value={form.barcode ?? ""} onChange={(v) => update("barcode", v)} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Stock Status</label>
                  <select
                    value={form.stock_status ?? "in_stock"}
                    onChange={(e) => update("stock_status", e.target.value as StockStatus)}
                    className="input"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="preorder">Pre-order</option>
                  </select>
                </div>
                <NumberField label="Sort Order" value={form.sort_order ?? 0} onChange={(v) => update("sort_order", v ?? 0)} />
              </div>
            </div>

            <div className="card space-y-4 p-5">
              <h2 className="font-display text-base font-semibold text-forest-900">Features & Nutrition</h2>
              <TextArea label="Features (one per line)" value={featuresText} onChange={setFeaturesText} rows={4} />
              <TextField label="Feed / Ingredients Information" value={form.feed_info ?? ""} onChange={(v) => update("feed_info", v)} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-3 p-5">
              <h2 className="font-display text-base font-semibold text-forest-900">Main Image</h2>
              {form.main_image_url ? (
                <img src={form.main_image_url} alt="" className="aspect-square w-full rounded-xl object-cover" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-forest-300 bg-forest-50 text-forest-400">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
              <button type="button" onClick={() => setPickerOpen(true)} className="btn-secondary w-full">
                Choose Image
              </button>
              <TextField label="Video URL (optional)" value={form.video_url ?? ""} onChange={(v) => update("video_url", v)} />
            </div>

            <div className="card space-y-4 p-5">
              <h2 className="font-display text-base font-semibold text-forest-900">Publishing</h2>
              <Toggle label="Active (visible on website)" checked={form.active ?? true} onChange={(v) => update("active", v)} />
              <Toggle label="Featured product" checked={form.featured ?? false} onChange={(v) => update("featured", v)} />
            </div>
          </div>
        </div>
      </form>

      <MediaPicker
        open={pickerOpen}
        accept="image"
        onClose={() => setPickerOpen(false)}
        onSelect={(m) => {
          update("main_image_url", m.file_url);
          setPickerOpen(false);
        }}
      />
    </>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">
        {label} {required && <span className="text-earth-500">*</span>}
      </label>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="input" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="input resize-none" />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">
        {label} {required && <span className="text-earth-500">*</span>}
      </label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        required={required}
        className="input"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm font-medium text-forest-800">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-forest-700" : "bg-forest-200"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
