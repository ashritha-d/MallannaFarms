import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ROUTES } from "@/routes";
import { AdminAuthProvider } from "@/admin/auth/AuthContext";
import ProtectedRoute from "@/admin/auth/ProtectedRoute";
import { ToastProvider } from "@/admin/components/Toast";
import AdminLayout from "@/admin/components/AdminLayout";
import Login from "@/admin/pages/Login";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Mission from "@/pages/Mission";
import Vision from "@/pages/Vision";
import MissionVision from "@/pages/MissionVision";
import OurFarm from "@/pages/OurFarm";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/Wishlist";
import Gallery from "@/pages/Gallery";
import Videos from "@/pages/Videos";
import WhyChooseUs from "@/pages/WhyChooseUs";
import WhyFreeRange from "@/pages/WhyFreeRange";
import Delivery from "@/pages/Delivery";
import Contact from "@/pages/Contact";
import FaqPage from "@/pages/Faq";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

const Dashboard = lazy(() => import("@/admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("@/admin/pages/Products"));
const ProductForm = lazy(() => import("@/admin/pages/ProductForm"));
const AdminOrders = lazy(() => import("@/admin/pages/Orders"));
const AdminMedia = lazy(() => import("@/admin/pages/Media"));
const AdminGallery = lazy(() => import("@/admin/pages/Gallery"));
const AdminVideos = lazy(() => import("@/admin/pages/Videos"));
const AdminContent = lazy(() => import("@/admin/pages/Content"));
const AdminFaqs = lazy(() => import("@/admin/pages/Faqs"));
const AdminEnquiries = lazy(() => import("@/admin/pages/Enquiries"));
const AdminSettings = lazy(() => import("@/admin/pages/Settings"));
const AdminSocial = lazy(() => import("@/admin/pages/Social"));
const AdminProfile = lazy(() => import("@/admin/pages/Profile"));

function AdminFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="skeleton h-10 w-40" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.about} element={<About />} />
          <Route path={ROUTES.mission} element={<Mission />} />
          <Route path={ROUTES.vision} element={<Vision />} />
          <Route path={ROUTES.missionVision} element={<MissionVision />} />
          <Route path={ROUTES.farm} element={<OurFarm />} />
          <Route path={ROUTES.products} element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path={ROUTES.checkout} element={<Checkout />} />
          <Route path={ROUTES.wishlist} element={<Wishlist />} />
          <Route path={ROUTES.gallery} element={<Gallery />} />
          <Route path={ROUTES.videos} element={<Videos />} />
          <Route path={ROUTES.whyChooseUs} element={<WhyChooseUs />} />
          <Route path={ROUTES.whyFreeRange} element={<WhyFreeRange />} />
          <Route path={ROUTES.delivery} element={<Delivery />} />
          <Route path={ROUTES.contact} element={<Contact />} />
          <Route path={ROUTES.faq} element={<FaqPage />} />
          <Route path={ROUTES.privacy} element={<Privacy />} />
          <Route path={ROUTES.terms} element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <ToastProvider>
                <Suspense fallback={<AdminFallback />}>
                  <Routes>
                    <Route path="login" element={<Login />} />
                    <Route
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/new" element={<ProductForm />} />
                      <Route path="products/:id/edit" element={<ProductForm />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="media" element={<AdminMedia />} />
                      <Route path="gallery" element={<AdminGallery />} />
                      <Route path="videos" element={<AdminVideos />} />
                      <Route path="content" element={<AdminContent />} />
                      <Route path="faqs" element={<AdminFaqs />} />
                      <Route path="enquiries" element={<AdminEnquiries />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="social" element={<AdminSocial />} />
                      <Route path="profile" element={<AdminProfile />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ToastProvider>
            </AdminAuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
