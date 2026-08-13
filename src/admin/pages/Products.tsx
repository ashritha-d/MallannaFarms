import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { EmptyState, ErrorState } from "@/components/ui/States";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { deleteProduct, listProducts, upsertProduct } from "../lib/adminApi";
import type { Product } from "@/lib/database.types";

export default function AdminProducts() {
  const { configured } = useAdminAuth();
  const { notify } = useToast();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const load = () => {
    if (!configured) {
      setStatus("ready");
      return;
    }
    setStatus("loading");
    listProducts().then((res) => {
      if (res.error) setStatus("error");
      else {
        setProducts(res.data ?? []);
        setStatus("ready");
      }
    });
  };

  useEffect(load, [configured]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? p.active : !p.active);
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const onDuplicate = async (p: Product) => {
    const { id: _id, created_at: _createdAt, ...rest } = p;
    const res = await upsertProduct({
      ...rest,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now()}`,
    });
    if (res.error) notify(res.error, "error");
    else {
      notify("Product duplicated.");
      load();
    }
  };

  const onToggleActive = async (p: Product) => {
    const res = await upsertProduct({ ...p, active: !p.active });
    if (res.error) notify(res.error, "error");
    else {
      notify(p.active ? "Product unpublished." : "Product published.");
      load();
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteProduct(toDelete.id);
    setToDelete(null);
    if (res.error) notify(res.error, "error");
    else {
      notify("Product deleted.");
      load();
    }
  };

  return (
    <>
      <Seo title="Manage Products" description="Manage Mallanna Farms products." path="/admin/products" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">Products</h1>
            <p className="mt-1 text-sm text-forest-600">Create and manage your free-range egg products.</p>
          </div>
          <NavLink to="/admin/products/new" className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add Product
          </NavLink>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        {configured && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, SKU or category…"
                  className="input pl-10"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="input sm:w-48">
                <option value="all">All Statuses</option>
                <option value="active">Published</option>
                <option value="inactive">Unpublished</option>
              </select>
            </div>

            {status === "loading" && <div className="skeleton h-64 w-full" />}
            {status === "error" && <ErrorState onRetry={load} />}
            {status === "ready" && filtered.length === 0 && (
              <EmptyState title="No products found" message="Try adjusting your search or add a new product." />
            )}

            {status === "ready" && filtered.length > 0 && (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-900/5">
                    {filtered.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.main_image_url ?? ""}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
                            />
                            <div>
                              <p className="font-medium text-forest-900">{p.name}</p>
                              <p className="text-xs text-forest-500">{p.pack_size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-forest-600">{p.sku ?? "—"}</td>
                        <td className="px-4 py-3 text-forest-600">₹{p.discount_price ?? p.price}</td>
                        <td className="px-4 py-3 text-forest-600 capitalize">{p.stock_status.replace("_", " ")}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onToggleActive(p)}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              p.active ? "bg-forest-100 text-forest-700" : "bg-forest-900/5 text-forest-500"
                            }`}
                          >
                            {p.active ? "Published" : "Unpublished"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <NavLink to={`/admin/products/${p.id}/edit`} aria-label="Edit" className="rounded-lg p-2 text-forest-600 hover:bg-forest-100">
                              <Pencil className="h-4 w-4" />
                            </NavLink>
                            <button onClick={() => onDuplicate(p)} aria-label="Duplicate" className="rounded-lg p-2 text-forest-600 hover:bg-forest-100">
                              <Copy className="h-4 w-4" />
                            </button>
                            <button onClick={() => setToDelete(p)} aria-label="Delete" className="rounded-lg p-2 text-earth-600 hover:bg-earth-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <ConfirmDialog
          open={!!toDelete}
          title="Delete product?"
          message={`"${toDelete?.name}" will be permanently removed. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      </div>
    </>
  );
}
