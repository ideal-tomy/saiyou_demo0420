"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { DemoSharedState, DemoSharedStatePatch } from "@/lib/demo-state/types";
import { initialDemoSharedState } from "@/lib/demo-state/types";

type DemoStateContextValue = {
  state: DemoSharedState;
  patchState: (patch: DemoSharedStatePatch) => void;
};

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoSharedState>(initialDemoSharedState);

  const patchState = useCallback((patch: DemoSharedStatePatch) => {
    setState((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      patchState,
    }),
    [patchState, state],
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error("useDemoState must be used within DemoStateProvider.");
  }
  return context;
}
