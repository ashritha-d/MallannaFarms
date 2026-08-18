import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState } from "@/components/ui/States";
import BackendUnavailableBanner from "../components/BackendUnavailableBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteEnquiry, listEnquiries, updateEnquiryStatus } from "../lib/adminApi";
import type { ContactMessage, EnquiryStatus } from "@/lib/apiTypes";

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-gold-100 text-gold-700",
  read: "bg-forest-100 text-forest-700",
  responded: "bg-forest-700 text-cream-50",
  archived: "bg-forest-900/5 text-forest-400",
};

export default function AdminEnquiries() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [enquiries, setEnquiries] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EnquiryStatus>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);

  const load = () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listEnquiries().then((res) => {
      setEnquiries(res.data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [configured]);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const openEnquiry = async (e: ContactMessage) => {
    setSelected(e);
    if (e.status === "new") {
      await updateEnquiryStatus(e.id, "read");
      load();
    }
  };

  const setStatus = async (e: ContactMessage, status: EnquiryStatus) => {
    const res = await updateEnquiryStatus(e.id, status);
    if (res.error) notify(res.error, "error");
    else {
      notify("Status updated.");
      load();
      setSelected((s) => (s ? { ...s, status } : s));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteEnquiry(toDelete.id);
    setToDelete(null);
    setSelected(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("Enquiry deleted.");
      load();
    }
  };

  return (
    <>
      <Seo title="Contact Enquiries" description="View Mallanna Farms contact enquiries." path="/admin/enquiries" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Contact Enquiries</h1>
          <p className="mt-1 text-sm text-forest-600">Messages submitted through the website contact form.</p>
        </div>

        {!configured && <BackendUnavailableBanner />}

        {configured && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="input pl-10" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="input sm:w-48">
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {loading ? (
              <div className="skeleton h-64 w-full" />
            ) : filtered.length === 0 ? (
              <EmptyState title="No enquiries found" message="Messages submitted through the Contact page will appear here." />
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-900/5">
                    {filtered.map((e) => (
                      <tr key={e.id} onClick={() => openEnquiry(e)} className="cursor-pointer hover:bg-forest-50">
                        <td className="px-4 py-3 font-medium text-forest-900">{e.name}</td>
                        <td className="px-4 py-3 text-forest-600">{e.email}</td>
                        <td className="px-4 py-3 text-forest-500">{new Date(e.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {selected && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-forest-950/60 p-4" onClick={() => setSelected(null)}>
            <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
                <h2 className="font-display text-base font-semibold text-forest-900">Enquiry</h2>
                <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-forest-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <p>
                  <span className="font-medium text-forest-800">Name: </span>
                  {selected.name}
                </p>
                <p>
                  <span className="font-medium text-forest-800">Email: </span>
                  <a href={`mailto:${selected.email}`} className="text-gold-600 hover:underline">
                    {selected.email}
                  </a>
                </p>
                {selected.phone && (
                  <p>
                    <span className="font-medium text-forest-800">Phone: </span>
                    {selected.phone}
                  </p>
                )}
                {selected.subject && (
                  <p>
                    <span className="font-medium text-forest-800">Subject: </span>
                    {selected.subject}
                  </p>
                )}
                <p>
                  <span className="font-medium text-forest-800">Received: </span>
                  {new Date(selected.created_at).toLocaleString()}
                </p>
                <div className="rounded-lg bg-forest-50 p-3 text-forest-700">{selected.message}</div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {(["new", "read", "responded", "archived"] as EnquiryStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(selected, s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${selected.status === s ? "bg-forest-800 text-cream-50" : "bg-forest-100 text-forest-700"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button onClick={() => setToDelete(selected)} className="btn mt-3 w-full bg-earth-600 text-cream-50 hover:bg-earth-700">
                  <Trash2 className="h-4 w-4" />
                  Delete Enquiry
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog open={!!toDelete} title="Delete enquiry?" message="This message will be permanently removed." onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      </div>
    </>
  );
}
