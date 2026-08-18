import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const MediaSchema = new Schema(
  {
    file_name: { type: String, required: true },
    file_url: { type: String, required: true },
    file_type: { type: String, required: true, enum: ["image", "video"] },
    mime_type: { type: String, required: true },
    file_size: { type: Number, required: true, default: 0 },
    title: { type: String, default: null },
    caption: { type: String, default: null },
    alt_text: { type: String, default: null },
    description: { type: String, default: null },
    category: { type: String, default: null },
    // Cloudinary's asset id — needed server-side to delete the underlying
    // file (`uploader.destroy`) when a media doc is deleted. Not part of
    // the original Supabase Storage-backed shape, but harmless to expose:
    // it's a Cloudinary asset id, not a secret.
    cloudinary_public_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
MediaSchema.plugin(idTransform);

export type MediaDoc = InferSchemaType<typeof MediaSchema>;
export const Media = models.Media || model("Media", MediaSchema);
