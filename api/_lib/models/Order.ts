import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { idTransform } from "./plugins/idTransform.js";
const { Schema, model, models } = mongoose;

const OrderLineItemSchema = new Schema(
  {
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    pack_size: { type: String, default: null },
    image: { type: String, default: null },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    order_number: { type: String, required: true, unique: true },
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    address: { type: String, required: true },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    notes: { type: String, default: null },
    items: { type: [OrderLineItemSchema], required: true, default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ["new", "confirmed", "out_for_delivery", "delivered", "cancelled"],
      default: "new",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
OrderSchema.plugin(idTransform);

export type OrderDoc = InferSchemaType<typeof OrderSchema>;
export const Order = models.Order || model("Order", OrderSchema);
