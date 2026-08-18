// Cloudinary replaces Supabase Storage. The API never receives the actual
// file bytes (Vercel's serverless functions cap request bodies at 4.5MB,
// well under the 100MB video uploads this app already allows) — instead it
// hands the browser a short-lived signed upload request, and the browser
// uploads directly to Cloudinary. See routes/admin.ts's
// POST /api/admin/media/signature + POST /api/admin/media pair.
import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/** Signs the exact params the browser will POST to Cloudinary, so the API secret never leaves the server. */
export function createUploadSignature(category: string): UploadSignature {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `mallanna-farms/${category || "uncategorized"}`;
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, env.CLOUDINARY_API_SECRET);
  return { signature, timestamp, apiKey: env.CLOUDINARY_API_KEY, cloudName: env.CLOUDINARY_CLOUD_NAME, folder };
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: "image" | "video" = "image"): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
