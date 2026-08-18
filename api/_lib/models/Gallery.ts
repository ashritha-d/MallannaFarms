import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const GallerySchema = new Schema(
  {
    media_id: { type: Schema.Types.ObjectId, ref: "Media", required: true },
    title: { type: String, default: null },
    description: { type: String, default: null },
    category: { type: String, required: true, default: "Our Farm" },
    sort_order: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
GallerySchema.plugin(idTransform);

export type GalleryDoc = InferSchemaType<typeof GallerySchema>;
export const Gallery = models.Gallery || model("Gallery", GallerySchema);
