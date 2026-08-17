import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { listMedia, uploadMedia } from "../lib/adminApi";
import { useToast } from "./Toast";
import type { Media } from "@/lib/apiTypes";

export default function MediaPicker({
  open,
  onSelect,
  onClose,
  accept = "image",
}: {
  open: boolean;
  onSelect: (media: Media) => void;
  onClose: () => void;
  accept?: "image" | "video" | "any";
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { notify } = useToast();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listMedia().then((res) => {
      setMedia(res.data ?? []);
      setLoading(false);
    });
  }, [open]);

  if (!open) return null;

  const filtered = accept === "any" ? media : media.filter((m) => m.file_type === accept);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMedia(file, "uploads");
    setUploading(false);
    if (res.error) {
      notify(res.error, "error");
    } else if (res.data) {
      notify("Uploaded successfully.");
      setMedia((m) => [res.data as Media, ...m]);
      onSelect(res.data);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-forest-950/60 p-4 animate-fadeIn" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-forest-900">Select Media</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-forest-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-forest-900/10 px-5 py-3">
          <label className="btn-secondary w-fit cursor-pointer">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload New"}
            <input ref={fileRef} type="file" accept={accept === "any" ? undefined : `${accept}/*`} className="hidden" onChange={onFileChange} />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-forest-500">No media yet. Upload your first file above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-forest-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                >
                  {m.file_type === "image" ? (
                    <img src={m.file_url} alt={m.alt_text ?? m.file_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <video src={m.file_url} className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
