"use client";

import Link from "next/link";
import { CheckSquare, GaugeCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { useDemoState } from "@/components/demo-state-context";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";

type Props = {
  industry: EnabledIndustryKey;
};

export function KnowledgePageClient({ industry }: Props) {
  const hints = getIndustryPageHints(industry).knowledge;
  const { state } = useDemoState();
  const qualityChecklist = [
    {
      title: "未記入検知",
      description: "必須項目が未入力の評価シートを抽出",
      candidate: "高橋 健",
      status: "要修正",
    },
    {
      title: "根拠不足検知",
      description: "評価コメントの根拠文が短いシートを抽出",
      candidate: "佐藤 美咲",
      status: "追記依頼",
    },
    {
      title: "追加質問提案",
      description: "評価差が大きい候補者へ確認質問を提案",
      candidate: "山田 太郎",
      status: "質問生成済",
    },
  ] as const;
  const interviewerTrend = [
    { name: "面接官A", strictness: "やや厳しめ", speed: "平均 7h", variance: "低" },
    { name: "面接官B", strictness: "標準", speed: "平均 12h", variance: "中" },
    { name: "面接官C", strictness: "やや甘め", speed: "平均 18h", variance: "高" },
  ] as const;
  const qualityKpis = [
    { label: "必須項目記入率", value: "92%", sub: "前週比 +4pt" },
    { label: "提出遅延件数", value: "3件", sub: "24h超過" },
    { label: "評価ブレ指数", value: "0.24", sub: "閾値 0.30 以内" },
  ] as const;

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="knowledge"
        highlightedKpiKeys={["knowledgeReuseRate", "timeSavedMinutesPerDay"]}
      />
      <TemplatePageHeader title="面接評価品質管理" description={hints.pageSubtitle} />
      <div className="flex flex-wrap items-center gap-2">
        <DemoCompleteButton
          label="評価レビューを確定"
          patch={{
            knowledgeNoteId: `knowledge-${state.adviceRevision + 1}`,
            adviceRevision: state.adviceRevision + 1,
            uiStates: { knowledgeSync: "success" },
          }}
          successMessage="評価レビューを確定しました"
        />
        <Button variant="secondary" size="sm" asChild>
          <Link href={withIndustryQuery("/matching", industry)}>不足要件を確認</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {qualityKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold tabular-nums">{kpi.value}</p>
              <p className="mt-1 text-xs text-muted">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckSquare className="size-5 text-primary" />
            評価品質チェックリスト
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualityChecklist.map((row) => (
            <div
              key={row.title}
              className="rounded-lg border border-border/80 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <Badge
                  variant={
                    row.status === "要修正"
                      ? "danger"
                      : row.status === "追記依頼"
                        ? "warning"
                        : "success"
                  }
                >
                  {row.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{row.description}</p>
              <p className="mt-1 text-xs text-muted">対象候補者: {row.candidate}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GaugeCircle className="size-5 text-primary" />
            面接官別の評価傾向サマリ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {interviewerTrend.map((row) => (
            <div
              key={row.name}
              className="grid gap-2 rounded-lg border border-border/80 p-3 text-sm sm:grid-cols-4"
            >
              <p className="font-medium">{row.name}</p>
              <p className="text-muted">甘辛傾向: {row.strictness}</p>
              <p className="text-muted">提出速度: {row.speed}</p>
              <p className="text-muted">評価ブレ: {row.variance}</p>
            </div>
          ))}
          <p className="text-xs text-muted">{hints.staticReply}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-primary" />
            関連アクション
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href={withIndustryQuery("/messages", industry)}>評価差分を通知</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href={withIndustryQuery("/candidates", industry)}>候補者へ戻る</Link>
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted">
        必須項目記入率・提出遅延件数・評価ブレ指数を並行監視し、採用判断の品質を標準化します。
      </p>
    </TemplatePageStack>
  );
}
