import Link from "next/link";
import { CalendarCheck2, CalendarClock, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
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
  const hints = getIndustryPageHints(industry);
  const scheduleRows = [
    {
      candidate: "山田 太郎",
      stage: "一次面接",
      due: "本日 17:00",
      recommendedSlot: "4/22(水) 10:30-11:00",
      action: "候補枠を提示",
      badge: "要対応",
    },
    {
      candidate: "佐藤 美咲",
      stage: "最終面接",
      due: "本日 18:00",
      recommendedSlot: "4/23(木) 14:00-14:45",
      action: "企業確認待ち",
      badge: "期限注意",
    },
    {
      candidate: "高橋 健",
      stage: "カジュアル面談",
      due: "明日 10:00",
      recommendedSlot: "4/24(金) 09:30-10:00",
      action: "再調整",
      badge: "再調整",
    },
  ] as const;

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="operations"
        opsHealthScore={82}
        highlightedKpiKeys={["followLeakageRate", "timeSavedMinutesPerDay"]}
      />
      <TemplatePageHeader
        title="日程調整"
        description={hints.operations.csvHint}
      />

      <div className="flex flex-wrap items-center gap-2">
        <DemoCompleteButton
          label="面接枠を確定"
          patch={{
            uiStates: { proposalGeneration: "success" },
          }}
          successMessage="面接枠の確定を反映しました"
        />
        <Button variant="secondary" size="sm" className="gap-1.5">
          <Bell className="size-4" />
          通知を送信
        </Button>
        <Button variant="secondary" size="sm">
          再調整する
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {hints.operations.kpiTiles.map((k) => (
          <Card key={k.label} className="min-h-[112px]">
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
            要調整リスト
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scheduleRows.map((row) => (
            <div
              key={`${row.candidate}-${row.stage}`}
              className="rounded-lg border border-border/80 p-3"
            >
              <div className="grid gap-2 sm:grid-cols-[1.2fr_0.9fr_0.9fr_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    {row.candidate} / {row.stage}
                  </p>
                  <p className="text-xs text-muted">主アクション: {row.action}</p>
                </div>
                <p className="text-xs text-muted">期限: {row.due}</p>
                <p className="text-xs text-muted">推奨枠: {row.recommendedSlot}</p>
                <Badge
                  variant={
                    row.badge === "要対応"
                      ? "warning"
                      : row.badge === "期限注意"
                        ? "danger"
                        : "secondary"
                  }
                  className="w-fit"
                >
                  {row.badge}
                </Badge>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted">
            候補者 / ステージ / 期限 / 推奨枠を同時に確認し、調整停滞を防ぎます。
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={withIndustryQuery("/candidates", industry)} className="block">
          <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarCheck2 className="size-6 text-primary" />
                候補者一覧
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              候補者の優先度と次アクションを確認する
            </CardContent>
          </Card>
        </Link>
        <Link href={withIndustryQuery("/knowledge", industry)} className="block">
          <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarCheck2 className="size-6 text-primary" />
                面接評価品質管理
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              評価未入力と評価ブレを先回りで確認する
            </CardContent>
          </Card>
        </Link>
      </div>
    </TemplatePageStack>
  );
}
