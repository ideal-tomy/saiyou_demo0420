"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";
import { DemoStateProvider } from "@/components/demo-state-context";
import { IndustryProvider } from "@/components/industry-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <IndustryProvider>
          <DemoStateProvider>{children}</DemoStateProvider>
        </IndustryProvider>
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
