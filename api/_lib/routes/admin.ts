// Admin-only routes — every route here requires a valid session cookie
// (mounted behind requireAdmin in api/index.ts) and never filters by
// `active`, mirroring src/admin/lib/adminApi.ts's function list 1:1.
import { Router } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { Media } from "../models/Media";
import { Product } from "../models/Product";
import { Gallery } from "../models/Gallery";
import { Video } from "../models/Video";
import { Faq } from "../models/Faq";
import { Setting } from "../models/Setting";
import { ContactMessage } from "../models/ContactMessage";
import { Order } from "../models/Order";
import { asyncRoute, ApiError } from "../errors";
import { createUploadSignature, deleteCloudinaryAsset } from "../cloudinary";

export const adminRouter = Router();

// ---------- Auth (change-password only — login/session/logout live in routes/auth.ts, unauthenticated by design) ----------
adminRouter.post(
  "/api/auth/change-password",
  asyncRoute(async (req, res) => {
    const { password } = req.body ?? {};
    if (!password || typeof password !== "string" || password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters.");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.findByIdAndUpdate(req.admin!.sub, { passwordHash });
    res.json({ ok: true });
  })
);

// ---------- Dashboard ----------
adminRouter.get(
  "/api/admin/dashboard/stats",
  asyncRoute(async (_req, res) => {
    const [totalProducts, activeProducts, mediaCount, videoCount, galleryCount, newEnquiries, newOrders] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ active: true }),
      Media.countDocuments({}),
      Video.countDocuments({}),
      Gallery.countDocuments({}),
      ContactMessage.countDocuments({ status: "new" }),
      Order.countDocuments({ status: "new" }),
    ]);
    res.json({ data: { totalProducts, activeProducts, mediaCount, videoCount, galleryCount, newEnquiries, newOrders } });
  })
);

// ---------- Products ----------
adminRouter.get(
  "/api/admin/products",
  asyncRoute(async (_req, res) => {
    const data = await Product.find({}).sort({ sort_order: 1 });
    res.json({ data });
  })
);

adminRouter.get(
  "/api/admin/products/:id",
  asyncRoute(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found.");
    res.json({ data: product });
  })
);

adminRouter.post(
  "/api/admin/products",
  asyncRoute(async (req, res) => {
    const product = await Product.create(req.body ?? {});
    res.json({ data: product });
  })
);

adminRouter.put(
  "/api/admin/products/:id",
  asyncRoute(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
    if (!product) throw new ApiError(404, "Product not found.");
    res.json({ data: product });
  })
);

