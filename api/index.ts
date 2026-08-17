// Single Express app handling every /api/* request, exported directly as
// the Vercel Node function handler (Vercel supports an Express app's own
// (req, res) signature natively — no serverless-http wrapper needed). See
// vercel.json for the rewrite that routes every /api/* request here; note
// that rewrite does NOT strip the path, so every route below is registered
// with its full "/api/..." prefix rather than a relative one.
//
// Route registration order matters: publicRouter and authRouter are
// unauthenticated and mounted first so they can fully handle their own
// paths; requireAdmin only runs for whatever's left, immediately before
// adminRouter, so it gates admin routes without touching public ones.
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./_lib/db";
import { requireAdmin } from "./_lib/auth";
import { errorHandler } from "./_lib/errors";
import { publicRouter } from "./_lib/routes/public";
import { authRouter } from "./_lib/routes/auth";
import { adminRouter } from "./_lib/routes/admin";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    res.status(503).json({ message: "Database unavailable. Please try again shortly." });
  }
});

app.use(publicRouter);
app.use(authRouter);
app.use(requireAdmin);
app.use(adminRouter);

app.use((req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.path}` });
});

app.use(errorHandler);

export default app;
