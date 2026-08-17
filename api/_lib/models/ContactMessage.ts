import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform";
const { Schema, model, models } = mongoose;

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, required: true },
    subject: { type: String, default: null },
    message: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["new", "read", "responded", "archived"],
      default: "new",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
ContactMessageSchema.plugin(idTransform);

export type ContactMessageDoc = InferSchemaType<typeof ContactMessageSchema>;
export const ContactMessage = models.ContactMessage || model("ContactMessage", ContactMessageSchema);
