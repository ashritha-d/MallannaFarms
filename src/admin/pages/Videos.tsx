import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState } from "@/components/ui/States";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import MediaPicker from "../components/MediaPicker";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteVideo, listVideosAdmin, upsertVideo } from "../lib/adminApi";
import type { VideoItem } from "@/lib/database.types";

const EMPTY: Partial<VideoItem> = { title: "", description: "", video_url: "", thumbnail_url: "", category: "Farm Life", featured: false, active: true };

export default function AdminVideos() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<VideoItem> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<VideoItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listVideosAdmin().then((res) => {
      setVideos(res.data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [configured]);

  const save = async () => {
    if (!editing?.title || !editing?.video_url) {
      notify("Title and video URL are required.", "error");
      return;
    }
    setSaving(true);
    const res = await upsertVideo(editing as Partial<VideoItem> & { title: string; video_url: string });
    setSaving(false);
    if (res.error) notify(res.error, "error");
    else {
      notify("Video saved.");
      setEditing(null);
      load();
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteVideo(toDelete.id);
    setToDelete(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("Video deleted.");
      load();
    }
  };

  return (
    <>
      <Seo title="Manage Videos" description="Manage Mallanna Farms videos." path="/admin/videos" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">Videos</h1>
            <p className="mt-1 text-sm text-forest-600">Add uploaded videos or link YouTube/Vimeo videos.</p>
          </div>
          <button onClick={() => setEditing(EMPTY)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add Video
          </button>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        {configured && (
          <>
            {loading ? (
              <div className="skeleton h-64 w-full" />
            ) : videos.length === 0 ? (
              <EmptyState title="No videos yet" message="Add your first video to showcase farm life." />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((v) => (
                  <div key={v.id} className="card overflow-hidden">
                    <img src={v.thumbnail_url || "/assets/farm/hen-closeup.jpg"} alt="" className="aspect-video w-full object-cover" />
                    <div className="space-y-2 p-4">
                      <p className="font-medium text-forest-900">{v.title}</p>
                      <p className="text-xs text-forest-500">{v.category}</p>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setEditing(v)} className="btn-secondary flex-1 !py-2 text-xs">
                          Edit
                        </button>
                        <button onClick={() => setToDelete(v)} aria-label="Delete" className="rounded-lg p-2 text-earth-600 hover:bg-earth-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {editing && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-forest-950/60 p-4" onClick={() => setEditing(null)}>
            <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
                <h2 className="font-display text-base font-semibold text-forest-900">{editing.id ? "Edit Video" : "Add Video"}</h2>
                <button onClick={() => setEditing(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-forest-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Title *</label>
                  <input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Description</label>
                  <textarea
                    value={editing.description ?? ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="input resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Video URL (upload link or YouTube/Vimeo URL) *</label>
                  <input value={editing.video_url ?? ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Thumbnail</label>
                  <div className="flex items-center gap-3">
                    {editing.thumbnail_url && <img src={editing.thumbnail_url} alt="" className="h-14 w-14 rounded-lg object-cover" />}
                    <button type="button" onClick={() => setPickerOpen(true)} className="btn-secondary !py-2 text-xs">
                      Choose Thumbnail
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Category</label>
                  <input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input" />
                </div>
                <button onClick={save} disabled={saving} className="btn-primary w-full">
                  {saving ? "Saving…" : "Save Video"}
                </button>
              </div>
            </div>
          </div>
        )}

        <MediaPicker
          open={pickerOpen}
          accept="image"
          onClose={() => setPickerOpen(false)}
          onSelect={(m) => {
            setEditing((e) => (e ? { ...e, thumbnail_url: m.file_url } : e));
            setPickerOpen(false);
          }}
        />
        <ConfirmDialog open={!!toDelete} title="Delete video?" message="This video will be permanently removed." onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      </div>
    </>
  );
}
