import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingActionButtons from "@/components/ui/FloatingActionButtons";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ROUTES } from "@/routes";

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.home;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <LanguageProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            {isHome && <Footer />}
            <CartDrawer />
            <FloatingActionButtons />
          </div>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
}
