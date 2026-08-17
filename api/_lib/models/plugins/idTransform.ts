// Applied to every model below. Mongo's native primary key is `_id` (an
// ObjectId), but the whole frontend — carried over unchanged from the
// Postgres/Supabase era — reads a plain string `id` field on every record
// (`product.id`, `galleryItem.id`, etc., across dozens of components).
// Rather than touch every one of those call sites, every model gets this
// same toJSON transform so API responses always shape up as `{ id: "...",
// ...rest }` with no `_id`/`__v` leaking out.
import type { Schema } from "mongoose";

export function idTransform(schema: Schema) {
  schema.set("toJSON", {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}
