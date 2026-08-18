import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, Trash2, Upload, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState } from "@/components/ui/States";
import BackendUnavailableBanner from "../components/BackendUnavailableBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteMedia, listMedia, updateMedia, uploadMedia } from "../lib/adminApi";
import type { Media } from "@/lib/apiTypes";

const CATEGORIES = ["Our Farm", "Free Range Hens", "Egg Collection", "Farm Life", "Products", "Packaging", "Behind the Scenes", "Uploads"];

export default function AdminMedia() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [selected, setSelected] = useState<Media | null>(null);
  const [toDelete, setToDelete] = useState<Media | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listMedia().then((res) => {
      setMedia(res.data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [configured]);

  const filtered = useMemo(() => {
    return media.filter((m) => {
      const matchesSearch = !search || m.file_name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || m.file_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [media, search, typeFilter]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const res = await uploadMedia(file, uploadCategory);
      if (res.error) notify(`${file.name}: ${res.error}`, "error");
      else if (res.data) setMedia((m) => [res.data as Media, ...m]);
    }
    setUploading(false);
    notify("Upload complete.");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteMedia(toDelete);
    setToDelete(null);
    setSelected(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("Media deleted.");
      setMedia((m) => m.filter((x) => x.id !== toDelete.id));
    }
  };

  const saveMeta = async (patch: Partial<Media>) => {
    if (!selected) return;
    const res = await updateMedia(selected.id, patch);
    if (res.error) notify(res.error, "error");
    else if (res.data) {
      notify("Saved.");
      setMedia((m) => m.map((x) => (x.id === selected.id ? (res.data as Media) : x)));
      setSelected(res.data);
    }
  };

  return (
    <>
      <Seo title="Media Library" description="Manage Mallanna Farms media library." path="/admin/media" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Media Library</h1>
          <p className="mt-1 text-sm text-forest-600">Upload and organize photos and videos used across the site.</p>
        </div>

        {!configured && <BackendUnavailableBanner />}

        {configured && (
          <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? "border-forest-600 bg-forest-50" : "border-forest-300 bg-white"
              }`}
            >
              {uploading ? <Loader2 className="h-8 w-8 animate-spin text-forest-600" /> : <Upload className="h-8 w-8 text-forest-400" />}
              <p className="text-sm font-medium text-forest-700">Drag & drop images or videos here, or</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="input w-auto">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label className="btn-secondary cursor-pointer">
                  Browse Files
                  <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                </label>
              </div>
              <p className="text-xs text-forest-400">Images up to 8MB · Videos up to 100MB · JPG, PNG, WEBP, GIF, MP4, WEBM</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by filename…" className="input pl-10" />
              </div>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} className="input sm:w-40">
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-square" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState title="No media found" message="Upload photos or videos to build your media library." />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {filtered.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-card"
                  >
                    {m.file_type === "image" ? (
                      <img src={m.file_url} alt={m.alt_text ?? m.file_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <video src={m.file_url} className="h-full w-full object-cover" />
                    )}
                    <span className="absolute inset-x-0 bottom-0 truncate bg-forest-950/70 px-2 py-1 text-[10px] text-cream-50">{m.file_name}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selected && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-forest-950/60 p-4" onClick={() => setSelected(null)}>
            <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
                <h2 className="font-display text-base font-semibold text-forest-900">Media Details</h2>
                <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-forest-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-5">
                {selected.file_type === "image" ? (
                  <img src={selected.file_url} alt="" className="aspect-video w-full rounded-lg object-cover" />
                ) : (
                  <video src={selected.file_url} controls className="aspect-video w-full rounded-lg" />
                )}
                <MetaField label="Title" defaultValue={selected.title ?? ""} onBlurSave={(v) => saveMeta({ title: v })} />
                <MetaField label="Alt Text" defaultValue={selected.alt_text ?? ""} onBlurSave={(v) => saveMeta({ alt_text: v })} />
                <MetaField label="Caption" defaultValue={selected.caption ?? ""} onBlurSave={(v) => saveMeta({ caption: v })} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Category</label>
                  <select
                    defaultValue={selected.category ?? CATEGORIES[0]}
                    onChange={(e) => saveMeta({ category: e.target.value })}
                    className="input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={() => setToDelete(selected)} className="btn w-full bg-earth-600 text-cream-50 hover:bg-earth-700">
                  <Trash2 className="h-4 w-4" />
                  Delete Media
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!toDelete}
          title="Delete media?"
          message="This file will be permanently removed from storage. Any product, gallery or video referencing it will lose this image."
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      </div>
    </>
  );
}

function MetaField({ label, defaultValue, onBlurSave }: { label: string; defaultValue: string; onBlurSave: (v: string) => void }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">{label}</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} onBlur={() => onBlurSave(value)} className="input" />
    </div>
  );
}
