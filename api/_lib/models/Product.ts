import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    short_description: { type: String, default: null },
    price: { type: Number, required: true, default: 0 },
    discount_price: { type: Number, default: null },
    pack_size: { type: String, default: null },
    egg_count: { type: Number, default: null },
    grade: { type: String, default: null },
    sku: { type: String, default: null },
    barcode: { type: String, default: null },
    category: { type: String, default: "Free Range Eggs" },
    stock_status: {
      type: String,
      required: true,
      enum: ["in_stock", "low_stock", "out_of_stock", "preorder"],
      default: "in_stock",
    },
    features: { type: [String], default: null },
    // Matches Postgres jsonb: a free-form key/value map (e.g. {calories: "143 kcal"}).
    nutrition: { type: Schema.Types.Mixed, default: null },
    feed_info: { type: String, default: null },
    main_image_url: { type: String, default: null },
    video_url: { type: String, default: null },
    featured: { type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
ProductSchema.plugin(idTransform);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export const Product = models.Product || model("Product", ProductSchema);
