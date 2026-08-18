import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Never returned in a toJSON'd response (select:false) — callers that
    // genuinely need it (login, change-password) must opt in with
    // `.select("+passwordHash")`.
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ["owner", "admin"], default: "admin" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
AdminSchema.plugin(idTransform);

export type AdminDoc = InferSchemaType<typeof AdminSchema>;
export const Admin = models.Admin || model("Admin", AdminSchema);
