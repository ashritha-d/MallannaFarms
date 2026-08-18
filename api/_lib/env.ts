// Validates every server-only env var this API needs, at module load time
// (imported first thing by api/index.ts), so a misconfigured deployment
// fails fast with one clear error instead of a confusing failure deep
// inside a random request handler. None of these carry the VITE_ prefix —
// that would bundle them into the browser-shipped client code, which is
// fine for a public anon key (the old Supabase setup) but not for secrets
// like a DB connection string or a JWT signing key.
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Set it in .env.local (dev) or the Vercel project's Environment Variables (deployed).`);
  }
  return value;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
};
