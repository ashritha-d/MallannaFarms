import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState } from "@/components/ui/States";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteOrder, listOrders, updateOrderStatus } from "../lib/adminApi";
import type { Order, OrderStatus } from "@/lib/database.types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-gold-100 text-gold-700",
  confirmed: "bg-forest-100 text-forest-700",
  out_for_delivery: "bg-forest-700 text-cream-50",
  delivered: "bg-forest-900/10 text-forest-700",
  cancelled: "bg-earth-100 text-earth-700",
};

const STATUSES: OrderStatus[] = ["new", "confirmed", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrders() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [toDelete, setToDelete] = useState<Order | null>(null);

  const load = () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listOrders().then((res) => {
      setOrders(res.data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [configured]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search) ||
        o.order_number.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const setStatus = async (order: Order, status: OrderStatus) => {
    const res = await updateOrderStatus(order.id, status);
    if (res.error) notify(res.error, "error");
    else {
      notify("Order status updated.");
      load();
      setSelected((s) => (s ? { ...s, status } : s));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteOrder(toDelete.id);
    setToDelete(null);
    setSelected(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("Order deleted.");
      load();
    }
  };

  return (
    <>
      <Seo title="Orders" description="Manage Mallanna Farms order enquiries." path="/admin/orders" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Orders</h1>
          <p className="mt-1 text-sm text-forest-600">
            Order requests placed through the website cart. No online payment is collected — confirm each order by
            phone or WhatsApp.
          </p>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        {configured && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or order #…" className="input pl-10" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="input sm:w-56">
                <option value="all">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="skeleton h-64 w-full" />
            ) : filtered.length === 0 ? (
              <EmptyState title="No orders found" message="Orders placed through the website cart will appear here." />
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-500">
                    <tr>
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-900/5">
                    {filtered.map((o) => (
                      <tr key={o.id} onClick={() => setSelected(o)} className="cursor-pointer hover:bg-forest-50">
                        <td className="px-4 py-3 font-medium text-forest-900">{o.order_number}</td>
                        <td className="px-4 py-3 text-forest-600">{o.customer_name}</td>
                        <td className="px-4 py-3 text-forest-600">₹{o.subtotal}</td>
                        <td className="px-4 py-3 text-forest-500">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[o.status]}`}>
                            {o.status.replace(/_/g, " ")}
                          </span>
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
                <h2 className="font-display text-base font-semibold text-forest-900">{selected.order_number}</h2>
                <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-forest-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <p>
                  <span className="font-medium text-forest-800">Customer: </span>
                  {selected.customer_name}
                </p>
                <p>
                  <span className="font-medium text-forest-800">Phone: </span>
                  <a href={`tel:${selected.phone}`} className="text-gold-600 hover:underline">
                    {selected.phone}
                  </a>
                </p>
                {selected.email && (
                  <p>
                    <span className="font-medium text-forest-800">Email: </span>
                    {selected.email}
                  </p>
                )}
                <p>
                  <span className="font-medium text-forest-800">Address: </span>
                  {selected.address}
                  {selected.city ? `, ${selected.city}` : ""}
                  {selected.pincode ? ` – ${selected.pincode}` : ""}
                </p>
                {selected.notes && (
                  <p>
                    <span className="font-medium text-forest-800">Notes: </span>
                    {selected.notes}
                  </p>
                )}

                <div className="rounded-lg bg-forest-50 p-3">
                  <p className="mb-2 font-medium text-forest-800">Items</p>
                  <ul className="space-y-1.5">
                    {selected.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-forest-700">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between border-t border-forest-900/10 pt-2 font-semibold text-forest-900">
                    <span>Subtotal</span>
                    <span>₹{selected.subtotal}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(selected, s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        selected.status === s ? "bg-forest-800 text-cream-50" : "bg-forest-100 text-forest-700"
                      }`}
                    >
                      {s.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>

                <button onClick={() => setToDelete(selected)} className="btn mt-3 w-full bg-earth-600 text-cream-50 hover:bg-earth-700">
                  <Trash2 className="h-4 w-4" />
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog open={!!toDelete} title="Delete order?" message="This order will be permanently removed." onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      </div>
    </>
  );
}
