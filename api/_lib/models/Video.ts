import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const VideoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    video_url: { type: String, required: true },
    thumbnail_url: { type: String, default: null },
    category: { type: String, default: null },
    featured: { type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
VideoSchema.plugin(idTransform);

export type VideoDoc = InferSchemaType<typeof VideoSchema>;
export const Video = models.Video || model("Video", VideoSchema);
