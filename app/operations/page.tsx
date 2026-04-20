import Link from "next/link";
import { CalendarClock, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OperationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const hints = getIndustryPageHints(industry).operations;
  const prioritizedTimeline = [...hints.timeline].sort((a, b) => {
    const rank = (badge?: string) =>
      badge === "要対応" ? 0 : badge === "完了" ? 2 : badge === "予定" ? 3 : 1;
    return rank(a.badge) - rank(b.badge);
  });

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="operations"
        opsHealthScore={82}
        highlightedKpiKeys={["followLeakageRate", "timeSavedMinutesPerDay"]}
      />
      <TemplatePageHeader
        title={profile.labels.operations}
        description={profile.operationsDescription}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {hints.kpiTiles.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted">{k.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold tabular-nums">{k.value}</p>
              {k.sub ? (
                <p className="mt-1 text-xs text-muted">{k.sub}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-5 text-primary" />
            直近の採用アクション
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prioritizedTimeline.map((row) => (
            <div
              key={row.title}
              className="flex flex-col gap-1 rounded-lg border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{row.title}</p>
                <p className="text-xs text-muted">{row.time}</p>
              </div>
              {row.badge ? (
                <Badge
                  variant={
                    row.badge === "要対応"
                      ? "warning"
                      : row.badge === "完了"
                        ? "success"
                        : "secondary"
                  }
                  className="w-fit shrink-0"
                >
                  {row.badge}
                </Badge>
              ) : null}
            </div>
          ))}
          <p className="text-xs text-muted">{hints.csvHint}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={withIndustryQuery("/documents", industry)} className="block">
          <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="size-6 text-primary" />
                {profile.labels.documents}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              書類確認と不備解消を進める
            </CardContent>
          </Card>
        </Link>
        <Link href={withIndustryQuery("/revenue", industry)} className="block">
          <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="size-6 text-primary" />
                {profile.labels.revenue}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              採用KPIと歩留まりの変化を確認する
            </CardContent>
          </Card>
        </Link>
      </div>
    </TemplatePageStack>
  );
}
