import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Star, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState } from "@/components/ui/States";
import BackendUnavailableBanner from "../components/BackendUnavailableBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import MediaPicker from "../components/MediaPicker";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteGalleryItem, listGalleryAdmin, upsertGalleryItem } from "../lib/adminApi";
import type { GalleryItem, Media } from "@/lib/apiTypes";

const CATEGORIES = ["Our Farm", "Free Range Hens", "Egg Collection", "Farm Life", "Products", "Packaging", "Behind the Scenes"];

type Row = GalleryItem & { media: Media | null };

export default function AdminGallery() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const load = () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listGalleryAdmin().then((res) => {
      setItems(res.data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [configured]);

  const addFromMedia = async (media: Media) => {
    setPickerOpen(false);
    const res = await upsertGalleryItem({
      media_id: media.id,
      title: media.title ?? media.file_name,
      category: media.category ?? CATEGORIES[0],
      sort_order: items.length,
      featured: false,
      active: true,
    });
    if (res.error) notify(res.error, "error");
    else {
      notify("Added to gallery.");
      load();
    }
  };

  const patch = async (row: Row, changes: Partial<GalleryItem>) => {
    const res = await upsertGalleryItem({ ...row, ...changes });
    if (res.error) notify(res.error, "error");
    else load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    await Promise.all([
      upsertGalleryItem({ ...a, sort_order: b.sort_order }),
      upsertGalleryItem({ ...b, sort_order: a.sort_order }),
    ]);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteGalleryItem(toDelete.id);
    setToDelete(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("Removed from gallery.");
      load();
    }
  };

  return (
    <>
      <Seo title="Manage Gallery" description="Manage Mallanna Farms gallery." path="/admin/gallery" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">Gallery</h1>
            <p className="mt-1 text-sm text-forest-600">Curate photos shown on the public Gallery and Our Farm pages.</p>
          </div>
          <button onClick={() => setPickerOpen(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add From Media
          </button>
        </div>

        {!configured && <BackendUnavailableBanner />}

        {configured && (
          <>
            {loading ? (
              <div className="skeleton h-64 w-full" />
            ) : items.length === 0 ? (
              <EmptyState title="No gallery items yet" message="Add photos from your media library to build the gallery." />
            ) : (
              <div className="space-y-3">
                {items.map((row, i) => (
                  <div key={row.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <img src={row.media?.file_url ?? ""} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 space-y-2">
                      <input
                        defaultValue={row.title ?? ""}
                        onBlur={(e) => patch(row, { title: e.target.value })}
                        placeholder="Title"
                        className="input"
                      />
                      <select
                        defaultValue={row.category}
                        onChange={(e) => patch(row, { category: e.target.value })}
                        className="input w-auto"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => move(i, -1)} aria-label="Move up" className="rounded-lg p-2 text-forest-600 hover:bg-forest-100" disabled={i === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button onClick={() => move(i, 1)} aria-label="Move down" className="rounded-lg p-2 text-forest-600 hover:bg-forest-100" disabled={i === items.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => patch(row, { featured: !row.featured })}
                        aria-label="Toggle featured"
                        className={`rounded-lg p-2 ${row.featured ? "text-gold-500" : "text-forest-300"} hover:bg-forest-100`}
                      >
                        <Star className="h-4 w-4" fill={row.featured ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => patch(row, { active: !row.active })}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.active ? "bg-forest-100 text-forest-700" : "bg-forest-900/5 text-forest-400"}`}
                      >
                        {row.active ? "Visible" : "Hidden"}
                      </button>
                      <button onClick={() => setToDelete(row)} aria-label="Delete" className="rounded-lg p-2 text-earth-600 hover:bg-earth-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <MediaPicker open={pickerOpen} accept="image" onClose={() => setPickerOpen(false)} onSelect={addFromMedia} />
        <ConfirmDialog
          open={!!toDelete}
          title="Remove from gallery?"
          message="This photo will be removed from the public gallery. The original file stays in your Media Library."
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      </div>
    </>
  );
}
