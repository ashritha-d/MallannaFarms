// One-off local script — creates (or resets the password of) the single
// admin account this site needs. There's no in-app "forgot password" email
// flow (see AuthContext.tsx's comment for why), so this script doubles as
// the recovery path if the password is ever lost: just rerun it.
//
// Usage:
//   npm run seed:admin -- you@example.com "a-strong-password" [owner|admin]
//
// Reads MONGODB_URI from .env.local (same file `vercel dev` reads from).
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../api/_lib/models/Admin";

async function main() {
  const [email, password, role] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- you@example.com "a-strong-password" [owner|admin]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — add it to .env.local first.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 10);
  const normalizedEmail = email.toLowerCase().trim();
  const admin = await Admin.findOneAndUpdate(
    { email: normalizedEmail },
    { email: normalizedEmail, passwordHash, role: role === "owner" || role === "admin" ? role : "owner" },
    { upsert: true, new: true }
  );
  console.log(`Admin account ready: ${admin.email} (role: ${admin.role}, id: ${admin._id}).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
