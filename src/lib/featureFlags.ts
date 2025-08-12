export type FeatureFlags = {
  // Toggle between legacy (V1) and new (V2) workshops calendar UI
  workshopsV2: boolean;
};

const STORAGE_KEY = "ff:workshops_v2";

function readBoolean(value: string | null | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  const v = value.toLowerCase();
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return fallback;
}

export function resolveFeatureFlags(): FeatureFlags {
  // Default to V2 enabled
  let workshopsV2 = true;

  try {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("workshops_v2")) {
        workshopsV2 = readBoolean(params.get("workshops_v2"), workshopsV2);
      } else if (params.has("v2")) {
        // Shorthand for QA convenience
        workshopsV2 = readBoolean(params.get("v2"), workshopsV2);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored != null) workshopsV2 = readBoolean(stored, workshopsV2);
      }
    }
  } catch {
    // noop – never break the app for flags
  }

  return { workshopsV2 };
}

export function setWorkshopsV2Enabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // ignore
  }
}
