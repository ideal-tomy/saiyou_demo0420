import Link from "next/link";
import { ArrowLeft, CalendarCheck2, CalendarClock, Bell } from "lucide-react";
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
  const weekDays = ["月", "火", "水", "木", "金", "土", "日"] as const;
  const calendarRows = [
    {
      day: "4/21",
      weekday: "月",
      slots: [
        { time: "10:00", label: "山田 太郎 / 一次面接", type: "interview" },
        { time: "14:00", label: "青葉ソリューションズ 面接枠", type: "client" },
      ],
      interviewer: "面接官A: 13:00-18:00 空き",
    },
    {
      day: "4/22",
      weekday: "火",
      slots: [
        { time: "11:00", label: "佐藤 美咲 / 最終面接", type: "interview" },
        { time: "16:30", label: "みらいキャリアデザイン 面接枠", type: "client" },
      ],
      interviewer: "面接官B: 10:00-12:00 空き",
    },
    {
      day: "4/23",
      weekday: "水",
      slots: [{ time: "09:30", label: "高橋 健 / カジュアル面談", type: "interview" }],
      interviewer: "面接官C: 15:00-19:00 空き",
    },
    {
      day: "4/24",
      weekday: "木",
      slots: [{ time: "13:00", label: "フロントラインワークス 面接枠", type: "client" }],
      interviewer: "面接官A: 9:00-11:30 空き",
    },
    {
      day: "4/25",
      weekday: "金",
      slots: [{ time: "15:00", label: "面接予備枠（再調整用）", type: "buffer" }],
      interviewer: "面接官B: 13:00-17:00 空き",
    },
  ] as const;

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="operations"
        opsHealthScore={82}
        highlightedKpiKeys={["followLeakageRate", "timeSavedMinutesPerDay"]}
      />
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 self-start">
        <Link href={withIndustryQuery("/", industry)}>
          <ArrowLeft className="size-4" />
          ダッシュボードへ戻る
        </Link>
      </Button>
      <TemplatePageHeader
        title="日程調整"
        description={hints.operations.csvHint}
      />

      <div className="flex flex-wrap items-center gap-2">
        <DemoCompleteButton
          label="最優先案件の面接枠を確定する"
          patch={{
            uiStates: { proposalGeneration: "success" },
            opsHealthScore: 84,
            followReasonLabel: "日程調整を確定",
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">面接日程カレンダー（デモ）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {weekDays.map((day) => (
              <div key={day} className="rounded-md bg-surface py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {calendarRows.map((row) => (
              <div key={`${row.day}-${row.weekday}`} className="rounded-lg border border-border p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    {row.day}（{row.weekday}）
                  </p>
                  <p className="text-xs text-muted">{row.interviewer}</p>
                </div>
                <div className="space-y-1.5">
                  {row.slots.map((slot) => (
                    <div key={`${row.day}-${slot.time}-${slot.label}`} className="flex items-center gap-2 text-sm">
                      <span className="w-16 shrink-0 text-xs font-medium text-muted">{slot.time}</span>
                      <Badge
                        variant={
                          slot.type === "interview"
                            ? "success"
                            : slot.type === "client"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {slot.type === "interview"
                          ? "候補者面談"
                          : slot.type === "client"
                            ? "企業枠"
                            : "予備枠"}
                      </Badge>
                      <span className="truncate">{slot.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-5 text-primary" />
            期限順オペレーションキュー
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">次にやること</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Link href={withIndustryQuery("/knowledge", industry)} className="text-primary underline-offset-2 hover:underline">
            面接評価品質を確認する
          </Link>
          <span className="text-muted">/</span>
          <Link href={withIndustryQuery("/documents", industry)} className="text-primary underline-offset-2 hover:underline">
            書類不備の復帰状況を確認する
          </Link>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}
