import { useEffect, useState } from "react";
import { getSettings, type DataSource } from "@/data/content";
import { DEFAULT_SETTINGS } from "@/data/seed";

let cache: { data: Record<string, string>; source: DataSource } | null = null;
// Tracks a fetch already in flight so simultaneously-mounting components
// share one request instead of each firing its own. Without this, every
// consumer that mounts before the first fetch resolves independently calls
// load() (since cache is still null for all of them), and whichever of
// those overlapping calls happens to *resolve last* wins — silently
// clobbering `cache` even if an earlier call already had good data. Real
// bug, not hypothetical: reproduced it with 5+ concurrent useSettings()
// consumers on the homepage (Navbar, trust strip, Footer, floating
// buttons, ...) — the last-resolving call intermittently landed on the
// seed fallback and every component then displayed stale/placeholder data
// despite the live fetch having already succeeded moments earlier.
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function load(): Promise<void> {
  if (!inFlight) {
    inFlight = getSettings()
      .then((result) => {
        cache = { data: result.data, source: result.source };
        listeners.forEach((l) => l());
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/** Shared, cached site settings (hero text, contact info, social links, etc). */
export function useSettings() {
  const [state, setState] = useState(cache ?? { data: DEFAULT_SETTINGS, source: "seed" as DataSource });

  useEffect(() => {
    const listener = () => cache && setState(cache);
    listeners.add(listener);
    if (!cache) load();
    else setState(cache);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}

/** Call after an admin saves settings so every mounted component refreshes. */
export function invalidateSettingsCache() {
  cache = null;
  load();
}
