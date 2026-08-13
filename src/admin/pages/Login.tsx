import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAdminAuth } from "../auth/AuthContext";
import { LOGO } from "@/data/seed";
import Seo from "@/components/seo/Seo";

export default function Login() {
  const { signIn, resetPassword, session, configured, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!loading && session) {
    const from = (location.state as { from?: Location })?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);
    if (res.error) setError(res.error);
    else navigate("/admin");
  };

  const onForgot = async () => {
    if (!email) {
      setError("Enter your email address first, then click 'Forgot password'.");
      return;
    }
    const res = await resetPassword(email);
    if (res.error) setError(res.error);
    else setResetSent(true);
  };

  return (
    <>
      <Seo title="Admin Login" description="Mallanna Farms admin dashboard login." path="/admin/login" />
      <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4 py-12 safe-top safe-bottom">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <img src={LOGO.primary} alt="Mallanna Farms" className="h-16 w-16 rounded-full object-cover shadow-lift" />
            <h1 className="mt-4 font-display text-2xl font-semibold text-cream-50">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-forest-300">Sign in to manage Mallanna Farms</p>
          </div>

          {!configured && (
            <div className="mt-6 rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-3 text-sm text-gold-200">
              Supabase isn't connected yet. Add your credentials to <code>.env</code> (see <code>.env.example</code>)
              and create an admin user in Supabase Auth to enable login.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-lift sm:p-8">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-forest-800">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  disabled={!configured}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-forest-800">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  disabled={!configured}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-earth-50 px-3 py-2 text-xs text-earth-700" role="alert">
                {error}
              </p>
            )}
            {resetSent && (
              <p className="rounded-lg bg-forest-50 px-3 py-2 text-xs text-forest-700">
                If an account exists for that email, a password reset link has been sent.
              </p>
            )}

            <button type="submit" disabled={!configured || submitting} className="btn-primary w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Signing in…" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={onForgot}
              disabled={!configured}
              className="w-full text-center text-xs font-medium text-forest-500 hover:text-gold-600 disabled:opacity-50"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
