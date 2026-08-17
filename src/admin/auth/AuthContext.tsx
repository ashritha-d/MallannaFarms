import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AdminUser {
  id: string;
  email: string;
  role: "owner" | "admin";
}

interface AuthState {
  // True once the backend has actually responded (even a clean "not signed
  // in") — false only on a genuine network/infra failure reaching /api, so
  // this still distinguishes "backend unreachable" from "just not logged
  // in" the way it did when this meant "Supabase env vars are set".
  configured: boolean;
  // Same value as `user` — kept as a separate field only so existing
  // `!loading && session` truthiness checks (e.g. in Login.tsx) keep
  // working unchanged.
  session: AdminUser | null;
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
        const body = await res.json();
        setUser(body.user ?? null);
        setConfigured(true);
      })
      .catch(() => {
        // A real network/infra failure (e.g. /api not reachable at all —
        // plain `npm run dev` without `vercel dev`), not just "not signed
        // in" (that's a clean 200 with user: null, handled above).
        setUser(null);
        setConfigured(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn: AuthState["signIn"] = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.message ?? "Invalid email or password." };
    }
    const body = await res.json();
    setUser(body.user ?? null);
    return { error: null };
  };

  const signOut: AuthState["signOut"] = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        configured,
        session: user,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
