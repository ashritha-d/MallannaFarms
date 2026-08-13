import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Egg, Images, Inbox, Package, Video } from "lucide-react";
import { useAdminAuth } from "../auth/AuthContext";
import ConnectSupabaseBanner from "../components/ConnectSupabaseBanner";
import { getDashboardStats } from "../lib/adminApi";
import Seo from "@/components/seo/Seo";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  mediaCount: number;
  videoCount: number;
  galleryCount: number;
  newEnquiries: number;
  newOrders: number;
}

export default function Dashboard() {
  const { configured } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!configured) return;
    getDashboardStats().then((res) => {
      if (res.data) setStats(res.data);
    });
  }, [configured]);

  const cards = [
    { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Egg, to: "/admin/products" },
    { label: "Active Products", value: stats?.activeProducts ?? 0, icon: Egg, to: "/admin/products" },
    { label: "New Orders", value: stats?.newOrders ?? 0, icon: Package, to: "/admin/orders" },
    { label: "Gallery Images", value: stats?.galleryCount ?? 0, icon: Images, to: "/admin/gallery" },
    { label: "Videos", value: stats?.videoCount ?? 0, icon: Video, to: "/admin/videos" },
    { label: "New Enquiries", value: stats?.newEnquiries ?? 0, icon: Inbox, to: "/admin/enquiries" },
  ];

  return (
    <>
      <Seo title="Admin Dashboard" description="Mallanna Farms admin dashboard." path="/admin" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Dashboard</h1>
          <p className="mt-1 text-sm text-forest-600">Overview of your Mallanna Farms website.</p>
        </div>

        {!configured && <ConnectSupabaseBanner />}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {cards.map(({ label, value, icon: Icon, to }) => (
            <NavLink key={label} to={to} className="card flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-display text-2xl font-semibold text-forest-900">{value}</p>
              <p className="text-xs font-medium text-forest-500">{label}</p>
            </NavLink>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-forest-900">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <NavLink to="/admin/products" className="btn-secondary">
              Manage Products
            </NavLink>
            <NavLink to="/admin/media" className="btn-secondary">
              Upload Media
            </NavLink>
            <NavLink to="/admin/gallery" className="btn-secondary">
              Manage Gallery
            </NavLink>
            <NavLink to="/admin/content" className="btn-secondary">
              Edit Homepage
            </NavLink>
            <NavLink to="/admin/enquiries" className="btn-secondary">
              View Enquiries
            </NavLink>
            <NavLink to="/admin/orders" className="btn-secondary">
              View Orders
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
