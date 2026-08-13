import { DatabaseZap } from "lucide-react";

export default function ConnectSupabaseBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold-300 bg-gold-50 px-5 py-4 text-sm text-earth-800">
      <DatabaseZap className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
      <div>
        <p className="font-semibold">Supabase is not connected yet</p>
        <p className="mt-1 text-earth-700">
          Add <code className="rounded bg-white/60 px-1 py-0.5">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-white/60 px-1 py-0.5">VITE_SUPABASE_ANON_KEY</code> to your <code className="rounded bg-white/60 px-1 py-0.5">.env</code> file,
          run <code className="rounded bg-white/60 px-1 py-0.5">supabase/schema.sql</code> against your project, then
          restart the dev server. Until then, admin actions here are disabled and the public site shows preview
          content.
        </p>
      </div>
    </div>
  );
}
