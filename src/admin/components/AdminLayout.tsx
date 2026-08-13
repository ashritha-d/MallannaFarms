import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { ADMIN_NAV } from "../adminRoutes";
import { useAdminAuth } from "../auth/AuthContext";
import { LOGO } from "@/data/seed";

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-forest-700 text-cream-50" : "text-forest-200/80 hover:bg-forest-800 hover:text-cream-50"
    }`;

  const SidebarContent = (
    <>
      <div className="flex items-center gap-3 px-2 py-1">
        <img src={LOGO.primary} alt="Mallanna Farms" className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="font-display text-sm font-semibold text-cream-50">Mallanna Farms</p>
          <p className="text-[11px] uppercase tracking-wide text-forest-300">Admin Dashboard</p>
        </div>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {ADMIN_NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={() => setDrawerOpen(false)}>
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-3 border-t border-forest-800 pt-4">
        <p className="truncate px-2 text-xs text-forest-300">{user?.email}</p>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-forest-200/80 hover:bg-forest-800 hover:text-cream-50"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-forest-900 p-5 lg:flex">{SidebarContent}</aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-forest-950/50 transition-opacity lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-forest-900 p-5 shadow-lift transition-transform duration-300 safe-top safe-bottom lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
          className="absolute right-4 top-4 rounded-full p-1.5 text-forest-200 hover:bg-forest-800"
        >
          <X className="h-5 w-5" />
        </button>
        {SidebarContent}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-forest-900/10 bg-white px-4 shadow-card safe-top sm:px-6">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-forest-800 hover:bg-forest-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="font-display text-base font-semibold text-forest-900">Admin Dashboard</p>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
