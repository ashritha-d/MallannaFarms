import { useEffect, useState } from "react";
import { getSettings, type DataSource } from "@/data/content";
import { DEFAULT_SETTINGS } from "@/data/seed";

let cache: { data: Record<string, string>; source: DataSource } | null = null;
const listeners = new Set<() => void>();

async function load() {
  const result = await getSettings();
  cache = { data: result.data, source: result.source };
  listeners.forEach((l) => l());
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
