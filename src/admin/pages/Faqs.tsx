import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState } from "@/components/ui/States";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteFaq, listFaqsAdmin, upsertFaq } from "../lib/adminApi";
import type { Faq } from "@/lib/database.types";

const EMPTY: Partial<Faq> = { question: "", answer: "", category: "General", active: true, sort_order: 0 };

export default function AdminFaqs() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);
  const [toDelete, setToDelete] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listFaqsAdmin().then((res) => {
      setFaqs(res.data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [configured]);

  const save = async () => {
    if (!editing?.question || !editing?.answer) {
      notify("Question and answer are required.", "error");
      return;
    }
    setSaving(true);
    const res = await upsertFaq({ ...editing, sort_order: editing.sort_order ?? faqs.length } as Partial<Faq> & { question: string; answer: string });
    setSaving(false);
    if (res.error) notify(res.error, "error");
    else {
      notify("FAQ saved.");
      setEditing(null);
      load();
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteFaq(toDelete.id);
    setToDelete(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("FAQ deleted.");
      load();
    }
  };

  return (
    <>
      <Seo title="Manage FAQs" description="Manage Mallanna Farms FAQs." path="/admin/faqs" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">FAQs</h1>
            <p className="mt-1 text-sm text-forest-600">Manage frequently asked questions shown on the FAQ page.</p>
          </div>
          <button onClick={() => setEditing(EMPTY)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        {configured && (
          <>
            {loading ? (
              <div className="skeleton h-64 w-full" />
            ) : faqs.length === 0 ? (
              <EmptyState title="No FAQs yet" />
            ) : (
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <p className="font-medium text-forest-900">{f.question}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-forest-500">{f.answer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const res = await upsertFaq({ ...f, active: !f.active });
                          if (!res.error) load();
                        }}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${f.active ? "bg-forest-100 text-forest-700" : "bg-forest-900/5 text-forest-400"}`}
                      >
                        {f.active ? "Visible" : "Hidden"}
                      </button>
                      <button onClick={() => setEditing(f)} className="btn-secondary !py-1.5 text-xs">
                        Edit
                      </button>
                      <button onClick={() => setToDelete(f)} aria-label="Delete" className="rounded-lg p-2 text-earth-600 hover:bg-earth-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
                <h2 className="font-display text-base font-semibold text-forest-900">{editing.id ? "Edit FAQ" : "Add FAQ"}</h2>
                <button onClick={() => setEditing(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-forest-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Question *</label>
                  <input value={editing.question ?? ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Answer *</label>
                  <textarea value={editing.answer ?? ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={4} className="input resize-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest-800">Category</label>
                  <input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input" />
                </div>
                <button onClick={save} disabled={saving} className="btn-primary w-full">
                  {saving ? "Saving…" : "Save FAQ"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog open={!!toDelete} title="Delete FAQ?" message="This question will be permanently removed." onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      </div>
    </>
  );
}