adminRouter.delete(
  "/api/admin/products/:id",
  asyncRoute(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);

// ---------- Media ----------
adminRouter.get(
  "/api/admin/media",
  asyncRoute(async (_req, res) => {
    const data = await Media.find({}).sort({ created_at: -1 });
    res.json({ data });
  })
);

adminRouter.post(
  "/api/admin/media/signature",
  asyncRoute(async (req, res) => {
    const { category } = req.body ?? {};
    res.json({ data: createUploadSignature(category ?? "") });
  })
);

// Called after the browser has already uploaded the file straight to
// Cloudinary (see api/_lib/cloudinary.ts) — this just persists the
// resulting metadata, it never receives the file itself.
adminRouter.post(
  "/api/admin/media",
  asyncRoute(async (req, res) => {
    const media = await Media.create(req.body ?? {});
    res.json({ data: media });
  })
);

adminRouter.patch(
  "/api/admin/media/:id",
  asyncRoute(async (req, res) => {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
    if (!media) throw new ApiError(404, "Media not found.");
    res.json({ data: media });
  })
);

adminRouter.delete(
  "/api/admin/media/:id",
  asyncRoute(async (req, res) => {
    const media = await Media.findById(req.params.id);
    if (!media) throw new ApiError(404, "Media not found.");
    if (media.cloudinary_public_id) {
      await deleteCloudinaryAsset(media.cloudinary_public_id, media.file_type === "video" ? "video" : "image");
    }
    await Media.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);

// ---------- Gallery ----------
adminRouter.get(
  "/api/admin/gallery",
  asyncRoute(async (_req, res) => {
    const items = await Gallery.find({}).sort({ sort_order: 1 }).populate("media_id");
    const data = items.map((item) => {
      const json = item.toJSON() as Record<string, unknown> & { media_id: { id: string } | null };
      const media = json.media_id;
      return { ...json, media_id: media?.id ?? null, media };
    });
    res.json({ data });
  })
);

adminRouter.post(
  "/api/admin/gallery",
  asyncRoute(async (req, res) => {
    const item = await Gallery.create(req.body ?? {});
    res.json({ data: item });
  })
);

adminRouter.put(
  "/api/admin/gallery/:id",
  asyncRoute(async (req, res) => {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
    if (!item) throw new ApiError(404, "Gallery item not found.");
    res.json({ data: item });
  })
);

adminRouter.delete(
  "/api/admin/gallery/:id",
  asyncRoute(async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);

// ---------- Videos ----------
adminRouter.get(
  "/api/admin/videos",
  asyncRoute(async (_req, res) => {
    const data = await Video.find({}).sort({ created_at: -1 });
    res.json({ data });
  })
);

adminRouter.post(
  "/api/admin/videos",
  asyncRoute(async (req, res) => {
    const video = await Video.create(req.body ?? {});
    res.json({ data: video });
  })
);

adminRouter.put(
  "/api/admin/videos/:id",
  asyncRoute(async (req, res) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
    if (!video) throw new ApiError(404, "Video not found.");
    res.json({ data: video });
  })
);

adminRouter.delete(
  "/api/admin/videos/:id",
  asyncRoute(async (req, res) => {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);

// ---------- FAQs ----------
adminRouter.get(
  "/api/admin/faqs",
  asyncRoute(async (_req, res) => {
    const data = await Faq.find({}).sort({ sort_order: 1 });
    res.json({ data });
  })
);

adminRouter.post(
  "/api/admin/faqs",
  asyncRoute(async (req, res) => {
    const faq = await Faq.create(req.body ?? {});
    res.json({ data: faq });
  })
);

adminRouter.put(
  "/api/admin/faqs/:id",
  asyncRoute(async (req, res) => {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
    if (!faq) throw new ApiError(404, "FAQ not found.");
    res.json({ data: faq });
  })
);

adminRouter.delete(
  "/api/admin/faqs/:id",
  asyncRoute(async (req, res) => {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);

// ---------- Settings ----------
// Bulk upsert-by-key, matching adminApi.saveSettings(values: Record<string,string>).
adminRouter.put(
  "/api/admin/settings",
  asyncRoute(async (req, res) => {
    const values = (req.body ?? {}) as Record<string, string>;
    await Promise.all(
      Object.entries(values).map(([key, value]) => Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true }))
    );
    res.json({ data: null });
  })
);

// ---------- Enquiries (contact_messages) ----------
adminRouter.get(
  "/api/admin/enquiries",
  asyncRoute(async (_req, res) => {
    const data = await ContactMessage.find({}).sort({ created_at: -1 });
    res.json({ data });
  })
);

adminRouter.patch(
  "/api/admin/enquiries/:id",
  asyncRoute(async (req, res) => {
    const { status } = req.body ?? {};
    await ContactMessage.findByIdAndUpdate(req.params.id, { status });
    res.json({ data: null });
  })
);

adminRouter.delete(
  "/api/admin/enquiries/:id",
  asyncRoute(async (req, res) => {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);

// ---------- Orders ----------
adminRouter.get(
  "/api/admin/orders",
  asyncRoute(async (_req, res) => {
    const data = await Order.find({}).sort({ created_at: -1 });
    res.json({ data });
  })
);

adminRouter.patch(
  "/api/admin/orders/:id",
  asyncRoute(async (req, res) => {
    const { status } = req.body ?? {};
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ data: null });
  })
);

adminRouter.delete(
  "/api/admin/orders/:id",
  asyncRoute(async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ data: null });
  })
);
