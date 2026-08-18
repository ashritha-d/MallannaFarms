// Login/session/logout — deliberately NOT behind requireAdmin (you can't
// require a session to sign in, and logout/session-check need to work for
// a logged-out visitor too). Contrast with change-password in routes/admin.ts,
// which does require an existing session.
import { Router } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { signToken, setAuthCookie, clearAuthCookie, readAdminSession } from "../auth.js";
import { asyncRoute } from "../errors.js";

export const authRouter = Router();

authRouter.post(
  "/api/auth/login",
  asyncRoute(async (req, res) => {
    const { email, password } = req.body ?? {};
    const admin = await Admin.findOne({ email: String(email ?? "").toLowerCase().trim() }).select("+passwordHash");
    const valid = admin && (await bcrypt.compare(password ?? "", admin.passwordHash));
    if (!admin || !valid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    const token = signToken({ sub: String(admin._id), email: admin.email, role: admin.role });
    setAuthCookie(res, token);
    res.json({ user: { id: String(admin._id), email: admin.email, role: admin.role } });
  })
);

authRouter.get("/api/auth/session", (req, res) => {
  const payload = readAdminSession(req);
  res.json({ user: payload ? { id: payload.sub, email: payload.email, role: payload.role } : null });
});

authRouter.post("/api/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});
