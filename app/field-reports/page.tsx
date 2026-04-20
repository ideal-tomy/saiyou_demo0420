import Link from "next/link";
import { FileStack, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const reportRows = [
  {
    type: "週次",
    period: "4/13 - 4/19",
    generatedAt: "4/20 09:05",
    sharedTo: "採用責任者 / 営業Mgr",
  },
  {
    type: "月次",
    period: "3/1 - 3/31",
    generatedAt: "4/1 08:40",
    sharedTo: "経営会議",
  },
  {
    type: "週次",
    period: "4/6 - 4/12",
    generatedAt: "4/13 09:10",
    sharedTo: "採用責任者 / 現場リーダー",
  },
] as const;

export default async function FieldReportsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);

  return (
    <TemplatePageStack>
      <DemoStateBridge page="field-reports" highlightedKpiKeys={["followLeakageRate"]} />
      <TemplatePageHeader
        title="レポート自動作成"
        description="選考進捗と評価ログから週次・月次レポートを自動生成し、共有まで最短で完了させる画面です。"
      />

      <div className="flex flex-wrap items-center gap-2">
        <DemoCompleteButton
          label="週次レポートを生成"
          patch={{
            uiStates: { proposalGeneration: "success" },
          }}
          successMessage="週次レポートを生成しました"
        />
        <Button variant="secondary" size="sm">
          PDF出力
        </Button>
        <Button variant="secondary" size="sm" className="gap-1.5">
          <Share2 className="size-4" />
          Slack共有
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted">週次レポート生成数</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tabular-nums">12</p>
            <p className="mt-1 text-xs text-muted">今週 / 自動生成</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted">未送信数</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tabular-nums">2</p>
            <p className="mt-1 text-xs text-muted">本日中に共有推奨</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted">直近改善提案数</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tabular-nums">5</p>
            <p className="mt-1 text-xs text-muted">AI抽出ハイライト</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileStack className="size-5 text-primary" />
            自動生成レポート一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reportRows.map((row) => (
            <div
              key={`${row.type}-${row.period}`}
              className="grid gap-2 rounded-lg border border-border p-3 text-sm sm:grid-cols-[0.6fr_1fr_0.8fr_1fr]"
            >
              <p className="font-medium">{row.type}</p>
              <p className="text-muted">対象期間: {row.period}</p>
              <p className="text-muted">生成時刻: {row.generatedAt}</p>
              <p className="text-muted">共有先: {row.sharedTo}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted">
        本番では評価コメント要約・辞退理由集計・案件別改善提案を同時に生成し、報告品質を平準化します。書類チェックは
        <Link
          href={withIndustryQuery("/documents", industry)}
          className="mx-1 text-primary underline"
        >
          書類管理
        </Link>
        と連携します。
      </p>

      <p className="text-xs text-muted">
        <Link
          href={withIndustryQuery("/operations", industry)}
          className="text-primary underline"
        >
          日程調整
        </Link>
        へ戻って面接枠確定に進みます。
      </p>
    </TemplatePageStack>
  );
}
