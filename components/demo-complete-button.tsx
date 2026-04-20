"use client";

import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { DemoSharedStatePatch } from "@/lib/demo-state/types";
import { useDemoState } from "@/components/demo-state-context";

type Props = {
  label: string;
  patch: DemoSharedStatePatch;
  successMessage?: string;
  className?: string;
};

export function DemoCompleteButton({
  label,
  patch,
  successMessage = "完了を反映しました",
  className,
}: Props) {
  const { patchState } = useDemoState();

  return (
    <Button
      type="button"
      className={className}
      onClick={() => {
        patchState({
          ...patch,
          lastActionAt: new Date().toISOString(),
        });
        toast.success(successMessage);
      }}
    >
      <CheckCircle2 className="mr-1 size-4" />
      {label}
    </Button>
  );
}
