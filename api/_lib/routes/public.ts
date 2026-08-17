// Public-facing routes — no auth, always scoped to active:true. Mirrors
// src/data/content.ts's function list 1:1 (see that file for the fallback
// behavior on the frontend side when these calls fail).
import { Router } from "express";
import { Setting } from "../models/Setting";
import { Product } from "../models/Product";
import { Gallery } from "../models/Gallery";
import { Video } from "../models/Video";
import { Faq } from "../models/Faq";
import { ContactMessage } from "../models/ContactMessage";
import { Order } from "../models/Order";
import { asyncRoute } from "../errors";

export const publicRouter = Router();

publicRouter.get(
  "/api/settings",
  asyncRoute(async (_req, res) => {
    const rows = await Setting.find({});
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    res.json({ data: map });
  })
);

publicRouter.get(
  "/api/products",
  asyncRoute(async (req, res) => {
    const query: Record<string, unknown> = { active: true };
    if (req.query.featured === "true") query.featured = true;
    const products = await Product.find(query).sort({ sort_order: 1 });
    // `gallery: []` matches today's real behavior — content.ts hardcodes
    // this too, since the product_images join table is unused dead code.
    const data = products.map((p) => ({ ...p.toJSON(), gallery: [] }));
    res.json({ data });
  })
);

publicRouter.get(
  "/api/products/:slug",
  asyncRoute(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, active: true });
    res.json({ data: product ? { ...product.toJSON(), gallery: [] } : null });
  })
);

publicRouter.get(
  "/api/gallery",
  asyncRoute(async (_req, res) => {
    const items = await Gallery.find({ active: true }).sort({ sort_order: 1 }).populate("media_id");
    // Mongoose applies each populated doc's own toJSON transform before the
    // parent's, so `json.media_id` here is already the fully-shaped
    // {id, file_url, ...} Media object (or null) — matching
    // GalleryItemWithMedia's `{ media_id: string; media: Media | null }`
    // just needs pulling that object's id back out as the plain FK string.
    const data = items.map((item) => {
      const json = item.toJSON() as Record<string, unknown> & { media_id: { id: string } | null };
      const media = json.media_id;
      return { ...json, media_id: media?.id ?? null, media };
    });
    res.json({ data });
  })
);

publicRouter.get(
  "/api/videos",
  asyncRoute(async (_req, res) => {
    const data = await Video.find({ active: true }).sort({ created_at: -1 });
    res.json({ data });
  })
);

publicRouter.get(
  "/api/faqs",
  asyncRoute(async (_req, res) => {
    const data = await Faq.find({ active: true }).sort({ sort_order: 1 });
    res.json({ data });
  })
);

publicRouter.post(
  "/api/contact",
  asyncRoute(async (req, res) => {
    const { name, phone, email, subject, message } = req.body ?? {};
    await ContactMessage.create({ name, phone: phone || null, email, subject: subject || null, message, status: "new" });
    res.json({ ok: true });
  })
);

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MF-${stamp}-${rand}`;
}

publicRouter.post(
  "/api/orders",
  asyncRoute(async (req, res) => {
    const { customerName, phone, email, address, city, pincode, notes, items, subtotal } = req.body ?? {};
    const orderNumber = generateOrderNumber();
    await Order.create({
      order_number: orderNumber,
      customer_name: customerName,
      phone,
      email: email || null,
      address,
      city: city || null,
      pincode: pincode || null,
      notes: notes || null,
      items,
      subtotal,
      status: "new",
    });
    res.json({ ok: true, orderNumber });
  })
);
