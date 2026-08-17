import { DatabaseZap } from "lucide-react";

export default function BackendUnavailableBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold-300 bg-gold-50 px-5 py-4 text-sm text-earth-800">
      <DatabaseZap className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
      <div>
        <p className="font-semibold">Can't reach the backend</p>
        <p className="mt-1 text-earth-700">
          The admin API isn't responding. If you're running locally, make sure the site was started with{" "}
          <code className="rounded bg-white/60 px-1 py-0.5">npm run dev:full</code> (not plain{" "}
          <code className="rounded bg-white/60 px-1 py-0.5">npm run dev</code>) and that{" "}
          <code className="rounded bg-white/60 px-1 py-0.5">.env.local</code> has <code className="rounded bg-white/60 px-1 py-0.5">MONGODB_URI</code> set
          (see <code className="rounded bg-white/60 px-1 py-0.5">.env.example</code>). Until it's reachable, admin
          actions here are disabled and the public site shows preview content.
        </p>
      </div>
    </div>
  );
}
