// Shared error shape + Express error handler. `src/admin/lib/adminApi.ts`'s
// friendlyError() helper already duck-types `message`/`hint`/`code` off
// whatever it catches (that's true regardless of backend — it used to read
// those fields off Supabase's PostgrestError, now it reads them off this
// same-shaped JSON body), so keeping this shape is what lets that helper
// work unchanged.
import type { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  status: number;
  code?: string;
  hint?: string;

  constructor(status: number, message: string, opts?: { code?: string; hint?: string }) {
    super(message);
    this.status = status;
    this.code = opts?.code;
    this.hint = opts?.hint;
  }
}

/** Wraps an async Express route handler so a thrown/rejected error reaches the error-handling middleware instead of hanging the request. */
export function asyncRoute(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, code: err.code, hint: err.hint });
    return;
  }
  // Mongoose validation errors and duplicate-key errors are the most common
  // unexpected-but-routine failures here — surface their real reason
  // instead of a bare 500, same spirit as the admin-side friendlyError fix.
  if (err && typeof err === "object" && "name" in err) {
    const e = err as { name: string; message?: string; code?: number };
    if (e.name === "ValidationError") {
      res.status(400).json({ message: e.message ?? "Invalid data.", code: "VALIDATION_ERROR" });
      return;
    }
    if (e.code === 11000) {
      res.status(409).json({ message: "That value is already in use.", code: "DUPLICATE_KEY" });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
