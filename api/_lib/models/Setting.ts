import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true, default: "" },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);
SettingSchema.plugin(idTransform);

export type SettingDoc = InferSchemaType<typeof SettingSchema>;
export const Setting = models.Setting || model("Setting", SettingSchema);
