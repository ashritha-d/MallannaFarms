import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform";
const { Schema, model, models } = mongoose;

// No timestamps — the original Postgres `faqs` table genuinely has no
// created_at/updated_at column, and nothing reads one.
const FaqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: null },
  sort_order: { type: Number, required: true, default: 0 },
  active: { type: Boolean, required: true, default: true },
});
FaqSchema.plugin(idTransform);

export type FaqDoc = InferSchemaType<typeof FaqSchema>;
export const Faq = models.Faq || model("Faq", FaqSchema);
