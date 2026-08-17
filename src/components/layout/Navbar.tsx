import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { MOBILE_EXTRA_NAV, PRIMARY_NAV, ROUTES } from "@/routes";
import { LOGO } from "@/data/seed";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProducts } from "@/data/content";
import type { ProductWithGallery } from "@/lib/apiTypes";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<ProductWithGallery[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();
  const { lang, setLang, t } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (searchOpen) {
      getProducts().then((res) => setAllProducts(res.data));
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const results = query.trim()
    ? allProducts.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

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

        <div className="hidden items-center gap-7 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === ROUTES.home}>
              {t(navKey(item.to))}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t("nav_search")}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-forest-700 hover:bg-forest-100 lg:flex"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative hidden lg:block">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
              aria-label={t("nav_account")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-forest-700 hover:bg-forest-100"
            >
              <User className="h-5 w-5" />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-xl border border-forest-900/10 bg-white p-4 text-sm shadow-lift animate-fadeIn">
                <p className="font-semibold text-forest-900">Customer accounts — coming soon</p>
                <p className="mt-1 text-forest-600">
                  For order help or questions, reach us on the{" "}
                  <NavLink to={ROUTES.contact} className="text-gold-600 hover:underline">
                    Contact page
                  </NavLink>
                  .
                </p>
              </div>
            )}
          </div>

          <button
            onClick={openCart}
            aria-label={`${t("nav_cart")}${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest-700 hover:bg-forest-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-forest-900">
                {itemCount}
              </span>
            )}
          </button>

          <div className="hidden items-center gap-1 rounded-full border border-forest-900/15 px-1 py-0.5 text-xs font-semibold lg:flex">
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-2 py-1 ${lang === "en" ? "bg-forest-800 text-cream-50" : "text-forest-600"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("te")}
              className={`rounded-full px-2 py-1 ${lang === "te" ? "bg-forest-800 text-cream-50" : "text-forest-600"}`}
            >
              తెలుగు
            </button>
          </div>

          <NavLink to={ROUTES.products} className="btn-primary hidden lg:inline-flex">
            {t("nav_order_now")}
          </NavLink>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-forest-800 hover:bg-forest-100 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
          {[...PRIMARY_NAV, ...MOBILE_EXTRA_NAV].map((item) => (
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
          <div className="mt-2 flex items-center justify-center gap-1 rounded-full border border-forest-900/15 px-1 py-1 text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`flex-1 rounded-full px-2 py-2 ${lang === "en" ? "bg-forest-800 text-cream-50" : "text-forest-600"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("te")}
              className={`flex-1 rounded-full px-2 py-2 ${lang === "te" ? "bg-forest-800 text-cream-50" : "text-forest-600"}`}
            >
              తెలుగు
            </button>
          </div>
          <NavLink to={ROUTES.products} className="btn-primary mt-3 w-full">
            {t("nav_order_now")}
          </NavLink>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-start justify-center bg-forest-950/60 px-4 pt-24 safe-top"
          onClick={() => setSearchOpen(false)}
        >
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-forest-900/10 pb-3">
              <Search className="h-5 w-5 text-forest-400" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for free range eggs…"
                className="flex-1 bg-transparent text-sm text-forest-900 outline-none placeholder:text-forest-400"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="rounded-full p-1 hover:bg-forest-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 max-h-72 overflow-y-auto">
              {query.trim() && results.length === 0 && <p className="px-1 py-4 text-sm text-forest-500">No products found.</p>}
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSearchOpen(false);
                    navigate(ROUTES.productDetail(p.slug));
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-forest-50"
                >
                  <img src={p.main_image_url ?? ""} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="text-sm font-medium text-forest-800">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function navKey(to: string): Parameters<ReturnType<typeof useLanguage>["t"]>[0] {
  switch (to) {
    case ROUTES.home:
      return "nav_home";
    case ROUTES.products:
      return "nav_shop";
    case ROUTES.about:
      return "nav_about";
    case ROUTES.contact:
      return "nav_contact";
    default:
      return "nav_home";
  }
}
