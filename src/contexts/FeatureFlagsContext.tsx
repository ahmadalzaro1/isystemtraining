import React, { createContext, useContext, useMemo } from "react";
import { FeatureFlags, resolveFeatureFlags } from "@/lib/featureFlags";

const FeatureFlagsContext = createContext<FeatureFlags | null>(null);

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  // Compute once per app load. Flags can be adjusted via URL/localStorage.
  const flags = useMemo(() => resolveFeatureFlags(), []);
  return <FeatureFlagsContext.Provider value={flags}>{children}</FeatureFlagsContext.Provider>;
}

export function useFeatureFlags(): FeatureFlags {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    // Sensible defaults if provider is missing.
    return { workshopsV2: true, registrationV2: true };
  }
  return ctx;
}
