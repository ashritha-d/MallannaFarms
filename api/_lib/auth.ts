// JWT session handling for the /admin panel. Same-origin SPA + API on one
// Vercel deployment, no OAuth-style cross-site redirect ever needs to carry
// this cookie — so httpOnly + Secure + SameSite=Strict costs nothing and is
// meaningfully safer than a localStorage bearer token (immune to XSS token
// theft) or SameSite=Lax (stricter CSRF protection).
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

const COOKIE_NAME = "mf_admin_session";
const TOKEN_TTL = "7d";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface AdminTokenPayload {
  sub: string;
  email: string;
  role: "owner" | "admin";
}

export function signToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/** Reads and verifies the session cookie without side effects — returns null rather than rejecting, so `/api/auth/session` can distinguish "not signed in" (200, user: null) from an actual server error. */
export function readAdminSession(req: Request): AdminTokenPayload | null {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) return null;
  try {
    return jwt.verify(raw, env.JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

// Extends Express's Request type so `req.admin` is recognized everywhere
// without an `as` cast at every call site.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

/** Rejects the request with 401 unless a valid admin session cookie is present. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const payload = readAdminSession(req);
  if (!payload) {
    res.status(401).json({ message: "Not signed in." });
    return;
  }
  req.admin = payload;
  next();
}
