import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { MORE_NAV, PRIMARY_NAV, ROUTES } from "@/routes";
import { LOGO } from "@/data/seed";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium tracking-wide transition-colors hover:text-gold-600 ${
      isActive ? "text-forest-900" : "text-forest-700"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 safe-top ${
        scrolled ? "bg-cream-50/95 shadow-soft backdrop-blur" : "bg-cream-50/85 backdrop-blur"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between sm:h-20" aria-label="Primary">
        <NavLink to={ROUTES.home} className="flex shrink-0 items-center gap-2.5" aria-label="Mallanna Farms — Home">
          <img
            src={LOGO.primary}
            alt="Mallanna Farms logo"
            className="h-11 w-11 shrink-0 rounded-full object-cover shadow-card sm:h-14 sm:w-14"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-lg font-semibold text-forest-900">Mallanna Farms</span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-earth-600">Free Range Eggs</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === ROUTES.home}>
              {item.label}
            </NavLink>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600"
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More
              <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-forest-900/10 bg-white py-2 shadow-lift animate-fadeIn">
                {MORE_NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 hover:text-forest-900"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <NavLink to={ROUTES.products} className="btn-primary">
            Explore Our Eggs
          </NavLink>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full text-forest-800 hover:bg-forest-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 top-16 z-40 bg-forest-950/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div
        className={`fixed inset-x-0 top-16 z-40 origin-top overflow-y-auto rounded-b-2xl bg-cream-50 shadow-lift transition-all duration-300 ease-out safe-bottom lg:hidden ${
          open ? "max-h-[85vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="container-page flex flex-col gap-1 py-4">
          {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3.5 text-base font-medium ${
                  isActive ? "bg-forest-100 text-forest-900" : "text-forest-700 hover:bg-forest-50"
                }`
              }
              end={item.to === ROUTES.home}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to={ROUTES.products} className="btn-primary mt-3 w-full">
            Explore Our Eggs
          </NavLink>
        </div>
      </div>
    </header>
  );
}
