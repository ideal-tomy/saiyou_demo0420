"use client";

import { Badge } from "@/components/ui/badge";
import { getKpiMeta, type KpiKey } from "@/lib/kpi-dictionary";

type Props = {
  keys: KpiKey[];
};

export function DemoKpiStrip({ keys }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key) => {
        const meta = getKpiMeta(key);
        return (
          <Badge key={key} variant="secondary">
            {meta.label} ({meta.unit})
          </Badge>
        );
      })}
    </div>
  );
}
